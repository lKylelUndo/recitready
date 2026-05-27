import express from "express";

import authRoutes from "@/routes/auth/auth.routes";
import practiceRoutes from "@/routes/practice/practice.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/practice", practiceRoutes);

export default router;

