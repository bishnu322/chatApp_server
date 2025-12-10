import { removeUserById } from "./../controllers/user.controller";
import express from "express";
import { getAllUsers } from "../controllers/user.controller";

const router = express.Router();

router.delete("/:id", removeUserById);

router.get("/", getAllUsers);

export default router;
