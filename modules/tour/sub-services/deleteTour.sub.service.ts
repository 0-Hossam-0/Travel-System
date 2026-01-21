import TourPriceTierModel from "../../../DB/models/tour/tourPriceTiers.model";
import TourImageModel from "../../../DB/models/tour/tourImage.model";
import { ClientSession, Types } from "mongoose";
import TourScheduleModel from "../../../DB/models/tour/tourSchedule.model";

export const deleteTourRelatedData = async (
  tourId: Types.ObjectId,
  session: ClientSession
) => {
  await Promise.all([
    TourImageModel.deleteMany({ tour_id: tourId }, { session }),
    TourScheduleModel.deleteMany({ tour_id: tourId }, { session }),
    TourPriceTierModel.deleteMany({ tour_id: tourId }, { session }),
  ]);
};
