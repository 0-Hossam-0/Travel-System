<<<<<<< HEAD
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.post("/create")
=======
// import { Router, Request, Response } from "express";
// import mongoose from "mongoose";
// import { createTourBookingService } from "./tourBooking.service";
// import { successResponse } from "../../utils/response/success.response";
// import { createCarBookingService } from "./carBooking.service";
// import { createFlightBookingService } from "./flightBooking.service";
// import { createHotelBookingService } from "./hotelBooking.service";
// import { validateRequest } from "../../middleware/requestValidation/requestValidation.middleware";
// import {
//   createCarBookingZodSchema,
//   createFlightBookingZodSchema,
//   createHotelBookingZodSchema,
//   createTourBookingZodSchema,
// } from "./types/zod.schema";
// import { IRequest } from "../../types/request.types";
// import { authMiddleware } from "../../middleware/auth.middleware";
// import {
//   capturePayPalOrder,
//   createPayPalOrder,
// } from "../../utils/payment/paypal.payment";


// const bookingRouter = Router();

//   bookingRouter.post(
//   "/tour",
//   authMiddleware,
//   validateRequest(createTourBookingZodSchema),
//   async (req: IRequest, res: Response) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//       const userId = req.credentials!.user!._id.toString();
//       const bookingData = req.body;
//       const booking = await createTourBookingService(
//         bookingData,
//         userId,
//         session
//       );

//       const payment = await createPayPalOrder({
//         amount: booking.total_price,
//         description: `Payment for Tour Booking`,
//         userId,
//         tourId: booking.tour_id,
//         bookingId: booking._id,
//         session,
//       });

//       await session.commitTransaction();

//       successResponse(res, {
//         statusCode: 201,
//         message: "Tour Booking created successfully.",
//         data: { booking, payment },
//       });
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
//   }
// );

// bookingRouter.post(
//   "/car",
//   authMiddleware,
//   validateRequest(createCarBookingZodSchema),
//   async (req: IRequest, res: Response) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//       const userId = req.credentials!.user!._id.toString();

//       const booking = await createCarBookingService(req.body, userId, session);

//       const payment = await createPayPalOrder({
//         amount: booking.total_price,
//         description: `Payment for Car Booking`,
//         userId,
//         bookingId: booking._id,
//         session,
//       });

//       await session.commitTransaction();

//       successResponse(res, {
//         statusCode: 201,
//         message: "Car Booking created successfully.",
//         data: { booking, payment },
//       });
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
//   }
// );

// bookingRouter.post(
//   "/flight",
//   authMiddleware,
//   validateRequest(createFlightBookingZodSchema),
//   async (req: IRequest, res: Response) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//       const userId = req.credentials!.user!._id.toString();
//       const booking = await createFlightBookingService(
//         req.body,
//         userId,
//         session
//       );

//       const payment = await createPayPalOrder({
//         amount: booking.total_price,
//         description: `Payment for Flight Booking`,
//         userId,
//         bookingId: booking._id,
//         session,
//       });

//       await session.commitTransaction();

//       successResponse(res, {
//         statusCode: 201,
//         message: "Flight Booking created successfully.",
//         data: { booking, payment },
//       });
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
//   }
// );

// bookingRouter.post(
//   "/hotel",
//   authMiddleware,
//   validateRequest(createHotelBookingZodSchema),
//   async (req: IRequest, res: Response) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//       const userId = req.credentials!.user!._id.toString();
//       const booking = await createHotelBookingService(req.body, userId, session);

//       const payment = await createPayPalOrder({
//         amount: booking.total_price,
//         description: `Payment for Hotel Booking`,
//         userId,
//         bookingId: booking._id,
//         session,
//       });

//       await session.commitTransaction();

//       successResponse(res, {
//         statusCode: 201,
//         message: "Hotel Booking created successfully.",
//         data: { booking, payment },
//       });
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
//   }
// );

// bookingRouter.post(
//   "/payment/capture",
//   authMiddleware,
//   async (req: IRequest, res: Response) => {
//     const { orderId } = req.body;
//     const result = await capturePayPalOrder(orderId);

//     successResponse(res, {
//       statusCode: 200,
//       message: "Payment captured successfully.",
//       data: result,
//     });
//   }
// );

// export default bookingRouter;
>>>>>>> 96227ac (feat(tour): implement tour creation, deletion, and filtering services)
