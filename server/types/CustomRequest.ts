import { Request } from "express";

export interface CustomRequest extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[]; // or adjust according to your upload library
  };
}
