import mongoose from "mongoose";

export interface IJwtPayload {
  _id: string;
  email: string;
  userName: string;
}

export interface IJwtDecodedPayload extends IJwtPayload {
  iat: number;
  exp: number;
}
