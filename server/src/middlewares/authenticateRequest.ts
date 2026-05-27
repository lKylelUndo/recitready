import type { Request, Response, NextFunction } from "express";

import { AuthServices } from "@/services/auth/AuthServices";
import { HttpError } from "@/lib/httpError";

export const authenticateRequest =
  (authServices: AuthServices) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.[authServices.getAuthCookieName()];
      if (!token || typeof token !== "string") {
        throw new HttpError(401, "Unauthorized");
      }

      const userId = authServices.verifyToken(token);
      req.auth = { userId };
      return next();
    } catch (err) {
      return next(err);
    }
  };

