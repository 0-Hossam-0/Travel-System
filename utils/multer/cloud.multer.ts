import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { BadRequestException } from "../response/error.response";

export enum StorageEnum {
  memory = "memory",
  disk = "disk",
}

export const fileValidation = {
  image: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ],
};

export const cloudFileUpload = (
  validation = fileValidation.image,
  maxFileSizeMB = 6
) => {
  function fileFilter(
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) {

    if (!validation.includes(file.mimetype)) {
      return callback(
        new BadRequestException("ValidationError", {
          validationErrors: [
            {
              key: "file",
              issues: [
                {
                  path: "file",
                  message: "Invalid File Format",
                  info: "Only Accept Valid Formats",
                  validFormats: validation,
                },
              ],
            },
          ],
        })
      );
    }

    return callback(null, true);
  }

  return multer({
    fileFilter,
    limits: { fileSize: maxFileSizeMB * 1024 * 1024 },
    storage: multer.memoryStorage(),
  });
};
