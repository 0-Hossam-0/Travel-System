import { RoomModel } from "../../DB/models/room/room.model";
import { HotelModel } from "../../DB/models/hotel/hotel.model";
import { NotFoundException } from "../../utils/response/error.response";
import { IRoom } from "../../schema/room/room.schema";
import { checkRoomAvailabilityConflict } from "./sub-service/room.sub-service";

export const createRoom = async (payload: IRoom) => {
  const isHotelExists = await HotelModel.findOne({_id:payload.hotel_id, isDeleted: false });
  if (!isHotelExists)
    throw new NotFoundException("The associated hotel does not exist.");

  const existingRooms = await RoomModel.find({
    hotel_id: payload.hotel_id,
    name: payload.name,
  });

  checkRoomAvailabilityConflict(existingRooms, payload.availability_calendar);

  const result = await RoomModel.create(payload);
  return result;
};

export const getSingleRoom = async (id: string) => {
  const result = await RoomModel.findOne({ _id: id, isDeleted: false });
  if (!result) throw new NotFoundException("Room not found!");
  return result;
};

export const updateRoom = async (id: string, payload: Partial<IRoom>) => {
  if (payload.hotel_id) {
    const isHotelExists = await HotelModel.findOne({
      _id: payload.hotel_id,
      isDeleted: false,
    });
    if (!isHotelExists)
      throw new NotFoundException("The associated hotel does not exist.");
  }

  const result = await RoomModel.findOneAndUpdate({_id:id, isDeleted:false}, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) throw new NotFoundException("Room not found for update!");
  return result;
};

export const deleteRoom = async (id: string) => {
  const result = await RoomModel.findOneAndUpdate({_id:id, isDeleted:false},
    { isDeleted: true },
    { new: true }
  );
  if (!result) throw new NotFoundException("Room not found for deletion!");
  return result;
};
