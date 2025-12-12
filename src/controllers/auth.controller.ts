import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../middlewares/errorHandler.middleware";
import { User } from "../models/user.schema";
import { comparePassword, hashPassword } from "../utils/password.utils";
import { generateJwtToken } from "../utils/jwt.utils";
import { IJwtPayload } from "../types/jwt.types";

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) throw new CustomError("email is required!", 400);
  if (!password) throw new CustomError("password is required", 400);

  const user = await User.findOne({ email: email });

  if (!user) throw new CustomError("User not found!", 404);

  const verifiedPassword = await comparePassword(password, user?.password);

  if (!verifiedPassword) throw new CustomError("Invalid credential!", 400);

  const payload: IJwtPayload = {
    _id: user._id.toString(),
    email: user.email,
    userName: user.userName,
  };

  const access_token = generateJwtToken(payload);

  const { password: pass, ...newUserData } = user.toObject();

  res
    .cookie("access_token", access_token, {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })
    .json({
      message: "Fetched user",
      status: "Success",
      success: true,
      data: newUserData,
    });
});

// creating users
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  if (!userName) throw new CustomError("user name is required!", 400);
  if (!email) throw new CustomError("email is required!", 400);
  if (!password) throw new CustomError("password is require", 400);

  const user = await User.create({
    userName,
    email,
    password,
  });

  //   hashing password
  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;

  await user.save();

  const { password: pass, ...newUser } = user.toObject();

  res.status(201).json({
    message: "User created successfully",
    success: true,
    status: "Success",
    data: newUser,
  });
});

// user logout

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) throw new CustomError("not authorize to logout", 400);

  const user = await User.findById(userId);

  if (!user) throw new CustomError("User not found!", 404);

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.status(201).json({
    message: "User logged out successfully",
    success: true,
    status: "Success",
    data: [],
  });
});
