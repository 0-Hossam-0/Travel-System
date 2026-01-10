import { QueryFilter } from "mongoose";
import { ITourDocument } from "../../../DB/models/tour/tour.model";

export const buildTourFilters = (params: Record<string, any>): QueryFilter<ITourDocument> => {
  const filter: QueryFilter<ITourDocument> = {};

  if (params.location)
    filter.location = { $regex: params.location, $options: "i" };

  if (params.recommended !== undefined) filter.recommended = params.recommended;

  if (params.minDuration || params.maxDuration) {
    filter.duration = {};
    if (params.minDuration) filter.duration.$gte = params.minDuration;
    if (params.maxDuration) filter.duration.$lte = params.maxDuration;
  }

  if (params.search) {
    filter.$or = [
      { title: { $regex: params.search, $options: "i" } },
      { description: { $regex: params.search, $options: "i" } },
      { location: { $regex: params.search, $options: "i" } },
    ];
  }

  return filter;
};

export const buildTourSort = (sortBy: string, sortOrder: string) => {
  return { [sortBy]: sortOrder === "asc" ? 1 : -1 };
};

export const applyPriceFilters = (tours: ITourDocument[], min?: number, max?: number) => {
  if (min === undefined && max === undefined) return tours;

  return tours.filter((tour) => {
    if (!tour.price_tiers || tour.price_tiers.length === 0) return false;

    const prices = tour.price_tiers.map((tier: any) => tier.adult_price);
    const minTourPrice = Math.min(...prices);
    const maxTourPrice = Math.max(...prices);

    const meetsMin = min === undefined || maxTourPrice >= min;
    const meetsMax = max === undefined || minTourPrice <= max;

    return meetsMin && meetsMax;
  });
};
