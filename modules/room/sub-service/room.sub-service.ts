import { ConflictException } from "../../../utils/response/error.response";
import { IRoom } from "../../../schema/room/room.schema";

export const checkRoomAvailabilityConflict = (
  existingRooms: IRoom[], 
  newCalendar: IRoom["availability_calendar"]
) => {
  if (existingRooms.length > 0 && newCalendar?.length) {
    for (const room of existingRooms) {
      const isDuplicateDate = newCalendar.some((newSlot) =>
        room.availability_calendar.some(
          (existingSlot: IRoom["availability_calendar"][number]) =>
            new Date(existingSlot.start_date).getTime() ===
              new Date(newSlot.start_date).getTime() &&
            new Date(existingSlot.end_date).getTime() ===
              new Date(newSlot.end_date).getTime()
        )
      );

      if (isDuplicateDate) 
        throw new ConflictException(
          "Room with the same name and dates already exists!"
        );
      
    }
  }
};
