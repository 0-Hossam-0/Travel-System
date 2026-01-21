import { Router } from "express";
import { BookingService } from "./flight.service";
import { 
  validateHoldSeats, 
  validateCompleteBooking, 
  validateConfirmPayment,
  validateObjectId 
} from "./flight.validation";
import { successResponse } from "../../utils/response/success.response";

const router = Router();
const bookingService = new BookingService();


router.get(
  "/flights/:flightId/seats",
  validateObjectId("flightId"),
  async (req, res, next) => {
    try {
      const { flightId } = req.params;
      const seats = await bookingService.getAvailableSeats(flightId);
      
      return successResponse(res, {
        statusCode: 200,
        message: "Available seats retrieved successfully",
        data: { seats },
      });
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  "/bookings/hold",
  validateHoldSeats,
  async (req, res, next) => {
    try {
      const { flightId, seatIds, holdDurationMinutes } = req.body;
      const result = await bookingService.holdSeats(flightId, seatIds, holdDurationMinutes);
      
      return successResponse(res, {
        statusCode: 201,
        message: "Seats held successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);


router.put(
  "/bookings/:bookingId/complete",
  validateObjectId("bookingId"),
  validateCompleteBooking,
  async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      const { passengers, totalPrice, currency } = req.body;
      const booking = await bookingService.completeBooking(bookingId, passengers, totalPrice, currency);
      
      return successResponse(res, {
        statusCode: 200,
        message: "Booking completed successfully",
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  "/bookings/:bookingId/payment",
  validateObjectId("bookingId"),
  validateConfirmPayment,
  async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      const { paymentSuccess } = req.body;
      const booking = await bookingService.confirmPayment(bookingId, paymentSuccess);
      
      return successResponse(res, {
        statusCode: 200,
        message: paymentSuccess ? "Payment confirmed successfully" : "Payment failed",
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }
);


router.get(
  "/bookings/:bookingId",
  validateObjectId("bookingId"),
  async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      const booking = await bookingService.getBooking(bookingId);
      
      return successResponse(res, {
        statusCode: 200,
        message: "Booking retrieved successfully",
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }
);


router.delete(
  "/bookings/:bookingId",
  validateObjectId("bookingId"),
  async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      const booking = await bookingService.cancelBooking(bookingId);
      
      return successResponse(res, {
        statusCode: 200,
        message: "Booking cancelled successfully",
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/bookings/cleanup", async (req, res, next) => {
  try {
    const result = await bookingService.cleanupExpiredBookings();
    
    return successResponse(res, {
      statusCode: 200,
      message: "Expired bookings cleaned up successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;