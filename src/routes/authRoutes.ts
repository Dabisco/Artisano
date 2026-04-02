import { Router } from "express";
import { register } from "@/controllers/authController.js";
import { verifyJWT } from "@/middleware/verifyJWT.js";
import { verifiedUserCheck } from "@/middleware/verifiedUserMiddleware.js";
import { verifyEmail } from "@/controllers/authController.js";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
// router.post('/login', login);

router.post("/verify-email", verifyJWT, verifyEmail);

export default router;
