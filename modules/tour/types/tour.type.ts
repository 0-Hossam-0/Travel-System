import { ICreateTourSchema } from "./createTour.schema";

export type ITourImages = ICreateTourSchema["gallery"];

export type ITourPriceTiers = ICreateTourSchema["price_tiers"];

export type ITourSchedulesTiers = ICreateTourSchema["schedules"];
