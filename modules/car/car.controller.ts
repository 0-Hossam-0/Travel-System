import { Request, Response, Router } from "express";
import * as CarService from "./car.service";
import validateRequest from "../../middleware/requestValidation.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { successResponse } from "../../utils/response/success.response";
import {
  CreateCarValidation,
  DeleteCarByIdValidation,
  GetCarByIdValidation,
  UpdateCarByIdValidation,
} from "./validation/car.validation";
import { ICar } from "../../schema/car/car.schema";

const carRouter = Router();

carRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateCarValidation),
  async (req: Request, res: Response) => {
    const result = await CarService.createCar(req.body);
    successResponse(res, {
      statusCode: 201,
      message: "Car created successfully",
      data: result,
    });
  }
);

carRouter.patch(
  "/:id",
  authMiddleware,
  validateRequest(UpdateCarByIdValidation),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CarService.updateCar(id, req.body);
    successResponse(res, {
      statusCode: 200,
      message: "Car updated successfully",
      data: result,
    });
  }
);

carRouter.delete(
  "/:id",
  authMiddleware,
  validateRequest(DeleteCarByIdValidation),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await CarService.deleteCar(id);
    successResponse(res, {
      statusCode: 200,
      message: "Car deleted successfully",
    });
  }
);

carRouter.get(
  "/:id",
  validateRequest(GetCarByIdValidation),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CarService.getSingleCar(id);
    successResponse(res, {
      statusCode: 200,
      message: "Car retrieved successfully",
      data: result,
    });
  }
);

carRouter.get("/", async (req: Request, res: Response) => {
  const result = await CarService.getAllCars(req.query);
  successResponse(res, {
    statusCode: 200,
    message: "Cars fetched successfully",
    info: result.meta,
    data: result.cars,
  });
});

export default carRouter;
