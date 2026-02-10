import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse";
import { ApiResponse } from "../utils/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      return sendError(res, "Authentication token required", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    return sendError(res, "Invalid or expired token", 401);
  }
};
