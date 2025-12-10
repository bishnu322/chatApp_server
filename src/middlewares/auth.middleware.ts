import { NextFunction, Request, Response } from "express";
import { CustomError } from "./errorHandler.middleware";
import { verifyToken } from "../utils/jwt.utils";
import { User } from "../models/user.schema";

// to access globally i declare it here, it can be declare in tsconfig.json
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        userName: string;
        email: string;
      };
    }
  }
}

export const authenticate = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.cookies.access_token;

      if (!access_token)
        throw new CustomError("Unauthorized access denied!", 401);

      const decode_access_token = verifyToken(access_token);

      if (Date.now() > decode_access_token.exp * 1000) {
        res.clearCookie("access_token", {
          secure: process.env.NODE_ENV === "development" ? false : true,
          sameSite: "none",
          httpOnly: true,
        });

        throw new CustomError("session expired token", 401);
      }

      const user = await User.find({ email: decode_access_token.email });

      if (!user) throw new CustomError("Unauthorized access token", 401);

      req.user = {
        _id: decode_access_token._id,
        userName: decode_access_token.userName,
        email: decode_access_token.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
