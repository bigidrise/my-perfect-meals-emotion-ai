
import "./bootstrap-fetch";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crash prevention: log errors instead of dying silently
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION:', reason);
  console.error('Promise:', promise);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 UNCAUGHT EXCEPTION:', error);
  // Don't exit in production - log and continue for stability
});

// Import your main server setup
import { registerRoutes } from "./routes";
import { requestId } from "./middleware/requestId";
import { logger } from "./middleware/logger";
import { createApiRateLimit } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Trust proxy for correct IP handling in Railway/Replit
app.set('trust proxy', 1);

// CRITICAL: Health check MUST be first, before any async operations
// Autoscale deployment needs immediate HTTP response
app.get("/healthz", (_req, res) => res.status(200).send("ok"));
app.get("/api/health", (_req, res) => res.json({ 
  ok: true, 
  timestamp: new Date().toISOString(),
  env: process.env.NODE_ENV || "production",
  hasDatabase: !!process.env.DATABASE_URL
}));

// Version endpoint to verify deployments
app.get("/__version", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ 
    v: process.env.REPL_COMMIT_SHA || Date.now().toString(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "production"
  });
});

// Create rate limiter ONCE at app initialization (after trust proxy is set)
const apiRateLimit = createApiRateLimit();

// Production middleware
app.use(requestId);
app.use(logger);

// CORS headers with credentials support
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    process.env.APP_ORIGIN,
    process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
  ].filter(Boolean);

  // Allow requests with no origin (same-origin) or from allowed origins
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || allowedOrigins[0] || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id, x-device-id');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// Disable caching on macros endpoints
app.use((req, res, next) => {
  if (req.path.includes("/macros")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});

app.use("/api", apiRateLimit);

// Listen on PORT immediately, BEFORE async registerRoutes
// This ensures health checks work during deployment
const port = Number(process.env.PORT || 5000);
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Production server running on port ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "production"}`);
  console.log(`🔗 Database: ${process.env.DATABASE_URL ? "Connected" : "Not configured"}`);
});

// Register routes asynchronously AFTER server is listening
async function registerAppRoutes() {
  try {
    // Register all API routes (async operation)
    await registerRoutes(app);
    console.log("✅ Routes registered successfully");

    // API guard: any /api/* that slipped past routers -> JSON 404
    app.use("/api", (req, res) => {
      console.log(`🚫 API 404: ${req.method} ${req.originalUrl}`);
      res.status(404).type("application/json").send(JSON.stringify({ error: "API endpoint not found" }));
    });

    // Serve static files from client build with proper cache control
    const clientDist = path.resolve(__dirname, "../client/dist");
    console.log("📁 Serving static files from:", clientDist);
    
    // Cache hashed assets aggressively, no-cache for HTML
    app.use(express.static(clientDist, {
      setHeaders: (res, filePath) => {
        // Cache hashed assets aggressively (safe: filenames change on each build)
        if (/\.(js|css|png|jpg|jpeg|gif|svg|woff2?)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          // Default for other assets
          res.setHeader("Cache-Control", "public, max-age=3600");
        }
      }
    }));

    // SPA fallback - serve index.html for all non-API routes
    app.get("*", (_req, res) => {
      // Ensure index.html is never cached
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(clientDist, "index.html"));
    });

    // Error handler LAST
    app.use(errorHandler);
  } catch (error) {
    console.error("❌ Route registration failed:", error);
    // Don't exit - server is already running for health checks
  }
}

// Start route registration (non-blocking)
registerAppRoutes();
