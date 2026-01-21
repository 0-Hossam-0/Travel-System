import { Request } from "express";

export interface ForgetPasswordRequest extends Request {
  body: {
    email: string;
  };
}

export interface ForgetPasswordConfirm extends Request {
  body: {
    email: string,
    otpCode: string;
    password: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}
