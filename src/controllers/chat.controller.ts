import { Request, Response } from "express";
import { CustomError } from "../middlewares/errorHandler.middleware";
import { Chat } from "../models/chat.model";
import { User } from "../models/user.schema";
import { asyncHandler } from "../utils/asyncHandler";

export const accessChat = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  // Validate userId is provided
  if (!userId) {
    throw new CustomError("UserId is required!", 400);
  }

  // Convert to string for comparison
  const currentUserId = req.user?._id.toString();
  const targetUserId = userId.toString();

  // Check if user is trying to chat with themselves
  if (targetUserId === currentUserId) {
    throw new CustomError("Cannot chat with yourself!", 400);
  }

  // Validate if the target user exists
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new CustomError("User not found!", 404);
  }

  // Check if chat already exists between these two users
  let chat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: currentUserId } } },
      { users: { $elemMatch: { $eq: targetUserId } } },
    ],
  }).populate("users", "-password");
  // .populate({
  //   path: "latestMessage",
  //   populate: {
  //     path: "sender",
  //     select: "userName email avatar",
  //   },
  // });

  // If chat exists, return it
  if (chat.length > 0) {
    return res.status(200).json({
      success: true,
      message: "Chat retrieved successfully",
      data: chat[0],
    });
  }

  // Create new chat if it doesn't exist
  const newChat = await Chat.create({
    users: [currentUserId, targetUserId],
  });

  // Populate the newly created chat
  const fullChat = await Chat.findById(newChat._id).populate(
    "users",
    "-password"
  );

  return res.status(201).json({
    success: true,
    message: "Chat created successfully",
    data: fullChat,
  });
});

// export const fetchChats = asyncHandler(async (req: Request, res: Response) => {
//   const chats = await Chat.find({
//     users: { $elemMatch: { $eq: req.user?._id } },
//   })
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password")
//     .populate({
//       path: "latestMessage",
//       populate: {
//         path: "sender",
//         select: "userName email avatar",
//       },
//     })
//     .sort({ updatedAt: -1 });

//   return res.status(200).json({
//     success: true,
//     message: "Chats fetched successfully",
//     data: chats,
//   });
// });

export const findUserChats = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) throw new CustomError("userId is required!", 400);

    const chats = await Chat.find({ users: { $in: [userId] } });

    if (!chats) throw new CustomError("chat not found", 404);

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  }
);

export const findChat = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const loggedInUserId = req?.user;

  if (!userId) throw new CustomError("userId is required!", 400);

  const chat = await Chat.find({ users: { $all: [userId, loggedInUserId] } });

  if (!chat) throw new CustomError("chat not found", 404);

  return res.status(200).json({
    success: true,
    message: "Chats fetched successfully",
    data: chat,
  });
});
