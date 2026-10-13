import Router from "express";
import { createContact } from "../controllers/contact.controller.js";

const router=Router();
router.route("/").post(createContact);

export default router;