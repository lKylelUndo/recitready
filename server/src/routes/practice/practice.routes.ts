import express from "express";

import { validateSchema } from "@/middlewares/validateSchema";
import { authenticateRequest } from "@/middlewares/authenticateRequest";
import { PracticeController } from "@/controllers/practice/PracticeController";
import { PracticeServices } from "@/services/practice/PracticeServices";
import {
  endSessionRequestSchema,
  startSessionRequestSchema,
  submitAnswerRequestSchema,
} from "./practice.validators";
import { AuthServices } from "@/services/auth/AuthServices";

const router = express.Router();

// reuse auth cookie auth
const authServices = new AuthServices();
const requireAuth = authenticateRequest(authServices);

const practiceServices = new PracticeServices();
const practiceController = new PracticeController(practiceServices);

router.post("/sessions", requireAuth, validateSchema(startSessionRequestSchema), practiceController.startSession);
router.post("/sessions/:sessionId/next", requireAuth, practiceController.nextQuestion);
router.post("/turns/:turnId/answer", requireAuth, validateSchema(submitAnswerRequestSchema), practiceController.submitAnswer);
router.post(
  "/sessions/:sessionId/end",
  requireAuth,
  validateSchema(endSessionRequestSchema),
  practiceController.endSession
);
router.get("/history", requireAuth, practiceController.history);
router.get("/dashboard", requireAuth, practiceController.dashboard);
router.get("/sessions/:sessionId", requireAuth, practiceController.sessionSummary);

export default router;

