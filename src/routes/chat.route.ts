import express from "express";
import {
  accessChat,
  findChat,
  findUserChats,
} from "../controllers/chat.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express();

router.post("/", authenticate(), accessChat);
router.get("/:userId", findUserChats);
router.get("/find/:userId", authenticate(), findChat);

export default router;
