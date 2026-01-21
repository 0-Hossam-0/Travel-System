import TourModel, { ITourDocument } from "../../DB/models/tour/tour.model";
import { ClientSession } from "mongoose";
import { ICreateTourSchema } from "./types/createTour.schema";
import * as CreateSubService from "./sub-services/createTour.sub.service";
import * as BuildSubService from "./sub-services/buildTour.sub.service";
import * as DeleteSubService from "./sub-services/deleteTour.sub.service";
import { Types } from "mongoose";
import { IGetToursQuery } from "./types/getTours.schema";
import { IUpdateTourSchema } from "./types/updateTour.schema";
import { ConflictException } from "../../utils/response/error.response";
import slugify from "slugify";
import { QueryFilter } from "mongoose";

export const createFullTour = async (
  tourData: ICreateTourSchema,
  userId: string,
  session: ClientSession
) => {
  const { title, price_tiers, schedules, gallery, ...rest } = tourData;

  const slug = slugify(title, { lower: true, strict: true });

  const existingTour = await TourModel.findOne({ slug });
  if (existingTour)
    throw new ConflictException("Tour with this title already exists");

  const [newTour] = (await TourModel.create(
    [{ ...rest, title, slug, created_by: new Types.ObjectId(userId) }],
    { session }
  )) as ITourDocument[];

  await CreateSubService.createTourImages(gallery || [], newTour._id, session);

  const savedTiers = await CreateSubService.createTourPriceTiers(
    price_tiers || [],
    newTour._id,
    session
  );

  await CreateSubService.createTourSchedules(
    schedules || [],
    newTour._id,
    savedTiers,
    session
  );

  return newTour;
};

export const getToursPagination = async (queryParams: IGetToursQuery) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    minPrice,
    maxPrice,
    ...filterParams
  } = queryParams;

  const skip = (page - 1) * limit;

  const filter = BuildSubService.buildTourFilters(filterParams);
  const sort = BuildSubService.buildTourSort(sortBy, sortOrder as string) as  QueryFilter<ITourDocument>;

  const [tours, totalCount] = await Promise.all([
    TourModel.find(filter)
      .populate("created_by", "name email")
      .populate("price_tiers")
      .populate("schedules")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    TourModel.countDocuments(filter),
  ]);

  const filteredTours = BuildSubService.applyPriceFilters(
    tours,
    minPrice,
    maxPrice
  );

  return {
    tours: filteredTours,
    meta: {
      page,
      limit,
      totalTours: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const getTourById = async (id: string) => {
  return await TourModel.findById(id)
    .populate("created_by", "name email")
    .populate("price_tiers")
    .populate("schedules");
};

export const updateTour = async (id: string, updateData: IUpdateTourSchema) => {
  const { price_tiers, schedules, gallery, ...rest } = updateData;

  const updatedTour = await TourModel.findByIdAndUpdate(id, rest, {
    new: true,
    runValidators: true,
  })
    .populate("created_by", "name email")
    .populate("price_tiers")
    .populate("schedules");

  return updatedTour;
};

export const deleteTour = async (id: string, session: ClientSession) => {
  const tourId = new Types.ObjectId(id);
  const tour = await TourModel.findByIdAndDelete(tourId, { session });

  if (!tour) return null;

  await DeleteSubService.deleteTourRelatedData(tourId, session);

  return tour;
};
