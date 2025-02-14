const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Buffer } = require("buffer");

const app = express();
app.use(cors());
app.use(express.json()); // To parse incoming JSON requests

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/attendance_db", { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  userId: String,
  faceImages: [String], // Store base64 encoded images
});
const UserModel = mongoose.model("User", UserSchema);

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Use memoryStorage to keep images in memory
const upload = multer({ storage });

// Register User (Store Image as Base64)
app.post("/register-user", upload.single("image"), async (req, res) => {
  const { userId } = req.body;
  const fileBuffer = req.file.buffer;

  // Convert image to base64
  const base64Image = fileBuffer.toString("base64");

  let user = await UserModel.findOne({ userId });
  if (user) {
    user.faceImages.push(base64Image);
    await user.save();
  } else {
    await UserModel.create({ userId, faceImages: [base64Image] });
  }

  res.json({ success: true, message: "User registered successfully!" });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));

// Check Attendance by Comparing Face with Stored Faces
app.post("/check-attendance", async (req, res) => {
  const { image } = req.body; // base64 encoded image
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
  // Convert base64 to image buffer
  const buffer1 = Buffer.from(face1, "base64");
  const buffer2 = Buffer.from(face2, "base64");

  // You can now process these buffers (image processing) with a face recognition library (like OpenCV)
  // For simplicity, this part should be replaced with actual face comparison logic.
  // For example, you could use OpenCV or other face comparison libraries.

  // Placeholder: For now, consider two images "matching" if they are the same
  return buffer1.toString("base64") === buffer2.toString("base64");
};
