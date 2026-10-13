import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  ADMIN_TOKEN_EXPIRES_IN,
  getJwtSecret,
} from "../config/auth.js";
import { Admin } from "../models/admin.model.js";

export async function loginAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+passwordHash");

    if (
      !admin ||
      admin.status !== "active" ||
      !(await bcrypt.compare(password, admin.passwordHash))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        role: admin.role,
      },
      getJwtSecret(),
      {
        subject: admin._id.toString(),
        expiresIn: ADMIN_TOKEN_EXPIRES_IN,
      },
    );

    admin.lastLoginAt = new Date();
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        expiresIn: ADMIN_TOKEN_EXPIRES_IN,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export function getCurrentAdmin(_req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    data: res.locals.admin,
  });
}

export function logoutAdmin(_req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    message: "Logout successful. Remove the token from the client.",
  });
}
