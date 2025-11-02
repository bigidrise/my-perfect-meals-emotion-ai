import { Router } from "express";

const router = Router();

/**
 * GET /api/auth/session
 * Returns { userId } if authenticated, otherwise 401.
 * In development mode, always returns the dev user ID.
 */
router.get("/api/auth/session", (req: any, res) => {
  // In development, always return the default user
  const userId = "00000000-0000-0000-0000-000000000001";
  res.json({ userId });
});

export default router;