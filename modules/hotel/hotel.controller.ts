<<<<<<< HEAD
import { Request, Response, Router } from "express";
import { HotelService } from "./hotel.service";
import { upload } from "../../middleware/upload";
import { asyncHandler } from "../../utils/response/async.handler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const hotels = await HotelService.getHotels();

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  })
);

router.get(
  "/:hotelId",
  asyncHandler(async (req: Request, res: Response) => {
    const { hotelId } = req.params;

    const data = await HotelService.getHotelDetails(hotelId);

    res.status(200).json({
      success: true,
      data,
    });
  })
);

router.post(
  "/admin/hotels",
  asyncHandler(async (req: Request, res: Response) => {
    const hotel = await HotelService.createHotel(req.body);

    res.status(201).json({
      success: true,
      data: hotel,
    });
  })
);

router.post(
  "/admin/:hotelId/rooms",
  asyncHandler(async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const room = await HotelService.createRoom(hotelId, req.body);

    res.status(201).json({
      success: true,
      data: room,
    });
  })
);

router.post(
  "/admin/:hotelId/images",
  upload.array("images", 5),
  asyncHandler(async (req: Request, res: Response) => {
    const gallery = await HotelService.addHotelImages(
      req.params.hotelId,
      req.files as any[]
    );

    res.status(200).json({
      success: true,
      data: gallery,
    });
  })
);

export default router;
=======
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
>>>>>>> 96227ac (feat(tour): implement tour creation, deletion, and filtering services)
