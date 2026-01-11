import { Request,Response } from "express";

export const mainRoute = (req:Request,res:Response) =>
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
