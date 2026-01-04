import { Request, Response, Router } from "express";
import { HotelService } from "./hotel.service";
import { upload } from "../../middleware/upload";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
      const hotels = await HotelService.getHotels();
  
      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Something went wrong"
      });
    }
  });

  router.get("/:hotelId", async (req: Request, res: Response) => {
    try {
      const { hotelId } = req.params;
  
      const data = await HotelService.getHotelDetails(hotelId);
  
      res.status(200).json({
        success: true,
        data
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  });

  router.post("/admin/hotels", async (req: Request, res: Response)=> {
    try {
      const hotel = await HotelService.createHotel(req.body);
  
      res.status(201).json({
        success: true,
        data: hotel
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  });

 
router.post("/admin/:hotelId/rooms", async (req: Request, res: Response) => {
  try {
    const { hotelId } = req.params;
    const room = await HotelService.createRoom(hotelId, req.body);

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post(
  "/admin/:hotelId/images",
  upload.array("images", 5),
  async (req: Request, res: Response) => {
    try {
      const gallery = await HotelService.addHotelImages(
        req.params.hotelId,
        req.files as any[]
      );

      res.status(200).json({
        success: true,
        data: gallery
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);
  
  export default router;