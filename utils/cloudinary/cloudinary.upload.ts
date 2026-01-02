import { UploadApiResponse } from 'cloudinary';
import cloudinary from './cloudinary.config';

export async function uploadToCloudinary(
  file: Express.Multer.File,
  folder: string = "LinkSphere"
): Promise<UploadApiResponse> {
  try {
    if (!file?.buffer) {
      throw new Error("File buffer is missing");
    }

    return await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed"));
          resolve(result);
        }
      );

      upload.end(file.buffer);
    });
  } catch (error) {
    throw error;
  }
}
