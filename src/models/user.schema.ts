import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required!"],
      min: 5,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
