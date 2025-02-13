import models from "../Database/schema/index";

const { User } = models;
// import canvas from 'canvas'; 
// import path from "path"
// // import data from modelsPath

// import * as faceapi from 'face-api.js'; // Import face recognition library (e.g., face-api.js)
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import path from 'path';

const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({
  Canvas: Canvas as unknown as typeof globalThis.HTMLCanvasElement,
  Image: Image as unknown as typeof globalThis.HTMLImageElement,
  ImageData: ImageData as unknown as typeof globalThis.ImageData
});



// class UserModel {
//   async addUser(bodyData: any, file: any) {
//     console.log("user.............l.....bodydaya ...", bodyData);
//     const { name } = bodyData;
//     const images = file as Express.Multer.File[];
//     console.log("folellll", file);
//     //  const user = new User({
//     //    name,
//     //    images: images.map((file) => file.path),
//     //  });
//     const user = new User({
//       name,
//       images: images[0].path,
//     });

//     await user.save();

//     return {
//       status: 200,
//       message: "User registerd suceesfully",
//     };
//   }
// import models from "../Database/schema/index";

// const { User } = models;

class UserModel {
//   async addUser(bodyData: any, file: any) {
//     console.log("User Data:", bodyData);
//     const { name } = bodyData;
//     const images = file as Express.Multer.File[];
//     // console.log("Uploaded Files:", file);
//     const modelsPath:string = path.join(__dirname);
//     const modelpathSubstr = modelsPath.substring(0, 35) + "\\weights";
//     console.log("melsdpath.....",modelpathSubstr)


//     // Initialize face-api.js or any other face recognition library

//     // Load face-api.js models (this would need to be done once globally, not inside this method)
//     await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelpathSubstr);
//     await faceapi.nets.faceLandmark68Net.loadFromDisk(modelpathSubstr);
//     await faceapi.nets.faceRecognitionNet.loadFromDisk(modelpathSubstr);

//     const image = await canvas.loadImage(images[0].path); // Load uploaded image
//     const imgElement = image as unknown as HTMLImageElement;
// console.log("after i age elemnt......")
// // Detect faces
// const detections = await faceapi.detectAllFaces(imgElement).withFaceLandmarks().withFaceDescriptors();

//     // Detect faces in the uploaded image
//     // const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
//     // const detections = await faceapi.detectAllFaces(image as HTMLImageElement).withFaceLandmarks().withFaceDescriptors();


//     if (detections.length === 0) {
//       return { status: 400, message: "No face detected in the image" };
//     }

//     // Extract face descriptor from uploaded image
//     const uploadedFaceDescriptor = detections[0].descriptor;
//     console.log("face desrtiptors......",uploadedFaceDescriptor)

//     // Fetch all users from the database and check their face descriptors
//     const existingUsers = await User.findAll();

//     // for (const user of existingUsers) {
//     //   // Assuming you stored face descriptors in the database
//     //   const savedFaceDescriptor = user.faceDescriptor; // Assuming you saved face descriptor during registration

//     //   const distance = faceapi.euclideanDistance(uploadedFaceDescriptor, savedFaceDescriptor);

//     //   if (distance < 0.6) {
//     //     return { status: 400, message: "User is already registered" }; // Distance threshold for match
//     //   }
//     // }

//     // If no match, create a new user record with the face descriptor
//     const user = new User({
//       name,
//       images: images[0].path,
//     //   faceDescriptor: uploadedFaceDescriptor, // Store the face descriptor
//     });

//     await user.save();

//     return {
//       status: 200,
//       message: "User registered successfully",
//     };
//   }
async  addUser(bodyData: any, file: any) {
  console.log("User Data:", bodyData,file);
  const { name } = bodyData;
  const images = file as Express.Multer.File[];
    const modelsPath:string = path.join(__dirname);
    console.log("moels path,,,,,",modelsPath)
    const modelpathSubstr = modelsPath.substring(0, 42) + "\\weights";
    console.log("melsdpath.....",modelpathSubstr)

  // Load the face-api.js models
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelpathSubstr);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelpathSubstr);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelpathSubstr);

  // Load the uploaded image
  const image = await canvas.loadImage(images[0].path);
  const imgElement = image as unknown as HTMLImageElement;

  console.log("Image Loaded");

  const detections = await faceapi.detectAllFaces(imgElement).withFaceLandmarks().withFaceDescriptors();

  if (detections.length === 0) {
    return { status: 400, message: "No face detected in the image" };
  }

  const uploadedFaceDescriptor = detections[0].descriptor;
  // console.log("Face Descriptors:", uploadedFaceDescriptor);
  const existingUsers = await User.findAll();
  console.log("Face existingUsers:", existingUsers);

if(existingUsers){
  console.log("in existion user parts are there...")
  for (const user of existingUsers) {
    const savedFaceDescriptorJson = user.dataValues.imagepoint
    const parsedDescriptor = JSON.parse(savedFaceDescriptorJson);
  
    const savedFaceDescriptor = Object.values(parsedDescriptor) as number[]; 
  
    const distance = faceapi.euclideanDistance(uploadedFaceDescriptor, savedFaceDescriptor);
    console.log("distance,,,,", distance);
  
    if (distance < 0.5) {
      return { status: 200, message: "User is already registered" };
    }

  }
}
console.log("in existion user parts are there... create use oart.....")

  const user = new User({
    name,
    images: images[0].path,
    imagepoint: uploadedFaceDescriptor
  });

  await user.save();

return {
  status: 200,
  message: "User registered successfully",
};
}

}

module.exports = UserModel;

// }

// module.exports = UserModel;
