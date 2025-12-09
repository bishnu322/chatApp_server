import { Request, Response } from "express";
import { User } from "../models/user.schema";
import { CustomError } from "../middlewares/errorHandler.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const filter = {};

  const allUser = await User.find(filter);

  if (!allUser) throw new CustomError("User not found", 401);

  //   const totalUser = await User.countDocuments(filter);

  res.status(200).json({
    message: "all user fetched",
    success: true,
    status: "Success",
    data: allUser,
  });
});

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

  await user.save();

  const { password: pass, ...newUser } = user.toObject();

  res.status(201).json({
    message: "User created successfully",
    success: true,
    status: "Success",
    data: newUser,
  });
});
