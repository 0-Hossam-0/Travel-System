import { Types } from "mongoose";
import { Seat } from "../../DB/models/flight/seat.model";
import { SeatHold } from "../../DB/models/flight/seatHold.model";
import { FlightBookingModel, IPassenger, IBooking as IFlightBooking, BookingStatus } from "../../DB/models/booking/flightBooking.model";
import { Flight } from "../../DB/models/flight/flight.model";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../utils/response/error.response";

export class BookingService {
 
  async getAvailableSeats(flightId: string) {
    const flight = await Flight.findById(flightId);
    if (!flight) {
      throw new NotFoundException("Flight not found");
    }

    const seats = await Seat.find({
      flightId: new Types.ObjectId(flightId),
      status: "AVAILABLE",
    }).sort({ seatNumber: 1 });

    return seats;
  }

  
  async holdSeats(flightId: string, seatIds: string[], holdDurationMinutes: number = 10) {
    const flight = await Flight.findById(flightId);
    if (!flight) {
      throw new NotFoundException("Flight not found");
    }

    const seats = await Seat.find({
      _id: { $in: seatIds.map((id) => new Types.ObjectId(id)) },
      flightId: new Types.ObjectId(flightId),
    });

    if (seats.length !== seatIds.length) {
      throw new BadRequestException("Some seats do not exist for this flight");
    }

    const unavailableSeats = seats.filter((seat) => seat.status !== "AVAILABLE");
    if (unavailableSeats.length > 0) {
      throw new ConflictException(
        `Seats ${unavailableSeats.map((s) => s.seatNumber).join(", ")} are not available`
      );
    }

    const expiresAt = new Date(Date.now() + holdDurationMinutes * 60 * 1000);
    
    const booking = await FlightBookingModel.create({
      flightId: new Types.ObjectId(flightId),
      passengers: [],
      seatIds: seatIds.map((id) => new Types.ObjectId(id)),
      totalPrice: 0,
      currency: "USD",
      status: "INIT",
      expiresAt,
    });

    await Seat.updateMany(
      { _id: { $in: seatIds.map((id) => new Types.ObjectId(id)) } },
      { $set: { status: "HELD" } }
    );

    await SeatHold.insertMany(
      seatIds.map((seatId) => ({
        seatId: new Types.ObjectId(seatId),
        bookingId: booking._id,
        expiresAt,
      }))
    );

    return {
      bookingId: booking._id,
      expiresAt,
      seats: seats.map((s) => ({ 
        id: s._id, 
        seatNumber: s.seatNumber, 
        class: s.class 
      })),
    };
  }


  async completeBooking(
    bookingId: string,
    passengers: IPassenger[],
    totalPrice: number,
    currency: string = "USD"
  ) {
    const booking = await FlightBookingModel.findById(bookingId).populate("seatIds");
    
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.status !== "INIT") {
      throw new BadRequestException(`Booking is already ${booking.status}`);
    }

    if (booking.expiresAt && booking.expiresAt.getTime() < Date.now()) {
      // Release seats if expired
      await this.releaseSeats(bookingId);
      throw new BadRequestException("Booking has expired");
    }

    if (passengers.length !== (booking.seatIds?.length || 0)) {
      throw new BadRequestException("Number of passengers must match number of seats");
    }

    booking.passengers = passengers;
    booking.totalPrice = totalPrice;
    booking.currency = currency;
    booking.status = "PENDING_PAYMENT" as BookingStatus;
    await booking.save();

    return booking;
  }


  async confirmPayment(bookingId: string, paymentSuccess: boolean) {
    const booking = await FlightBookingModel.findById(bookingId);
    
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.status !== "PENDING_PAYMENT") {
      throw new BadRequestException("Booking is not pending payment");
    }

    if (paymentSuccess) {
      booking.status = "CONFIRMED" as BookingStatus;
      
      await Seat.updateMany(
        { _id: { $in: booking.seatIds } },
        { $set: { status: "BOOKED" } }
      );

      await SeatHold.deleteMany({ seatId: { $in: booking.seatIds } });
    } else {
      booking.status = "PAYMENT_FAILED" as BookingStatus;
      await this.releaseSeats(bookingId);
    }

    await booking.save();
    return booking;
  }

  
  async cancelBooking(bookingId: string) {
    const booking = await FlightBookingModel.findById(bookingId);
    
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.status === "CONFIRMED") {
      throw new BadRequestException("Cannot cancel a confirmed booking");
    }

    booking.status = "CANCELLED" as BookingStatus;
    await booking.save();
    
    await this.releaseSeats(bookingId);
    
    return booking;
  }


  private async releaseSeats(bookingId: string) {
    const booking = await FlightBookingModel.findById(bookingId);
    
    if (!booking) return;

    // Update seats back to AVAILABLE
    await Seat.updateMany(
      { _id: { $in: booking.seatIds }, status: "HELD" },
      { $set: { status: "AVAILABLE" } }
    );

    await SeatHold.deleteMany({ seatId: { $in: booking.seatIds } });
  }

 
  async getBooking(bookingId: string) {
    const booking = await FlightBookingModel.findById(bookingId)
      .populate("flightId")
      .populate("seatIds");
    
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    return booking;
  }

 
  async cleanupExpiredBookings() {
    const expiredBookings = await FlightBookingModel.find({
      expiresAt: { $lt: new Date() },
      status: { $in: ["INIT", "PENDING_PAYMENT"] },
    });

    for (const booking of expiredBookings) {
      booking.status = "EXPIRED" as BookingStatus;
      await booking.save();
      await this.releaseSeats(booking._id.toString());
    }

    return { cleanedUp: expiredBookings.length };
  }
}