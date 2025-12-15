import express from "express";
import {
  accessChat,
  findChat,
  findUserChats,
} from "../controllers/chat.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express();

router.post("/", accessChat);
router.get("/:userId", findUserChats);
router.get("/find/:userId/:secondId", findChat);

export default router;
