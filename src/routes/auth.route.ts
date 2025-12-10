import express from "express";
import { createUser, userLogin } from "../controllers/auth.controller";

const router = express();

router.post("/login", userLogin);
router.post("/signup", createUser);

export default router;
