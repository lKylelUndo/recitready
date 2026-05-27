import express from "express";

import { validateSchema } from "@/middlewares/validateSchema";
import { authenticateRequest } from "@/middlewares/authenticateRequest";
import {
  loginRequestSchema,
  registerRequestSchema,
} from "./auth.validators";
import { AuthController } from "@/controllers/auth/AuthController";
import { AuthServices } from "@/services/auth/AuthServices";

const router = express.Router();

const authServices = new AuthServices();
const authController = new AuthController(authServices);
const requireAuth = authenticateRequest(authServices);

router.post(
  "/register",
  validateSchema(registerRequestSchema),
  authController.register,
);
router.post(
  "/login",
  validateSchema(loginRequestSchema),
  authController.login,
);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;

