import { Router, Request, Response, NextFunction } from "express";
import * as TourService from "./tour.service";
import { successResponse } from "../../utils/response/success.response";
import mongoose from "mongoose";
import { AuthRequest } from "../../public types/authentication/request.types";
import validateRequest from "../../middleware/requestValidation.middleware";
import { createTourSchema } from "./types/createTour.schema";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getToursRequestSchema,
  IGetToursRequest,
} from "./types/getTours.schema";
import { NotFoundException } from "../../utils/response/error.response";
import { updateTourSchema } from "./types/updateTour.schema";
import { deleteTourSchema } from "./types/deleteTour.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validateRequest(createTourSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newTour = await TourService.createFullTour(
        req.body,
        authReq.user._id.toString(),
        session
      );

      await session.commitTransaction();
      successResponse(res, { data: newTour, statusCode: 201 });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }
);

router.get(
  "/",
  authMiddleware,
  validateRequest(getToursRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const tourRequest = req as IGetToursRequest;
    const { tours, meta } = await TourService.getToursPagination(
      tourRequest.query
    );
    successResponse(res, {
      data: tours,
      message: "Tours retrieved successfully",
      info: meta,
    });
  }
);

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const tour = await TourService.getTourById(req.params.id);
  if (!tour) return new NotFoundException("Tour not found");

  return successResponse(res, {
    message: "Tour retrieved successfully",
    data: tour,
  });
});

router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateTourSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourService.updateTour(req.params.id, req.body);

    if (!tour) return new NotFoundException("Tour not found");

    return successResponse(res, {
      message: "Tour updated successfully",
      data: tour,
    });
  }
);

router.delete(
  "/:id",
  authMiddleware,
  validateRequest(deleteTourSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const tour = await TourService.deleteTour(req.params.id, session);

      if (!tour) throw new NotFoundException("Tour not found");

      await session.commitTransaction();
      successResponse(res, {
        message: "Tour deleted successfully",
        data: tour,
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }
);

export default router;
