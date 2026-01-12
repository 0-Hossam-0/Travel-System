import { HotelModel } from "../../DB/models/hotel/hotel.model";
import { RoomModel } from "../../DB/models/room/room.model";
import { IHotel } from "../../schema/hotel/hotel.schema";
import {
  ConflictException,
  NotFoundException,
} from "../../utils/response/error.response";

const createHotel = async (payload: IHotel) => {

  const conflicts: { path: string, message: string }[] = []

  const existingHotel = await HotelModel.findOne({
    name: payload.name,
    isDeleted: false,
  });

  if (existingHotel)
    conflicts.push({ path: "name", message: "Hotel with the same name already exists!" })


  const existingLocation = await HotelModel.findOne({
    location_coordinates: payload.location_coordinates,
    isDeleted: false,
  });

  if (existingLocation)
    conflicts.push({ path: "location_coordinates", message: "Hotel with the same location already exists!" })

  const existingAddress = await HotelModel.findOne({
    address: payload.address,
    isDeleted: false,
  });

  if (existingAddress)
    conflicts.push({ path: "address", message: "Hotel with the same address already exists!" })

  if (conflicts.length)
    throw new ConflictException("Conflicts found!", conflicts);

  const result = await HotelModel.create(payload);
  return result;
};

export const getRoomsByHotel = async (hotelId: string) => {
  const rooms = await RoomModel.find({ hotel_id: hotelId, isDeleted: false });
  if (!rooms.length)
    throw new NotFoundException("No rooms found for this hotel!");
  return rooms;
};

const getAllHotels = async (query: Record<string, any>) => {
  const searchTerm = query?.searchTerm || "";
  const filter: Record<string, any> = { isDeleted: false };
  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { location: { $regex: searchTerm, $options: "i" } },
    ];
  }

  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const hotels = await HotelModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  const total = await HotelModel.countDocuments(filter);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    hotels,
  };
};

const getSingleHotel = async (id: string) => {
  const result = await HotelModel.findOne({ _id: id, isDeleted: false });

  if (!result) throw new NotFoundException("Hotel not found!");

  return result;
};

const updateHotel = async (id: string, payload: Partial<IHotel>) => {
  const result = await HotelModel.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) throw new NotFoundException("Hotel not found for update!");

  return result;
};

const deleteHotel = async (id: string) => {
  const result = await HotelModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!result) throw new NotFoundException("Hotel not found for deletion!");

  return result;
};

const getAllHotelsInMap = async (query: Record<string, any>) => {
  const { searchTerm, lat, lng, distance, page = 1, limit = 10 } = query;

  const filter: Record<string, any> = { isDeleted: false };
  const countFilter: Record<string, any> = { isDeleted: false };

  // عشان لو بيسيرش بالإسم او بالعنوان
  if (searchTerm) {
    const searchRegex = { $regex: searchTerm, $options: "i" };
    const searchCondition = {
      $or: [{ name: searchRegex }, { location: searchRegex }]
    };
    Object.assign(filter, searchCondition);
    Object.assign(countFilter, searchCondition);
  }

  // عشان لو بيسيرش بالموقع
  if (lat && lng) {
    const userLat = Number(lat);
    const userLng = Number(lng);
    const maxDist = Number(distance) || 5000;

    filter.location_coordinates = {
      // بترجع مترتبة حسب الأقرب
      $near: {
        $geometry: { type: "Point", coordinates: [userLng, userLat] },
        $maxDistance: maxDist
      }
    };


    countFilter.location_coordinates = {
      $geoWithin: {
        $centerSphere: [[userLng, userLat], maxDist / 6378100]
      }
    };

  }

  const skip = (Number(page) - 1) * Number(limit);

  const queryBuild = HotelModel.find(filter).skip(skip).limit(Number(limit));

  // لو مفيش احداثيات بترجع حسب الاحدث
  if (!lat || !lng) {
    queryBuild.sort("-createdAt");
  }

  const [hotels, total] = await Promise.all([
    queryBuild,
    HotelModel.countDocuments(countFilter)
  ]);


  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    hotels,
  };
};

export { createHotel, getAllHotels, getSingleHotel, updateHotel, deleteHotel, getAllHotelsInMap };