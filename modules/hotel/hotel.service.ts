<<<<<<< HEAD
import HotelModel from "../../DB/models/hotel.model";
import RoomModel from "../../DB/models/room.model";

export class HotelService {
    // get All hotels 
  static async getHotels() {
    return await HotelModel.find();
  }
  // get hotel by id 
    static async getHotelDetails(hotelId: string) {
      const hotel = await HotelModel.findById(hotelId);
  
      if (!hotel) {
        throw new Error("Hotel not found");
      }
  
      const rooms = await RoomModel.find({ hotelId });
  
      return {
        hotel,
        rooms
      };
    }

    // create hotel 
    static async createHotel(payload: any) {
      const {
        name,
        description,
        rating,
        location,
        amenities,
        policies
      } = payload;
  
      
      if (!name || !location?.city) {
        throw new Error("Hotel name and city are required");
      }
  
      const hotel = await HotelModel.create({
        name,
        description,
        rating,
        location,
        amenities,
        policies,
        gallery: []
      });
  
      return hotel;
    }
    static async createRoom(hotelId: string, payload: any) {
      const hotel = await HotelModel.findById(hotelId);
      if (!hotel) {
        throw new Error("Hotel not found");
      }
  
      const {
        name,
        occupancy,
        pricePerNight,
        refundable,
        amenities
      } = payload;
  
      if (!name || !occupancy?.adults || !pricePerNight) {
        throw new Error("Room name, occupancy and price are required");
      }
  
      const room = await RoomModel.create({
        hotelId,
        name,
        occupancy,
        pricePerNight,
        refundable,
        amenities
      });
  
      return room;
    }

    static async addHotelImages(hotelId: string, images: any[]) {
      const hotel = await HotelModel.findById(hotelId);
      if (!hotel) throw new Error("Hotel not found");
  
      const gallery = images.map(img => ({
        url: img.path,
        publicId: img.filename
      }));
  
      hotel.gallery.push(...gallery);
      await hotel.save();
  
      return hotel.gallery;
    }
}
=======
import { HotelModel } from "../../DB/models/hotel/hotel.model";
import { RoomModel } from "../../DB/models/room/room.model";
import { IHotel } from "../../schema/hotel/hotel.schema";
import { ConflictException, NotFoundException } from "../../utils/response/error.response";


const createHotel = async (payload: IHotel) => {
  const existingHotel = await HotelModel.findOne({ name: payload.name, isDeleted: false });
  
  if (existingHotel) 
    throw new ConflictException("Hotel with the same name already exists!");
  

  const result = await HotelModel.create(payload);
  return result;
};

export const getRoomsByHotel = async (hotelId: string) => {
  const rooms = await RoomModel.find({ hotel_id: hotelId, isDeleted: false });
  if(!rooms.length) throw new NotFoundException("No rooms found for this hotel!");
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
  const result = await HotelModel.findOne({_id:id, isDeleted:false});

  if (!result) 
    throw new NotFoundException("Hotel not found!");
  

  return result;
};

const updateHotel = async (id: string, payload: Partial<IHotel>) => {
  const result = await HotelModel.findByIdAndUpdate({_id:id, isDeleted:false}, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) 
    throw new NotFoundException("Hotel not found for update!");
  

  return result;
};


const deleteHotel = async (id: string) => {
  const result = await HotelModel.findOneAndUpdate(
    {_id:id, isDeleted:false},
    { isDeleted: true },
    { new: true }
  );

  if (!result) throw new NotFoundException("Hotel not found for deletion!");

  return result;
};

export {
  createHotel,
  getAllHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
};
>>>>>>> 96227ac (feat(tour): implement tour creation, deletion, and filtering services)
