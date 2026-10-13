import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Admin } from "../models/admin.model.js";

async function createInitialAdmin() {
  try {
    const name = process.env.ADMIN_NAME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be configured",
      );
    }

    if (password.length < 12) {
      throw new Error("ADMIN_PASSWORD must contain at least 12 characters");
    }

    const existingAdmin = await Admin.findOne({ email }).lean();

    if (existingAdmin) {
      throw new Error("An admin with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name,
      email,
      passwordHash,
      role: "super_admin",
      status: "active",
    });

    console.log(`Admin created successfully: ${admin.email}`);
  } finally {
    await mongoose.disconnect();
  }
}

async function main() {
  await connectDB();
  await createInitialAdmin();
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Failed to create admin",
  );
  process.exitCode = 1;
});
