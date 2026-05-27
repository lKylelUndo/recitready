import type { Request, Response, NextFunction } from "express";

import { AuthServices } from "@/services/auth/AuthServices";
import { ENV } from "@/config/env";
import { HttpError } from "@/lib/httpError";

export class AuthController {
  constructor(private authServices: AuthServices) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body as {
        name: string;
        email: string;
        password: string;
      };

      const { user, token } = await this.authServices.register({
        name,
        email,
        password,
      });

      res.cookie(this.authServices.getAuthCookieName(), token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: ENV.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        status: "success",
        message: "Registration successful",
        user,
      });
    } catch (err) {
      return next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as { email: string; password: string };

      const { user, token } = await this.authServices.login({ email, password });

      res.cookie(this.authServices.getAuthCookieName(), token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: ENV.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        user,
      });
    } catch (err) {
      return next(err);
    }
  };

  logout = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie(this.authServices.getAuthCookieName(), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: ENV.NODE_ENV === "production",
      });

      return res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      });
    } catch (err) {
      return next(err);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth?.userId) throw new HttpError(401, "Unauthorized");

      const user = await this.authServices.getUserById(req.auth.userId);
      if (!user) throw new HttpError(401, "Unauthorized");

      return res.status(200).json({
        status: "success",
        message: "Authenticated user",
        user,
      });
    } catch (err) {
      return next(err);
    }
  };
}

