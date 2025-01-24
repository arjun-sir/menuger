import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
import s3Client from "./s3Client";

const bucketName = process.env.S3_BUCKET_NAME;

export const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucketName || "",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: any, metadata?: any) => void
    ) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void
    ) => {
      const uniqueKey = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueKey);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
