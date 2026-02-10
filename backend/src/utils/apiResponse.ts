import { Response } from "express";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export const sendSuccess = <T>(
  res: Response<ApiResponse<T>>,
  data: T,
  message: string,
  status = 200,
) => {
  return res.status(status).json({ success: true, message, data });
};

export const sendError = (
  res: Response<ApiResponse<null>>,
  message: string,
  status = 500,
) => {
  return res.status(status).json({ success: false, message });
};
