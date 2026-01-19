import { Request, Response } from "express";
import { CarModel } from "../../DB/models/car/car.model";
import { ICar } from "../../schema/car/car.schema";
import { ConflictException, NotFoundException } from "../../utils/response/error.response";
import { successResponse } from "../../utils/response/success.response";

const createCar = async (payload: ICar) => {
  const result = await CarModel.create(payload);
  return result;
};

const getAllCars = async (query: Record<string, any>) => {
  const searchTerm = query?.searchTerm || "";
  const filter: Record<string, any> = { isDeleted: false };
  if (searchTerm) {
    filter.$or = [
      { brand: { $regex: searchTerm, $options: "i" } },
      { carModel: { $regex: searchTerm, $options: "i" } },
    ];
  }

  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const cars = await CarModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  const total = await CarModel.countDocuments(filter);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    cars,
  };
};

const getSingleCar = async (id: string) => {
  const result = await CarModel.findOne({ _id: id, isDeleted: false });
  if (!result) throw new NotFoundException("Car not found!");
  return result;
};

const updateCar = async (id: string, payload: Partial<ICar>) => {
  const result = await CarModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true, runValidators: true }
  );

  if (!result) throw new NotFoundException("Car not found for update!");
  return result;
};

const deleteCar = async (id: string) => {
  const result = await CarModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!result) throw new NotFoundException("Car not found for deletion!");
  return result;
};

/**
 * Controller Service: Create Car
 */
const createCarController = async (req: Request, res: Response) => {
  const result = await createCar(req.body);
  successResponse(res, {
    statusCode: 201,
    message: "Car created successfully",
    data: result,
  });
};

/**
 * Controller Service: Update Car
 */
const updateCarController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await updateCar(id, req.body);
  successResponse(res, {
    statusCode: 200,
    message: "Car updated successfully",
    data: result,
  });
};

/**
 * Controller Service: Delete Car
 */
const deleteCarController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteCar(id);
  successResponse(res, {
    statusCode: 200,
    message: "Car deleted successfully",
  });
};

/**
 * Controller Service: Get Single Car
 */
const getSingleCarController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getSingleCar(id);
  successResponse(res, {
    statusCode: 200,
    message: "Car retrieved successfully",
    data: result,
  });
};

/**
 * Controller Service: Get All Cars
 */
const getAllCarsController = async (req: Request, res: Response) => {
  const result = await getAllCars(req.query);
  successResponse(res, {
    statusCode: 200,
    message: "Cars fetched successfully",
    info: result.meta,
    data: result.cars,
  });
};

export {
  createCar,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
  createCarController,
  updateCarController,
  deleteCarController,
  getSingleCarController,
  getAllCarsController,
};
