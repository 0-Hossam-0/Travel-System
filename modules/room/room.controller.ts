import { Router, Request, Response } from "express";
import * as RoomService from "../room/room.service";
import { IRoom, roomSchema } from "../../schema/room/room.schema";
import validateRequest from "../../middleware/requestValidation.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { successResponse } from "../../utils/response/success.response";
import {
  CreateRoomValidation,
  DeleteRoomByIdValidation,
  GetRoomByHotelIdValidation,
  UpdateRoomByIdValidation,
  GetRoomByIdValidation,
} from "./validation/room.validation";
import { asyncHandler } from "../../utils/asyncHandler";

const roomRouter = Router();

roomRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateRoomValidation),
  asyncHandler(async (req: Request, res: Response) => {
    const roomData = req.body as IRoom;
    const result = await RoomService.createRoom(roomData);

    successResponse(res, {
      statusCode: 201,
      message: "Room created successfully",
      data: result,
    });
  })
);


roomRouter.patch(
  "/:id",
  authMiddleware,
  validateRequest(UpdateRoomByIdValidation),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await RoomService.updateRoom(id, req.body);

    successResponse(res, {
      statusCode: 200,
      message: "Room updated successfully",
      data: result,
    });
  })
);

roomRouter.get(
  "/single/:id",
  validateRequest(GetRoomByIdValidation),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await RoomService.getSingleRoom(id);

    successResponse(res, {
      statusCode: 200,
      message: "Room retrieved successfully",
      data: result,
    });
  })
);

roomRouter.delete(
  "/:id",
  authMiddleware,
  validateRequest(DeleteRoomByIdValidation),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await RoomService.deleteRoom(id);

    successResponse(res, {
      statusCode: 200,
      message: "Room deleted successfully",
    });
  })
);

export default roomRouter;
