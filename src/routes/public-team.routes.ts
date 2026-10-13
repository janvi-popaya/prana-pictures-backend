import { Router } from "express";
import { getPublicTeamMembers } from "../controllers/team.controller.js";

const router = Router();

router.get("/", getPublicTeamMembers);

export default router;