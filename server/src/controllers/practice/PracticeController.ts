import type { Request, Response, NextFunction } from "express";
import { PracticeServices } from "@/services/practice/PracticeServices";
import { HttpError } from "@/lib/httpError";

export class PracticeController {
  constructor(private practiceServices: PracticeServices) {}

  startSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth?.userId) throw new HttpError(401, "Unauthorized");
      const session = await this.practiceServices.startSession(req.auth.userId, req.body);
      return res.status(201).json({ status: "success", message: "Session created", data: session });
    } catch (err) {
      return next(err);
    }
  };

  nextQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth?.userId) throw new HttpError(401, "Unauthorized");
      const sessionId = req.params.sessionId as string;
      const turn = await this.practiceServices.nextQuestion(req.auth.userId, sessionId);
      return res.status(200).json({ status: "success", message: "Next question", data: turn });
    } catch (err) {
      return next(err);
    }
  };

  submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth?.userId) throw new HttpError(401, "Unauthorized");
      const turnId = req.params.turnId as string;
      const { answerText } = req.body as { answerText: string };
      const updated = await this.practiceServices.submitAnswer(req.auth.userId, turnId, answerText);
      return res.status(200).json({ status: "success", message: "Answer submitted", data: updated });
    } catch (err) {
      return next(err);
    }
  };

  history = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth?.userId) throw new HttpError(401, "Unauthorized");
      const sessions = await this.practiceServices.history(req.auth.userId);
      return res.status(200).json({ status: "success", message: "History", data: sessions });
    } catch (err) {
      return next(err);
    }
  };
}

