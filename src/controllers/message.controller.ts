// create message

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Message } from "../models/message.schema";
import { CustomError } from "../middlewares/errorHandler.middleware";
import { Chat } from "../models/chat.model";

export const createMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, text } = req.body;

    // Validate required fields
    if (!chatId || !text) {
      throw new CustomError("chatId and text are required!", 400);
    }

    // Get senderId from authenticated user
    const senderId = req.user?._id;

    if (!senderId) {
      throw new CustomError("User not authenticated!", 401);
    }

    // Check if chat exists
    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new CustomError("Chat not found!", 404);
    }

    // Verify user is part of the chat
    const isUserInChat = chat.users.some(
      (userId) => userId.toString() === senderId.toString()
    );

    if (!isUserInChat) {
      throw new CustomError("You are not a member of this chat!", 403);
    }

    // Create the message
    const message = await Message.create({
      senderId,
      chatId,
      text,
    });

    // Update the chat's latestMessage field
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    // Populate sender information
    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "userName email avatar")
      .populate("chatId");

    return res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: populatedMessage,
    });
  }
);

// get message

export const getMessage = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;

  if (!chatId) throw new CustomError("chatId is required!", 400);

  const messages = await Message.find({ chatId });

  res.status(201).json({
    message: "message fetched successfully",
    success: true,
    status: "Success",
    data: messages,
  });
});
