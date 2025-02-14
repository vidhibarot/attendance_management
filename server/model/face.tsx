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


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cv = require("opencv.js");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/attendance_db", { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  userId: String,
  faceImages: [String], // Array of images per user
});

const UserModel = mongoose.model("User", UserSchema);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/attendance_db", { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  userId: String,
  faceImages: [String], // Store image filenames
});
const UserModel = mongoose.model("User", UserSchema);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, req.body.userId + "_" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Register User (Store Image)
app.post("/register-user", upload.single("image"), async (req, res) => {
  const { name } = req.body;
  const filePath = req.file.path;

    await UserModel.create({ name, images: [filePath] });

    return { status:200,message : "User registered successfully!"}

  res.json({ success: true, message: "User registered successfully!", filePath });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));


// Check Attendance by Comparing Face with Stored Faces
app.post("/check-attendance", async (req, res) => {
  const { image } = req.body;
  const users = await UserModel.find();

  if (!users.length) {
    return res.json({ success: false, message: "No registered users!" });
  }

  for (let user of users) {
    for (let storedImage of user.faceImages) {
      if (compareFaces(image, storedImage)) {
        return res.json({ success: true, message: `Attendance marked for ${user.userId}` });
      }
    }
  }

  res.json({ success: false, message: "Face not recognized!" });
});

// Compare two face images (basic pixel difference)
const compareFaces = (face1, face2) => {
  const mat1 = cv.imread(face1);
  const mat2 = cv.imread(face2);

  cv.cvtColor(mat1, mat1, cv.COLOR_RGBA2GRAY);
  cv.cvtColor(mat2, mat2, cv.COLOR_RGBA2GRAY);

  const diff = new cv.Mat();
  cv.absdiff(mat1, mat2, diff);
  const nonZero = cv.countNonZero(diff);

  mat1.delete();
  mat2.delete();
  diff.delete();

  return nonZero < 5000; // If differences are below threshold, consider a match
};

// // module.exports = UserModel;
// import models from "../Database/schema/index";
// const { User } = models;
// import * as faceapi from "face-api.js";
// import * as canvas from "canvas";
// import path from "path";
// import fs from 'fs';
// import { createCanvas, loadImage } from 'canvas';
// const NodeCache = require('node-cache');  // In-memory cache

// // In-memory cache instance
// const myCache = new NodeCache();

// const { Canvas, Image, ImageData } = canvas;

// faceapi.env.monkeyPatch({
//   Canvas: Canvas as unknown as typeof globalThis.HTMLCanvasElement,
//   Image: Image as unknown as typeof globalThis.HTMLImageElement,
//   ImageData: ImageData as unknown as typeof globalThis.ImageData,
// });

// class UserModel {
  
//   // Add user and store face descriptor
//   async addUser(bodyData: any, file: any) {
//     console.log("User Data:", bodyData, file);
//     const { name } = bodyData;
//     const images = file as Express.Multer.File[];
//     const modelsPath: string = path.join(__dirname);
//     const modelpathSubstr = modelsPath.substring(0, 42) + "\\weights";
//     console.log("models path:", modelpathSubstr);

//     // Load the face-api.js models
//     await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelpathSubstr);
//     await faceapi.nets.faceLandmark68Net.loadFromDisk(modelpathSubstr);
//     await faceapi.nets.faceRecognitionNet.loadFromDisk(modelpathSubstr);

//     // Load the uploaded image
//     const image = await canvas.loadImage(images[0].path);
//     const imgElement = image as unknown as HTMLImageElement;

//     console.log("Image Loaded");

//     const detections = await faceapi
//       .detectAllFaces(imgElement)
//       .withFaceLandmarks()
//       .withFaceDescriptors();

//     if (detections.length === 0) {
//       return { status: 400, message: "No face detected in the image" };
//     }

//     const uploadedFaceDescriptor = detections[0].descriptor;

//     // Check if face is already registered
//     const existingUsers = await User.findAll();
//     for (const user of existingUsers) {
//       const savedFaceDescriptorJson = user.dataValues.imagepoint;
//       const parsedDescriptor = JSON.parse(savedFaceDescriptorJson);
//       const savedFaceDescriptor = Object.values(parsedDescriptor) as number[];

//       const distance = faceapi.euclideanDistance(
//         uploadedFaceDescriptor,
//         savedFaceDescriptor
//       );
//       if (distance < 0.5) {
//         return { status: 200, message: "User is already registered" };
//       }
//     }

//     // Save new user
//     const user = new User({
//       name,
//       images: images[0].path,
//       imagepoint: uploadedFaceDescriptor,
//     });

//     await user.save();

//     // Cache the user's face descriptor for fast access
//     myCache.set(name, uploadedFaceDescriptor);

//     return {
//       status: 200,
//       message: "User registered successfully",
//     };
//   }

//   // Verify user based on uploaded image
//   async verifyUser(file: any) {
//     console.log("Verifying user...", file);
//     const uploadedImagePath = file[0].path;

//     if (!uploadedImagePath) {
//       return { status: 400, message: "No image uploaded" };
//     }

//     // Load image correctly
//     const img = await loadImage(uploadedImagePath);
//     const inputCanvas = createCanvas(img.width, img.height);
//     const ctx = inputCanvas.getContext("2d");
//     ctx.drawImage(img, 0, 0, img.width, img.height);

//     // Detect face descriptors
//     const detections = await faceapi
//       .detectAllFaces(inputCanvas as any)
//       .withFaceLandmarks()
//       .withFaceDescriptors();

//     if (detections.length === 0) {
//       return { status: 400, message: "No face detected in the uploaded image" };
//     }

//     const uploadedFaceDescriptor = detections[0].descriptor;

//     // Check cached faces first
//     const cachedUser = myCache.get(name);
//     if (cachedUser) {
//       const distance = faceapi.euclideanDistance(uploadedFaceDescriptor, cachedUser);
//       if (distance < 0.5) {
//         return { status: 200, message: "User found in cache! Attendance marked." };
//       }
//     }

//     // If not in cache, check all users
//     const users = await User.findAll();
//     for (const user of users) {
//       const savedFaceDescriptorJson = user.dataValues.imagepoint;
//       const savedFaceDescriptor = Object.values(JSON.parse(savedFaceDescriptorJson)) as number[];

//       const distance = faceapi.euclideanDistance(uploadedFaceDescriptor, savedFaceDescriptor);
//       if (distance < 0.5) {
//         return { status: 200, message: `User matched! Attendance marked for ${user.name}` };
//       }
//     }

//     return { status: 400, message: "Face did not match, attendance failed" };
//   }
// }

// module.exports = UserModel;

// Backend: Node.js (Express + MongoDB)
// Install required packages: express, multer, mongoose, clarifai, dotenv, cors

const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Clarifai = require('clarifai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Initialize Clarifai
const clarifaiApp = new Clarifai.App({ apiKey: process.env.CLARIFAI_API_KEY });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({ name: String, faceImage: String });
const User = mongoose.model('User', userSchema);

// Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Register user with face image
app.post('/register', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        const imageBase64 = req.file.buffer.toString('base64');

        const user = new User({ name, faceImage: imageBase64 });
        await user.save();

        res.json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
});

// Verify user by comparing face images
app.post('/verify', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        const newImageBase64 = req.file.buffer.toString('base64');

        const user = await User.findOne({ name });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Compare images using Clarifai
        const response = await clarifaiApp.models.predict(Clarifai.FACE_EMBEDDING_MODEL, [
            { base64: user.faceImage },
            { base64: newImageBase64 }
        ]);

        const similarity = response.outputs[0].data.regions[0].value;
        if (similarity > 0.8) {
            res.json({ success: true, message: 'User verified!' });
        } else {
            res.json({ success: false, message: 'Face does not match' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error verifying user' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Frontend: React (Capture and send images to the backend)
// Install required packages: react-webcam, axios

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const FaceAuth = () => {
    const webcamRef = useRef(null);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const captureAndSend = async (endpoint) => {
        const imageSrc = webcamRef.current.getScreenshot();
        const blob = await fetch(imageSrc).then(res => res.blob());
        const formData = new FormData();
        formData.append('image', blob);
        formData.append('name', name);

        const response = await axios.post(`http://localhost:5000/${endpoint}`, formData);
        setMessage(response.data.message);
    };

    return (
        <div>
            <Webcam ref={webcamRef} screenshotFormat="image/png" />
            <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={() => captureAndSend('register')}>Register</button>
            <button onClick={() => captureAndSend('verify')}>Verify</button>
            <p>{message}</p>
        </div>
    );
};

export default FaceAuth;
