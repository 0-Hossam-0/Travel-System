import cloudinary from "./cloudinary.config";

export const deleteImageFromCloudinary = async (publicId: string): Promise<void | true> => {
  try {
    await cloudinary.uploader.destroy(publicId);
      return true
  } catch (error) {
    console.error(`Error deleting image: ${publicId}`, error);
    throw error;
  }
};