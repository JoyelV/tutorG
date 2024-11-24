import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
    cb(null, './public'); 
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ 
  storage, 
});

export default upload;
