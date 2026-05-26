import express from "express";

import { validateSchema } from "@/middlewares/validateSchema";
import { authenticateRequest } from "@/middlewares/authenticateRequest";
import { PracticeController } from "@/controllers/practice/PracticeController";
import { PracticeServices } from "@/services/practice/PracticeServices";
import { startSessionRequestSchema, submitAnswerRequestSchema } from "./practice.validators";
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
router.get("/history", requireAuth, practiceController.history);

export default router;

