import { Router } from "express";
import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/auth.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", validateBody(loginSchema), loginAdmin);
router.get("/me", requireAdmin, getCurrentAdmin);
router.post("/logout", requireAdmin, logoutAdmin);

export default router;
