import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/auth.js";
import { Admin } from "../models/admin.model.js";

type AdminTokenPayload = {
  sub: string;
  role: "super_admin" | "editor";
};

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
      return;
    }

    const token = authorization.slice("Bearer ".length).trim();
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded !== "object" ||
      typeof decoded.sub !== "string" ||
      (decoded.role !== "super_admin" && decoded.role !== "editor")
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    const payload = decoded as AdminTokenPayload;
    const admin = await Admin.findOne({
      _id: payload.sub,
      status: "active",
    })
      .select("name email role status")
      .lean();

    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Admin account is unavailable",
      });
      return;
    }

    res.locals.admin = {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
      return;
    }

    next(error);
  }
}
