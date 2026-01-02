import { usersRouter } from "./modules/users/users.controller";
import express, { Application, Request, Response } from "express";
import tourRouter from "./modules/tour/tour.controller";
import { notFound } from "./middleware/notFound.middleware";
import { globalErrorHandler } from "./utils/response/error.response";
import authRouter from "./modules/authentication/authentication.controller";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./DB/connect";
import {
  capturePayPalOrder,
  createPayPalOrder,
} from "./utils/payment/paypal.payment";
import cookieParser from "cookie-parser";

const bootstrap = (app: Application) => {
  const port = process.env.PORT || 3000;

  connectDB();

  app.use(cookieParser());
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRouter);

  app.use("/api/users", usersRouter);

  app.post("/api/order/request", async (req: Request, res: Response) => {
    const { price, description, userId, tourId } = req.body;
    const result = await createPayPalOrder({
      description: description,
      amount: price,
      userId,
      tourId,
    });

    res.status(200).json({
      result,
    });
  });
  app.get("/order/confirm/:orderId", async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const result = await capturePayPalOrder(orderId);

    res.status(200).json({
      result,
    });
  });

  app.use("/api/tours", tourRouter);

  app.get(["/", "/api"], (req: Request, res: Response) => {
    res.status(200).json({
      message: "Welcome To Travel System API",
      info: {
        platform: "Integrated Travel Marketplace",
        description:
          "A scalable and secure system for managing Tours, Flights, Cars, Hotels, Bookings, and Payments.",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        features: [
          "Search & Booking",
          "Secure Payments",
          "OTP Authentication",
          "Reviews & Favorites",
          "Multi-language & Multi-currency",
        ],
        techStack: {
          backend: ["Node.js", "Express.js"],
          database: "MongoDB / Mongoose",
          storage: "Cloudinary",
          integrations: ["Payment Gateways", "Email Service", "Maps API"],
          security: [
            "JWT Authentication",
            "Refresh JWT",
            "bcrypt",
            "Helmet",
            "Rate Limiting",
            "PCI Compliance",
          ],
        },
        categories: [
          { key: "tours", label: "Tours & Activities" },
          { key: "flights", label: "Flights" },
          { key: "cars", label: "Car Rentals" },
          { key: "hotels", label: "Hotels & Rooms" },
        ],
        actors: ["guest", "user", "admin", "support"],
        mainFeatures: [
          "Search & Booking",
          "Secure Payments",
          "OTP Authentication",
          "Reviews & Favorites",
          "Multi-language & Multi-currency",
        ],
        api: {
          auth: "/api/auth",
          users: "/api/users",
          tours: "/api/tours",
          flights: "/api/flights",
          cars: "/api/cars",
          hotels: "/api/hotels",
          bookings: "/api/bookings",
          payments: "/api/payments",
          admin: "/api/admin",
        },
        documentation: "Coming Soon",
        repository: "https://github.com/0-Hossam-0/Travel-System",
      },
      statusCode: 200,
    });
  });

  app.use(notFound);

  app.use(globalErrorHandler);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

export default bootstrap;
