import TourPriceTierModel from "../../../DB/models/tour/tourPriceTiers.model";
import TourImageModel from "../../../DB/models/tour/tourImage.model";
import {
  ITourImages,
  ITourPriceTiers,
  ITourSchedulesTiers,
} from "../types/tour.type";
import TourScheduleModel from "../../../DB/models/tour/tourSchedule.model";
import { ClientSession, Types } from "mongoose";

export const createTourImages = async (
  images: ITourImages,
  tourId: Types.ObjectId,
  session: ClientSession
) => {
  if (!images?.length) return [];
  const data = images.map((img) => ({ ...img, tour_id: tourId }));
  return await TourImageModel.insertMany(data, { session });
};

export const createTourPriceTiers = async (
  tiers: ITourPriceTiers,
  tourId: Types.ObjectId,
  session: ClientSession
) => {
  if (!tiers?.length) return [];
  const data = tiers.map((tier) => ({ ...tier, tour_id: tourId }));
  return await TourPriceTierModel.insertMany(data, { session });
};

export const createTourSchedules = async (
  schedules: ITourSchedulesTiers,
  tourId: Types.ObjectId,
  savedTiers: any[],
  session: ClientSession
) => {
  if (!schedules?.length) return [];
  const data = schedules.map((sch) => {
    const matchingTier = savedTiers.find((t) => t.name === sch.tier_name);
    return {
      ...sch,
      tour_id: tourId,
      price_tier_id: matchingTier ? matchingTier._id : savedTiers[0]?._id,
      available_slots: sch.capacity,
    };
  });
  return await TourScheduleModel.insertMany(data, { session });
};
