import { Request, Response, NextFunction, Router } from "express";
import * as HotelService from "./hotel.service";
import {
  CreateHotelValidation,
  DeleteHotelByIdValidation,
  GetHotelByIdValidation,
  UpdateHotelByIdValidation,
} from "./validation/hotel.validation";
import { successResponse } from "../../utils/response/success.response";
import { authMiddleware } from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/requestValidation.middleware";

const hotelRouter = Router();

hotelRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateHotelValidation),
  async (req: Request, res: Response) => {
    const result = await HotelService.createHotel(req.body);

    successResponse(res, {
      statusCode: 201,
      message: "Hotel created successfully",
      data: result,
    });
  }
);

hotelRouter.patch(
  "/:id",
  authMiddleware,
  validateRequest(UpdateHotelByIdValidation),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await HotelService.updateHotel(id, req.body);

    successResponse(res, {
      statusCode: 200,
      message: "Hotel updated successfully",
      data: result,
    });
  }
);

hotelRouter.delete(
  "/:id",
  authMiddleware,
  validateRequest(DeleteHotelByIdValidation),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await HotelService.deleteHotel(id);

    successResponse(res, {
      statusCode: 200,
      message: "Hotel deleted successfully",
    });
  }
);
hotelRouter.get(
  "/rooms/:hotelId",
  authMiddleware,
  validateRequest(GetHotelByIdValidation),
  async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const result = await HotelService.getRoomsByHotel(hotelId);

    successResponse(res, {
      statusCode: 200,
      message: "Hotel rooms retrieved successfully",
      data: result,
    });
  }
);

hotelRouter.get("/hotel/:id",
  authMiddleware,
  validateRequest(GetHotelByIdValidation),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await HotelService.getSingleHotel(id);

    successResponse(res, {
      statusCode: 200,
      message: "Hotel retrieved successfully",
      data: result,
    });
  }
);

hotelRouter.get("/",authMiddleware, async (req: Request, res: Response) => {
  const result = await HotelService.getAllHotels(req.query);

  successResponse(res, {
    statusCode: 200,
    message: "Hotels fetched successfully",
    info: result.meta,
    data: result.hotels,
  });
});

export default hotelRouter;
