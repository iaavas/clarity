import { RequestHandler } from "express";
import * as AuthService from "./auth.service";
import { sendError, sendSuccess } from "../../utils/apiResponse";
import { signupSchema, loginSchema } from "./auth.schema";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { z } from "zod";

export const signup: RequestHandler = async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, z.prettifyError(parsed.error), 422);
    }

    const result = await AuthService.signup(parsed.data);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", result.token, cookieOptions);

    return sendSuccess(
      res,
      { user: result.user },
      "User created successfully",
      201,
    );
  } catch (error: any) {
    const message = error.message || "Failed to create user";
    const status = message.includes("already exists") ? 409 : 400;
    return sendError(res, message, status);
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, z.prettifyError(parsed.error), 422);
    }

    const result = await AuthService.login(parsed.data);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", result.token, cookieOptions);

    return sendSuccess(res, { user: result.user }, "Login successful", 200);
  } catch (error: any) {
    const message = error.message || "Login failed";
    const status = message.includes("Invalid") ? 401 : 400;
    return sendError(res, message, status);
  }
};

export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.userId) {
      return sendError(res, "User not authenticated", 401);
    }

    const user = await AuthService.getUserById(authReq.userId);
    return sendSuccess(res, user, "User fetched successfully", 200);
  } catch (error: any) {
    const message = error.message || "Failed to fetch user";
    const status = message.includes("not found") ? 404 : 400;
    return sendError(res, message, status);
  }
};

export const logout: RequestHandler = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return sendSuccess(res, null, "Logout successful", 200);
};

export const deleteAccount: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.userId) {
      return sendError(res, "User not authenticated", 401);
    }

    const result = await AuthService.deleteUser(authReq.userId);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return sendSuccess(res, result, "Account deleted successfully", 200);
  } catch (error: any) {
    const message = error.message || "Failed to delete account";
    const status = message.includes("not found") ? 404 : 400;
    return sendError(res, message, status);
  }
};
