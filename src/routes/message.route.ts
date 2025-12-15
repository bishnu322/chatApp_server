import express from "express";
import { createMessage, getMessage } from "../controllers/message.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express();

router.post("/", createMessage);
router.get("/:chatId", getMessage);

export default router;
