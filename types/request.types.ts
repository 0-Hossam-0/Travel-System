import { JwtPayload } from 'jsonwebtoken';
import { IUser } from './../DB/models/user.model';
import { Request } from "express";

export interface IRequest extends Request{
    credentials?:{
        user?:IUser,
        decoded:JwtPayload
    }
}