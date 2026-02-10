import { Response } from "express";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string,
  status = 200,
) => {
  return (res as Response<ApiResponse<T>>).status(status).json({ success: true, message, data });
};

export const sendError = (
  res: Response,
  message: string,
  status = 500,
) => {
  return (res as Response<ApiResponse<null>>).status(status).json({ success: false, message });
};
