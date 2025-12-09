import { Request, Response } from "express";
import { User } from "../models/user.schema";
import { CustomError } from "../middlewares/errorHandler.middleware";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUser = await User.find({});

    return res.status(200).json({
      message: "all user fetched",
      success: true,
      status: "Success",
      data: allUser,
    });
  } catch (error) {
    throw new CustomError("User failed to fetch!", 500);
  }
};
