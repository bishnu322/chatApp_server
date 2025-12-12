import express from "express";
import { createMessage, getMessage } from "../controllers/message.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express();

router.post("/", authenticate(), createMessage);
router.get("/:chatId", authenticate(), getMessage);

export default router;
