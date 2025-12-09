import { removeUserById } from "./../controllers/user.controller";
import express from "express";
import { createUser, getAllUsers } from "../controllers/user.controller";

const router = express.Router();

router.delete("/:id", removeUserById);
router.post("/", createUser);
router.get("/", getAllUsers);

export default router;
