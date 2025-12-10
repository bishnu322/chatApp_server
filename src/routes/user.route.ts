import { removeUserById } from "./../controllers/user.controller";
import express from "express";
import { getAllUsers } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.delete("/:id", authenticate(), removeUserById);
router.get("/", authenticate(), getAllUsers);

export default router;
