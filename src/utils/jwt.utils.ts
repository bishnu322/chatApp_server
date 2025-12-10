import { IJwtDecodedPayload, IJwtPayload } from "../types/jwt.types";
import jwt from "jsonwebtoken";

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? "";
const JWT_EXPIRE = process.env.JWT_EXPIRE_IN;

export const generateJwtToken = (payload: IJwtPayload) => {
  const token = jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: JWT_EXPIRE as any,
  });

  return token;
};

export const verifyToken = (token: string): IJwtDecodedPayload => {
  const verifiedToken = jwt.verify(token, PRIVATE_KEY);

  return verifiedToken as IJwtDecodedPayload;
};
