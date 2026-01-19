# Service Layer Refactoring - Progress Report

## Objective
Move business logic from controllers to service functions following the "thin controller, fat service" pattern.

## Benefits
- **Separation of Concerns**: Controllers handle HTTP concerns, services handle business logic
- **Reusability**: Service functions can be reused across different controllers or contexts
- **Testability**: Business logic can be tested independently of HTTP layer
- **Maintainability**: Easier to locate and modify business logic

## Pattern Structure

### Service Layer (service.ts)
```typescript
// Business logic functions (existing)
const getData = async (id: string) => {
  const data = await Model.findById(id);
  if (!data) throw new NotFoundException("Not found");
  return data;
};

// Controller service functions (NEW)
/**
 * Controller Service: Get Data
 * Handles complete request/response flow
 */
const getDataController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await getData(id);
  
  successResponse(res, {
    statusCode: 200,
    message: "Data retrieved successfully",
    data,
  });
};

export { getData, getDataController };
```

### Controller Layer (controller.ts)
```typescript
// Before refactoring
router.get("/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await Service.getData(id);
  successResponse(res, {
    statusCode: 200,
    message: "Data retrieved successfully",
    data,
  });
}));

// After refactoring
router.get("/:id", asyncHandler(Service.getDataController));
```

## Completed Modules ✅

### 1. Favorite Module ✅
**Files Modified:**
- `modules/favorite/favorite.service.ts`
- `modules/favorite/favorite.controller.ts`

**Functions Added to Service:**
- `toggleFavoriteController` - Handles toggle favorite request/response
- `getMyFavoritesController` - Handles get favorites request/response

**Controller Routes Updated:**
- POST `/toggle`
- GET `/my-favorites`

### 2. Car Module ✅
**Files Modified:**
- `modules/car/car.service.ts`
- `modules/car/car.controller.ts`

**Functions Added to Service:**
- `createCarController` - POST /
- `updateCarController` - PATCH /:id
- `deleteCarController` - DELETE /:id
- `getSingleCarController` - GET /:id
- `getAllCarsController` - GET /

**Controller Routes Updated:**
- All 5 car routes now use controller service functions

## Remaining Modules 🔄

### 3. Hotel Module 🔄
**Service File:** `modules/hotel/hotel.service.ts`
**Controller File:** `modules/hotel/hotel.controller.ts`

**Existing Service Functions:**
- `createHotel(payload)`
- `getRoomsByHotel(hotelId)`
- `getAllHotels(query)`
- `getSingleHotel(id)`
- `updateHotel(id, payload)`
- `deleteHotel(id)`
- `getAllHotelsInMap(query)`

**Controller Service Functions Needed:**
- `createHotelController` - POST /
- `updateHotelController` - PATCH /:id
- ` deleteHotelController` - DELETE /:id
- `getRoomsByHotelController` - GET /rooms/:hotelId
- `getSingleHotelController` - GET /hotel/:id
- `getAllHotelsController` - GET /
- `getAllHotelsInMapController` - GET /map

### 4. Room Module 🔄
**Service File:** `modules/room/room.service.ts`
**Controller File:** `modules/room/room.controller.ts`

**Existing Service Functions:**
- `createRoom(payload)`
- `getSingleRoom(id)`
- `updateRoom(id, payload)`
- `deleteRoom(id)`

**Controller Service Functions Needed:**
- `createRoomController` - POST /
- `updateRoomController` - PATCH /:id
- `getSingleRoomController` - GET /single/:id
- `deleteRoomController` - DELETE /:id

### 5. Tour Module 🔄
**Service File:** `modules/tour/tour.service.ts`
**Controller File:** `modules/tour/tour.controller.ts`

**Existing Service Functions:**
- `createFullTour(data, userId, session)`
- `getToursPagination(query)`
- `getTourById(id)`
- `updateTour(id, data)`
- `deleteTour(id, session)`

**Controller Service Functions Needed:**
- `createTourController` - POST / (with transaction)
- `getToursController` - GET /
- `getTourByIdController` - GET /:id
- `updateTourController` - PATCH /:id
- `deleteTourController` - DELETE /:id (with transaction)

### 6. Booking Module 🔄
**Service File:** `modules/booking/booking.service.ts`
**Controller File:** `modules/booking/booking.controller.ts`

**Existing Service Functions:**
- `createTourBooking(data, session)`
- `initiateBookingPayment(id, userId, session)`
- `getBookingById(id)`
- `getUserBookings(userId, options)`
- `cancelBooking(id, userId, session)`
- `updateBookingPaymentStatus(id, status, session)`

**Controller Service Functions Needed:**
- `createTourBookingController` - POST /tour (with transaction)
- `initiateBookingPaymentController` - POST /:id/payment (with transaction)
- `getBookingByIdController` - GET /:id
- `getUserBookingsController` - GET /
- `cancelBookingController` - DELETE /:id (with transaction)
- `updateBookingPaymentStatusController` - PATCH /:id/payment-status (with transaction)

### 7. Authentication Module ✅
**Note:** Already using service functions directly (forgetPasswordRequest, login, etc.)
No changes needed - already following the pattern.

### 8. Users Module ✅
**Note:** Already using service functions directly (myProfile, uploadProfilePicture, updateProfileInfo)
No changes needed - already following the pattern.

## Implementation Template

For each remaining module, follow these steps:

### Step 1: Add Controller Service Functions to Service File

```typescript
import { Request, Response } from "express";
import { successResponse } from "../../utils/response/success.response";
import { AuthRequest } from "../../public types/authentication/request.types";
import mongoose from "mongoose";

// ... existing service functions ...

/**
 * Controller Service: [Operation Name]
 * Handles complete request/response flow for [operation description]
 */
const [operationName]Controller = async (req: Request, res: Response) => {
  // Extract parameters
  const { id } = req.params;
  const data = req.body;
  const authReq = req as AuthRequest; // if auth required
  
  // For transactions:
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Call business logic function
    const result = await [businessLogicFunction](params, session);
    
    await session.commitTransaction(); // if transaction
    
    // Send response
    successResponse(res, {
      statusCode: 200, // or 201 for create
      message: "Success message",
      data: result,
    });
  } catch (error) {
    await session.abortTransaction(); // if transaction
    throw error;
  } finally {
    session.endSession(); // if transaction
  }
};

// Export
export {
  // ... existing exports ...
  [operationName]Controller,
};
```

### Step 2: Update Controller File

```typescript
import { Router } from "express";
import * as Service from "./service";
import { asyncHandler } from "../../utils/asyncHandler";
// ... other imports ...

const router = Router();

router.[method](
  "path",
  middleware1,
  middleware2,
  asyncHandler(Service.[operationName]Controller)
);

export default router;
```

## Next Steps

1. **Complete Hotel Module** - Add 7 controller service functions
2. **Complete Room Module** - Add 4 controller service functions
3. **Complete Tour Module** - Add 5 controller service functions
4. **Complete Booking Module** - Add 6 controller service functions
5. **Testing** - Verify all endpoints work correctly
6. **Documentation** - Update API documentation if needed

## Notes

- Controllers with transactions need special handling (keep try-catch-finally)
- Response messages and status codes should match existing behavior
- Maintain backward compatibility - all endpoints should work exactly as before
- The AuthRequest type is used when accessing authenticated user data

## Summary Statistics

- **Total Modules**: 8
- **Completed**: 4 (Favorite, Car, Authentication, Users)
- **Remaining**: 4 (Hotel, Room, Tour, Booking)
- **Controller Functions to Create**: ~22
- **Estimated Complexity**: Medium (mostly repetitive work following the established pattern)
