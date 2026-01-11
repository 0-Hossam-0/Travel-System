import { ClientSession, Types } from "mongoose";
import TourBookingModel from "../../DB/models/booking/tourBooking.model";
import TourModel from "../../DB/models/tour/tour.model";
import TourScheduleModel from "../../DB/models/tour/tourSchedule.model";
import TourPriceTierModel from "../../DB/models/tour/tourPriceTiers.model";
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "../../utils/response/error.response";
import { createPayPalOrder } from "../../utils/payment/paypal.payment";
import { ITourBooking } from "../../schema/booking/tourBooking.schema";
import TOUR_BOOKING_LIMITS from "../../utils/limit/booking/tourBooking.limit";
import TOUR_BOOKING_MESSAGES from "../../utils/message/booking/tourBooking.message";

/**
 * Generate a unique booking reference
 */
const generateBookingReference = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK-${timestamp}-${random}`;
};

/**
 * Calculate total price for tour booking based on guests and price tier
 */
const calculateTourPrice = async (
  tourId: string | Types.ObjectId,
  priceTierId: string | Types.ObjectId,
  guests: { adult: number; child: number; infant: number }
): Promise<number> => {
  const priceTier = await TourPriceTierModel.findById(priceTierId);

  if (!priceTier) {
    throw new NotFoundException("Price tier not found");
  }

  const adultTotal = guests.adult * priceTier.adult_price;
  const childTotal = guests.child * (priceTier.child_price || 0);
  const infantTotal = guests.infant * (priceTier.infant_price || 0);

  return adultTotal + childTotal + infantTotal;
};

/**
 * Check if tour schedule has available slots for the booking
 */
const checkAvailability = async (
  tourId: string | Types.ObjectId,
  selectedDate: Date,
  totalGuests: number
): Promise<any> => {
  const schedule = await TourScheduleModel.findOne({
    tour_id: tourId,
    start_date: { $lte: selectedDate },
    end_date: { $gte: selectedDate },
  }).populate("price_tier_id");

  if (!schedule) {
    throw new NotFoundException(
      "No schedule available for the selected date"
    );
  }

  if (schedule.available_slots < totalGuests) {
    throw new ConflictException(
      `Only ${schedule.available_slots} slots available. You requested ${totalGuests} slots.`
    );
  }

  return schedule;
};

/**
 * Create a new tour booking
 */
export const createTourBooking = async (
  bookingData: {
    tour: string;
    selected_date: Date;
    guests: { adult: number; child: number; infant: number };
    user: string;
  },
  session: ClientSession
): Promise<ITourBooking> => {
  const { tour, selected_date, guests, user } = bookingData;

  // Validate tour exists
  const tourExists = await TourModel.findById(tour);
  if (!tourExists) {
    throw new NotFoundException("Tour not found");
  }

  // Calculate total guests
  const totalGuests = guests.adult + guests.child + guests.infant;

  // Validate total guests limit
  if (totalGuests > TOUR_BOOKING_LIMITS.GUESTS.TOTAL_MAX) {
    throw new BadRequestException(TOUR_BOOKING_MESSAGES.TOTAL_EXCEEDED);
  }

  // Check availability and get schedule
  const schedule = await checkAvailability(tour, selected_date, totalGuests);

  // Calculate total price
  const totalPrice = await calculateTourPrice(
    tour,
    schedule.price_tier_id._id,
    guests
  );

  // Generate booking reference
  const bookingReference = generateBookingReference();

  // Create the booking
  const [newBooking] = await TourBookingModel.create(
    [
      {
        type: "tour",
        user: new Types.ObjectId(user),
        tour: new Types.ObjectId(tour),
        selected_date,
        guests,
        total_price: totalPrice,
        status: "pending",
        payment_status: "pending",
        booking_reference: bookingReference,
      },
    ],
    { session }
  );

  // Update available slots in the schedule
  await TourScheduleModel.findByIdAndUpdate(
    schedule._id,
    { $inc: { available_slots: -totalGuests } },
    { session }
  );

  return newBooking as unknown as ITourBooking;
};

/**
 * Initiate payment for tour booking
 */
export const initiateBookingPayment = async (
  bookingId: string,
  userId: string,
  session: ClientSession
) => {
  const booking = await TourBookingModel.findById(bookingId).populate("tour");

  if (!booking) {
    throw new NotFoundException("Booking not found");
  }

  // Verify the booking belongs to the user
  if (booking.user.toString() !== userId) {
    throw new BadRequestException("Unauthorized to process this booking");
  }

  // Check if booking is already paid
  if (booking.payment_status === "paid") {
    throw new ConflictException("Booking is already paid");
  }

  // Create PayPal order
  const paypalOrder = await createPayPalOrder({
    amount: booking.total_price,
    description: `Booking for ${(booking.tour as any).title} - ${booking.booking_reference}`,
    userId: booking.user,
    tourId: booking.tour,
    bookingId: booking._id,
    session,
  });

  // Update booking with payment ID
  await TourBookingModel.findByIdAndUpdate(
    bookingId,
    { payment_id: paypalOrder.id },
    { session }
  );

  return {
    booking,
    paypalOrder,
  };
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId: string) => {
  const booking = await TourBookingModel.findById(bookingId)
    .populate("user", "name email")
    .populate("tour");

  if (!booking) {
    throw new NotFoundException("Booking not found");
  }

  return booking;
};

/**
 * Get all bookings for a user
 */
export const getUserBookings = async (
  userId: string,
  options?: {
    page?: number;
    limit?: number;
    status?: string;
  }
) => {
  const { page = 1, limit = 10, status } = options || {};
  const skip = (page - 1) * limit;

  const filter: any = { user: new Types.ObjectId(userId) };

  if (status) {
    filter.status = status;
  }

  const [bookings, totalCount] = await Promise.all([
    TourBookingModel.find(filter)
      .populate("tour")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit),
    TourBookingModel.countDocuments(filter),
  ]);

  return {
    bookings,
    meta: {
      page,
      limit,
      totalBookings: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (
  bookingId: string,
  userId: string,
  session: ClientSession
) => {
  const booking = await TourBookingModel.findById(bookingId);

  if (!booking) {
    throw new NotFoundException("Booking not found");
  }

  // Verify the booking belongs to the user
  if (booking.user.toString() !== userId) {
    throw new BadRequestException("Unauthorized to cancel this booking");
  }

  // Check if booking can be cancelled
  if (booking.status === "cancelled") {
    throw new ConflictException("Booking is already cancelled");
  }

  if (booking.payment_status === "paid") {
    throw new ConflictException(
      "Cannot cancel a paid booking. Please request a refund."
    );
  }

  // Update booking status
  const updatedBooking = await TourBookingModel.findByIdAndUpdate(
    bookingId,
    {
      status: "cancelled",
      payment_status: "failed",
    },
    { new: true, session }
  );

  // Restore available slots
  const totalGuests =
    booking.guests.adult + booking.guests.child + booking.guests.infant;

  await TourScheduleModel.findOneAndUpdate(
    {
      tour_id: booking.tour,
      start_date: { $lte: booking.selected_date },
      end_date: { $gte: booking.selected_date },
    },
    { $inc: { available_slots: totalGuests } },
    { session }
  );

  return updatedBooking;
};

/**
 * Update booking payment status (called after payment confirmation)
 */
export const updateBookingPaymentStatus = async (
  bookingId: string,
  paymentStatus: "paid" | "failed" | "refunded",
  session?: ClientSession
) => {
  const booking = await TourBookingModel.findById(bookingId);

  if (!booking) {
    throw new NotFoundException("Booking not found");
  }

  const status = paymentStatus === "paid" ? "confirmed" : booking.status;

  const updatedBooking = await TourBookingModel.findByIdAndUpdate(
    bookingId,
    {
      payment_status: paymentStatus,
      status,
    },
    { new: true, session }
  ).populate("tour");

  return updatedBooking;
};
