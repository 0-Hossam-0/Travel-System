import { Router } from "express";
import * as CarService from "./car.service";
import validateRequest from "../../middleware/requestValidation.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  CreateCarValidation,
  DeleteCarByIdValidation,
  GetCarByIdValidation,
  UpdateCarByIdValidation,
} from "./validation/car.validation";
import { asyncHandler } from "../../utils/asyncHandler";

const carRouter = Router();

carRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateCarValidation),
  asyncHandler(CarService.createCarController)
);

carRouter.patch(
  "/:id",
  authMiddleware,
  validateRequest(UpdateCarByIdValidation),
  asyncHandler(CarService.updateCarController)
);

carRouter.delete(
  "/:id",
  authMiddleware,
  validateRequest(DeleteCarByIdValidation),
  asyncHandler(CarService.deleteCarController)
);

carRouter.get(
  "/:id",
  validateRequest(GetCarByIdValidation),
  asyncHandler(CarService.getSingleCarController)
);

carRouter.get("/", asyncHandler(CarService.getAllCarsController));

export default carRouter;
