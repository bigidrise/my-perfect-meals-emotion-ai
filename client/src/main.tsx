import "@/lib/fetch-credentials-patch";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GlobalErrorBoundary, setupGlobalErrorHandling } from './components/GlobalErrorBoundary';

// Set up global error handling immediately
setupGlobalErrorHandling();

// Add global error handlers to prevent unhandled rejections from crashing the app
window.addEventListener('unhandledrejection', (event) => {
  // ENHANCED: Show exactly what's failing to debug navigation issues
  console.group('[UNHANDLED PROMISE REJECTION]');
  console.error('reason:', event.reason);
  console.error('promise:', event.promise);
  console.trace();
  console.groupEnd();
  event.preventDefault(); // Prevent the default behavior of logging to console and potentially crashing
});

window.addEventListener('error', (event) => {
  console.warn('Global error caught:', event.error);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>
);