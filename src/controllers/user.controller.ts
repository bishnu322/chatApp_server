import { Request, Response } from "express";
import { User } from "../models/user.schema";
import { CustomError } from "../middlewares/errorHandler.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { hashPassword } from "../utils/password.utils";

// getting all users detail
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;

  const filter: Record<string, any> = {};

  if (query) {
    filter.$or = [
      {
        userName: {
          $regex: query,
          $options: "i",
        },
      },
      {
        email: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }

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

// getting all users detail
export const getAllUsersById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) throw new CustomError("User not found", 401);

    res.status(200).json({
      message: "user fetched",
      success: true,
      status: "Success",
      data: user,
    });
  }
);

// remove user
export const removeUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log(id);

    if (!id) throw new CustomError("user id is required!", 400);

    const user = await User.findById(id);

    if (!user) throw new CustomError("User not found!", 404);

    res.status(201).json({
      message: "User created successfully",
      success: true,
      status: "Success",
      data: user,
    });
  }
);

// update user

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userName } = req.body;

  const { id } = req.params;

  if (!id) throw new CustomError("user id is required!", 400);

  const user = await User.findById(id);

  if (!user) throw new CustomError("User not found!", 404);

  if (userName) user.userName = userName;

  await user.save();

  const { password: pass, ...updatedUser } = user.toObject();

  res.status(200).json({
    message: "User updated successfully",
    success: true,
    status: "Success",
    data: updatedUser,
  });
});
