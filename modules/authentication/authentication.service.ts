import { Request, Response } from "express";
import { BadRequestException } from "../../utils/response/error.response";
import UserModel from "../../DB/models/user.model";
import bcrypt from 'bcrypt';
import { successResponse } from "../../utils/response/success.response";


export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}
export const registerUser = async (req: Request, res: Response) => {
  // Register a new user
  const { name, email, password }: IRegisterRequest = req.body;
  if (!name) throw new BadRequestException("No name provided");
  if (!email) throw new BadRequestException("Missing email");
  if (!password) throw new BadRequestException("Missing password");

  const userExists = await UserModel.findOne({ email });
  if (userExists) throw new BadRequestException("Email already registered");
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const createdUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // Remove password from response for security
  const userResponse = {
    id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    isVerified: createdUser.isVerified,
    createdAt: createdUser.createdAt,
  };

  return successResponse({
    res,
    statusCode: 201,
    message: "User registered successfully",
    data: userResponse,
  });
}
