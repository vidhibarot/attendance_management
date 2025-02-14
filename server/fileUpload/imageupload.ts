import multer from 'multer';
import path from 'path';
const cv = require("opencv.js");

// Set up file storage with Multer (for image uploads)
const storage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
      cb(null, './uploads/');
    },
    filename: (req:any, file:any, cb:any) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
export const Upload = multer({ storage });

