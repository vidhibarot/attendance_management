import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
// import multer from 'multer';
// import path from 'path';
import * as faceapi from 'face-api.js';  // Make sure to install face-api.js for face recognition
import bodyParser from 'body-parser';

// Initialize Express
const app = express();
const port = 5000;

// Set up body parser for handling form-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // Set up file storage with Multer (for image uploads)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/attendance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Schema for User Face Data
const userSchema = new mongoose.Schema({
  name: String,
  images: [String],  // Array of image paths
});

const User = mongoose.model('User', userSchema);

// POST endpoint to register user (store face images)
app.post('/register', upload.array('images'), async (req: Request, res: Response) => {
  const { name } = req.body;
  const images = req.files as Express.Multer.File[];
  
  const user = new User({
    name,
    images: images.map((file) => file.path),
  });
  
  await user.save();
  res.json({ message: 'User registered successfully' });
});

// POST endpoint to verify user face during attendance
app.post('/verify', upload.single('image'), async (req: Request, res: Response) => {
  const uploadedImage = req.file?.path;

  if (!uploadedImage) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const users = await User.find();

  // Facial recognition logic
  // You can use face-api.js or OpenCV here to compare faces

  // Example using face-api.js:
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
  const inputImage = await faceapi.bufferToImage(req.file?.buffer);
  console.log("input image......",inputImage)
  const detections = await faceapi.detectAllFaces(inputImage).withFaceLandmarks().withFaceDescriptors();

  // Compare with stored face descriptors
  let matchFound = false;
  for (const user of users) {
    // Compare faces stored in DB with the captured face
    // Assuming face descriptors are saved in DB after training
  }

  if (matchFound) {
    return res.json({ message: 'Face matched, attendance marked' });
  }

  return res.json({ message: 'Face did not match, attendance failed' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
