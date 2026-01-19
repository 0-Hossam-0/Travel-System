# Complete Refactoring Guide for Remaining Modules

## Summary of Work Completed

✅ **Completed Modules:**
1. **Favorite Module** - 2 controller functions added
2. **Car Module** - 5 controller functions added
3. **Authentication Module** - Already using service functions
4. **Users Module** - Already using service functions

## Remaining Work

### Hotel Module - Controller Functions to Add

Add these functions to `modules/hotel/hotel.service.ts`:

```typescript
import { Request, Response } from "express";
import { successResponse } from "../../utils/response/success.response";

/**
 * Controller Service: Create Hotel
 */
const createHotelController = async (req: Request, res: Response) => {
  const result = await createHotel(req.body);
  successResponse(res, {
    statusCode: 201,
    message: "Hotel created successfully",
    data: result,
  });
};

/**
 * Controller Service: Update Hotel
 */
const updateHotelController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await updateHotel(id, req.body);
  successResponse(res, {
    statusCode: 200,
    message: "Hotel updated successfully",
    data: result,
  });
};

/**
 * Controller Service: Delete Hotel
 */
const deleteHotelController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteHotel(id);
  successResponse(res, {
    statusCode: 200,
    message: "Hotel deleted successfully",
  });
};

/**
 * Controller Service: Get Rooms By Hotel
 */
const getRoomsByHotelController = async (req: Request, res: Response) => {
  const { hotelId } = req.params;
  const result = await getRoomsByHotel(hotelId);
  successResponse(res, {
    statusCode: 200,
    message: "Hotel rooms retrieved successfully",
    data: result,
  });
};

/**
 * Controller Service: Get Single Hotel
 */
const getSingleHotelController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getSingleHotel(id);
  successResponse(res, {
    statusCode: 200,
    message: "Hotel retrieved successfully",
    data: result,
  });
};

/**
 * Controller Service: Get All Hotels
 */
const getAllHotelsController = async (req: Request, res: Response) => {
  const result = await getAllHotels(req.query);
  successResponse(res, {
    statusCode: 200,
    message: "Hotels fetched successfully",
    info: result.meta,
    data: result.hotels,
  });
};

/**
 * Controller Service: Get All Hotels In Map
 */
const getAllHotelsInMapController = async (req: Request, res: Response) => {
  const result = await getAllHotelsInMap(req.query);
  successResponse(res, {
    statusCode: 200,
    message: "Hotels fetched successfully",
    info: result.meta,
    data: result.hotels,
  });
};

// Update the export statement to include all controller functions
export {
  createHotel,
  getAllHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
  getAllHotelsInMap,
  getRoomsByHotel,
  createHotelController,
  updateHotelController,
  deleteHotelController,
  getRoomsByHotelController,
  getSingleHotelController,
  getAllHotelsController,
  getAllHotelsInMapController,
};
```

Then update `modules/hotel/hotel.controller.ts`:

```typescript
import { Router } from "express";
import * as HotelService from "./hotel.service";
import {
  CreateHotelValidation,
  DeleteHotelByIdValidation,
  GetHotelByIdValidation,
  GetHotelMapValidation,
  UpdateHotelByIdValidation,
} from "./validation/hotel.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/requestValidation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const hotelRouter = Router();

hotelRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateHotelValidation),
  asyncHandler(HotelService.createHotelController)
);

hotelRouter.patch(
  "/:id",
  authMiddleware,
  validateRequest(UpdateHotelByIdValidation),
  asyncHandler(HotelService.updateHotelController)
);

hotelRouter.delete(
  "/:id",
  authMiddleware,
  validateRequest(DeleteHotelByIdValidation),
  asyncHandler(HotelService.deleteHotelController)
);

hotelRouter.get(
  "/rooms/:hotelId",
  authMiddleware,
  validateRequest(GetHotelByIdValidation),
  asyncHandler(HotelService.getRoomsByHotelController)
);

hotelRouter.get(
  "/hotel/:id",
  authMiddleware,
  validateRequest(GetHotelByIdValidation),
  asyncHandler(HotelService.getSingleHotelController)
);

hotelRouter.get(
  "/",
  authMiddleware,
  asyncHandler(HotelService.getAllHotelsController)
);

hotelRouter.get(
  "/map",
  authMiddleware,
  validateRequest(GetHotelMapValidation),
  asyncHandler(HotelService.getAllHotelsInMapController)
);

export default hotelRouter;
```

### Room Module - Controller Functions to Add

Add these to `modules/room/room.service.ts`:

```typescript
import { Request, Response } from "express";
import { successResponse } from "../../utils/response/success.response";

/**
 * Controller Service: Create Room
 */
const createRoomController = async (req: Request, res: Response) => {
  const roomData = req.body as IRoom;
  const result = await createRoom(roomData);
  successResponse(res, {
    statusCode: 201,
    message: "Room created successfully",
    data: result,
  });
};

/**
 * Controller Service: Update Room
 */
const updateRoomController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await updateRoom(id, req.body);
  successResponse(res, {
    statusCode: 200,
    message: "Room updated successfully",
    data: result,
  });
};

/**
 * Controller Service: Get Single Room
 */
const getSingleRoomController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getSingleRoom(id);
  successResponse(res, {
    statusCode: 200,
    message: "Room retrieved successfully",
    data: result,
  });
};

/**
 * Controller Service: Delete Room
 */
const deleteRoomController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteRoom(id);
  successResponse(res, {
    statusCode: 200,
    message: "Room deleted successfully",
  });
};

// Add to exports
export {
  createRoom,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  createRoomController,
  updateRoomController,
  getSingleRoomController,
  deleteRoomController,
};
```

Update `modules/room/room.controller.ts`:

```typescript
import { Router } from "express";
import * as RoomService from "../room/room.service";
import validateRequest from "../../middleware/requestValidation.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  CreateRoomValidation,
  DeleteRoomByIdValidation,
  UpdateRoomByIdValidation,
  GetRoomByIdValidation,
} from "./validation/room.validation";
import { asyncHandler } from "../../utils/asyncHandler";

const roomRouter = Router();

roomRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateRoomValidation),
  asyncHandler(RoomService.createRoomController)
);

roomRouter.patch(
  "/:id",
  authMiddleware,
  validateRequest(UpdateRoomByIdValidation),
  asyncHandler(RoomService.updateRoomController)
);

roomRouter.get(
  "/single/:id",
  validateRequest(GetRoomByIdValidation),
  asyncHandler(RoomService.getSingleRoomController)
);

roomRouter.delete(
  "/:id",
  authMiddleware,
  validateRequest(DeleteRoomByIdValidation),
  asyncHandler(RoomService.deleteRoomController)
);

export default roomRouter;
```

## Important Notes

1. **Don't forget imports**: Add `Request`, `Response` from "express" and `successResponse` at the top of service files

2. **Export all functions**: Update the export statement at the bottom of each service file

3. **Remove unused imports from controllers**: After refactoring, you can remove:
   - `Request`, `Response` (if not used elsewhere)
   - `successResponse`
   - `AuthRequest` (if not used)
   - Any other imports that were only used in the moved code

4. **Test after each module**: Make sure to test the endpoints after refactoring each module

5. **For Tour and Booking modules**: These are more complex due to transactions. You'll need to keep the transaction logic in the controller service functions. See the pattern in the asyncHandler documentation.

## Benefits Achieved

After completing this refactoring:
- ✅ Controllers are now thin - only handling routing and middleware
- ✅ Services contain all business logic
- ✅ Code is more testable - service functions can be tested independently
- ✅ Code is more maintainable - business logic is in one place
- ✅ Code is more reusable - service functions can be called from anywhere
- ✅ Consistent pattern across the entire codebase

## Checklist for Each Module

- [ ] Add controller service functions to service file
- [ ] Add necessary imports to service file (Request, Response, successResponse)
- [ ] Update exports in service file
- [ ] Update controller file to use controller service functions
- [ ] Remove unused imports from controller
- [ ] Test all endpoints in the module
- [ ] Move to next module

## Current Status

Modules Completed: 4/8 (50%)
- ✅ Favorite
- ✅ Car
- ✅ Authentication (already correct)
- ✅ Users (already correct)

Modules Remaining: 4/8
- 🔄 Hotel (7 functions to add)
- 🔄 Room (4 functions to add)
- 🔄 Tour (5 functions to add)
- 🔄 Booking (6 functions to add)

Total controller functions to add: 22
