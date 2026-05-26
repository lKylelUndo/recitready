import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { ENV } from "@/config/env";
import { HttpError } from "@/lib/httpError";
import { AuthRepository } from "@/repositories/auth/AuthRepository";

const AUTH_COOKIE_NAME = "rr_auth";

type JwtPayload = {
  sub: string;
  email: string;
};

export class AuthServices {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(input: { name: string; email: string; password: string }) {
    const existing = await this.authRepository.findUserByEmail(input.email);

    if (existing) {
      throw new HttpError(409, "Email is already in use");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.authRepository.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const token = this.signToken(user.id, user.email);
    return { user, token };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.authRepository.findUserByEmail(input.email);

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = this.signToken(user.id, user.email);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  verifyToken(token: string): string {
    try {
      const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
      if (!payload?.sub) throw new HttpError(401, "Invalid token");
      return payload.sub;
    } catch {
      throw new HttpError(401, "Invalid token");
    }
  }

  getAuthCookieName() {
    return AUTH_COOKIE_NAME;
  }

  async getUserById(userId: string) {
    return this.authRepository.findUserById(userId);
  }

  private signToken(userId: string, email: string) {
    return jwt.sign({ sub: userId, email }, ENV.JWT_SECRET, { expiresIn: "7d" });
  }
}

