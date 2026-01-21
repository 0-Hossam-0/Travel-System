import mongoose, { Document, Schema , model , Types} from "mongoose";

export interface IFlight extends Document {
   flight_number: string;
   carrier: Types.ObjectId;
   aircraftType : string;
   legs : {
      origin: Types.ObjectId;
      destination: Types.ObjectId;
      departure_time: Date;
      arrival_time: Date;
      duration: number;
   }[];
   status : "scheduled" | "departed" | "arrived" | "cancelled";
}
   
const flightSchema = new Schema<IFlight>({
   flight_number: { type: String, required: true, unique: true },
   carrier: { type: Schema.Types.ObjectId, ref: "Airline", required: true },
   aircraftType : { type: String, required: true },
   legs : [
      {
         origin: { type: Schema.Types.ObjectId, ref: "Airport", required: true },
         destination: { type: Schema.Types.ObjectId, ref: "Airport", required: true },
         departure_time: { type: Date, required: true },
         arrival_time: { type: Date, required: true },
         duration: { type: Number, required: true },
      }
   ],
   status : { type: String, enum: ["scheduled", "departed", "arrived", "cancelled"], default: "scheduled" },
}, { timestamps: true });

export const Flight = model<IFlight>("Flight", flightSchema);