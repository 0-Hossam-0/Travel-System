import { Router, Request, Response, NextFunction } from "express";
import * as BookingService from "./booking.service";
import { successResponse } from "../../utils/response/success.response";
import mongoose from "mongoose";
import { AuthRequest } from "../../public types/authentication/request.types";
import validateRequest from "../../middleware/requestValidation.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  tourBookingSchema,
  tourBookingBaseSchema,
} from "../../schema/booking/tourBooking.schema";
import { z } from "zod";
import { objectIdSchema } from "../../schema/booking/booking.schema";
import TOUR_BOOKING_LIMITS from "../../utils/limit/booking/tourBooking.limit";
import TOUR_BOOKING_MESSAGES from "../../utils/message/booking/tourBooking.message";

const router = Router();

// /**
//  * Create Tour Booking Validation Schema
//  */
const createTourBookingRequestSchema = z.object({
  body: tourBookingBaseSchema
    .omit({
      user: true,
      total_price: true,
      status: true,
      payment_status: true,
      payment_id: true,
      booking_reference: true,
    })
    .refine(
      (data) => {
        const total =
          data.guests.adult + data.guests.child + data.guests.infant;
        return total <= TOUR_BOOKING_LIMITS.GUESTS.TOTAL_MAX;
      },
      {
        message: TOUR_BOOKING_MESSAGES.TOTAL_EXCEEDED,
        path: ["guests"],
      }
    ),
});

/**
 * Get Bookings Query Schema
 */
const getBookingsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
    status: z
      .enum(["pending", "confirmed", "cancelled", "failed"])
      .optional(),
  }),
});

/**
 * Booking ID Param Schema
 */
const bookingIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

/**
 * POST /bookings/tour - Create a new tour booking
 */
router.post(
  "/tour",
  authMiddleware,
  validateRequest(createTourBookingRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bookingData = {
        ...req.body,
        user: authReq.user._id.toString(),
      };

      const newBooking = await BookingService.createTourBooking(
        bookingData,
        session
      );

      await session.commitTransaction();
      successResponse(res, {
        data: newBooking,
        message: "Tour booking created successfully",
        statusCode: 201,
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }
);

/**
 * POST /bookings/:id/payment - Initiate payment for a booking
 */
router.post(
  "/:id/payment",
  authMiddleware,
  validateRequest(bookingIdParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { booking, paypalOrder } =
        await BookingService.initiateBookingPayment(
          req.params.id,
          authReq.user._id.toString(),
          session
        );

      await session.commitTransaction();

      // Find the approval URL from PayPal response
      const approvalUrl = paypalOrder.links.find(
        (link: any) => link.rel === "approve"
      )?.href;

      successResponse(res, {
        data: {
          bookingId: booking._id,
          bookingReference: booking.booking_reference,
          amount: booking.total_price,
          paypalOrderId: paypalOrder.id,
          approvalUrl,
        },
        message: "Payment initiated successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }
);

/**
 * GET /bookings/:id - Get booking by ID
 */
router.get(
  "/:id",
  authMiddleware,
  validateRequest(bookingIdParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await BookingService.getBookingById(req.params.id);

      successResponse(res, {
        data: booking,
        message: "Booking retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /bookings - Get all bookings for the authenticated user
 */
router.get(
  "/",
  authMiddleware,
  validateRequest(getBookingsQuerySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;

    try {
      const { bookings, meta } = await BookingService.getUserBookings(
        authReq.user._id.toString(),
        {
          page: req.query.page ? Number(req.query.page) : undefined,
          limit: req.query.limit ? Number(req.query.limit) : undefined,
          status: req.query.status as string | undefined,
        }
      );

      successResponse(res, {
        data: bookings,
        message: "Bookings retrieved successfully",
        info: meta,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /bookings/:id - Cancel a booking
 */
router.delete(
  "/:id",
  authMiddleware,
  validateRequest(bookingIdParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cancelledBooking = await BookingService.cancelBooking(
        req.params.id,
        authReq.user._id.toString(),
        session
      );

      await session.commitTransaction();

      successResponse(res, {
        data: cancelledBooking,
        message: "Booking cancelled successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }
);

/**
 * PATCH /bookings/:id/payment-status - Update payment status
 * This is typically called by a webhook or after payment confirmation
 */
router.patch(
  "/:id/payment-status",
  authMiddleware,
  validateRequest(
    z.object({
      params: z.object({
        id: objectIdSchema,
      }),
      body: z.object({
        payment_status: z.enum(["paid", "failed", "refunded"]),
      }),
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedBooking =
        await BookingService.updateBookingPaymentStatus(
          req.params.id,
          req.body.payment_status,
          session
        );

      await session.commitTransaction();

      successResponse(res, {
        data: updatedBooking,
        message: "Payment status updated successfully",
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
