import express from "express";
import {
  createUser,
  logoutUser,
  userLogin,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express();

router.get("/is-auth", authenticate(), (req, res) => {
  return res.json(req.user);
});
router.post("/login", userLogin);
router.post("/signup", createUser);
router.get("/logout", authenticate(), logoutUser);

export default router;
