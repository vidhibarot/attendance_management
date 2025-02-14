//my aold code with face ++ and also with face io api ..................
import models from "../Database/schema/index";
const { User } = models;
import * as faceapi from "face-api.js";
import * as canvas from "canvas";
import path from "path";
import fs from 'fs';
import FormData from 'form-data';
import { createCanvas, loadImage } from 'canvas';
const KDTree = require('kd-tree-javascript') as any;
const cv = require("opencv.js");
import axios from 'axios';

const API_KEY = '_UXutxBc1t5uQ2IYYA3ux5LgyYOeiGdA';
const API_SECRET = 'jc7_GOkNvnkb8Z_TLst6S3Dz66EFQtBg';

const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({
  Canvas: Canvas as unknown as typeof globalThis.HTMLCanvasElement,
  Image: Image as unknown as typeof globalThis.HTMLImageElement,
  ImageData: ImageData as unknown as typeof globalThis.ImageData,
});

class UserModel {
  static modelsLoaded = false;

  // Load face-api models
  static async loadModels() {
    if (!UserModel.modelsLoaded) {
      const modelsPath: string = path.join(__dirname);
      const modelpathSubstr = modelsPath.substring(0, 42) + "\\weights";
      console.log("Loading models from:", modelpathSubstr);

      // Load the face-api.js models
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelpathSubstr);
      await faceapi.nets.faceLandmark68Net.loadFromDisk(modelpathSubstr);
      await faceapi.nets.faceRecognitionNet.loadFromDisk(modelpathSubstr);

      UserModel.modelsLoaded = true;
      console.log("Models loaded successfully.");
    }
  }

  //using models 
  // async addUser(bodyData: any, file: any) {
  //   console.log("User Data:", bodyData, file);
  //   const { name } = bodyData;
  //   const images = file as Express.Multer.File[];
  //   // const modelsPath: string = path.join(__dirname);
  //   // console.log("moels path,,,,,", modelsPath);
  //   // const modelpathSubstr = modelsPath.substring(0, 42) + "\\weights";
  //   // console.log("melsdpath.....", modelpathSubstr);

  //   // // Load the face-api.js models
  //   // await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelpathSubstr);
  //   // await faceapi.nets.faceLandmark68Net.loadFromDisk(modelpathSubstr);
  //   // await faceapi.nets.faceRecognitionNet.loadFromDisk(modelpathSubstr);
  //   await UserModel.loadModels();

  //   // Load the uploaded image
  //   const image = await canvas.loadImage(images[0].path);
  //   const imgElement = image as unknown as HTMLImageElement;

  //   console.log("Image Loaded");

  //   const detections = await faceapi
  //     .detectAllFaces(imgElement)
  //     .withFaceLandmarks()
  //     .withFaceDescriptors();

  //   if (detections.length === 0) {
  //     return { status: 400, message: "No face detected in the image" };
  //   }

  //   const uploadedFaceDescriptor = detections[0].descriptor;
  //   // console.log("Face Descriptors:", uploadedFaceDescriptor);
  //   const existingUsers = await User.findAll();
  //   console.log("Face existingUsers:", existingUsers);

  //   if (existingUsers) {
  //     console.log("in existion user parts are there...");
  //     for (const user of existingUsers) {
  //       const savedFaceDescriptorJson = user.dataValues.imagepoint;
  //       const parsedDescriptor = JSON.parse(savedFaceDescriptorJson);

  //       const savedFaceDescriptor = Object.values(parsedDescriptor) as number[];

  //       const distance = faceapi.euclideanDistance(
  //         uploadedFaceDescriptor,
  //         savedFaceDescriptor
  //       );
  //       console.log("distance,,,,", distance);

  //       if (distance < 0.5) {
  //         return { status: 200, message: "User is already registered" };
  //       }
  //     }
  //   }
  //   console.log("in existion user parts are there... create use oart.....");

  //   const user = new User({
  //     name,
  //     images: images[0].path,
  //     imagepoint: uploadedFaceDescriptor,
  //   });

  //   await user.save();

  //   return {
  //     status: 200,
  //     message: "User registered successfully",
  //   };
  // }

//using model ....
//   async verifyUser(bodyData: any) {
//       console.log("Verifying user...", bodyData);
//   //     const uploadedImagePath = file[0].path;
  
//   //     if (!uploadedImagePath) {
//   //         return { status: 400, message: "No image uploaded" };
//   //     }
  
//   //     // Load image correctly
//   //     const img = await loadImage(uploadedImagePath);
//   //     const inputCanvas = createCanvas(img.width, img.height);
//   //     const ctx = inputCanvas.getContext("2d");
//   //     ctx.drawImage(img, 0, 0, img.width, img.height);

//   //     await UserModel.loadModels();

//   //     // await loadFaceApiModels();

//   //     // Detect face descriptors
//   //     const detections = await faceapi
//   //         .detectAllFaces(inputCanvas as any)
//   //         .withFaceLandmarks()
//   //         .withFaceDescriptors();
  
//   //     if (detections.length === 0) {
//   //         return { status: 400, message: "No face detected in the uploaded image" };
//   //     }
  
//   //     const uploadedFaceDescriptor = detections[0].descriptor;
  
//   //     // Fetch stored user face descriptors
//   //     const users = await User.findAll();
//   //     console.log("users .......",users)
//   // //     const faceData = users.map(user => ({
//   // //         id: user.id,
//   // //         descriptor: new Float32Array(JSON.parse(user.dataValues.imagepoint))
//   // //     }));
//   // // console.log("facedatat.....",faceData)
//   // const faceData = users.map(user => {
//   //   try {
//   //     const descriptorObject = JSON.parse(user.dataValues.imagepoint); // Parse JSON
//   //     const descriptorArray:any = Object.values(descriptorObject); // Convert object to array
//   //     if (!descriptorArray || descriptorArray.length === 0) {
//   //       console.error(`Warning: Empty descriptor for user ID ${user.id}`);
//   //       return null; // Skip empty descriptors
//   //     }
//   //     return { id: user.id, descriptor: new Float32Array(descriptorArray) };
//   //   } catch (error) {
//   //     console.error(`Error parsing descriptor for user ID ${user.id}:`, error);
//   //     return null; // Skip if JSON parsing fails
//   //   }
//   // }).filter(user => user !== null); // Remove null values
  
//   // // console.log("Parsed faceData:", faceData);
  
//   //     if (faceData.length === 0) {
//   //         return { status: 400, message: "No registered faces found" };
//   //     }
  
//   //     // Build KD-Tree for fast matching
//   //     // const tree = new KDTree(faceData.map(u => [...u.descriptor]), (a:any, b:any) => {
//   //     //     let sum = 0;
//   //     //     for (let i = 0; i < a.length; i++) {
//   //     //         sum += (a[i] - b[i]) ** 2;
//   //     //     }
//   //     //     return Math.sqrt(sum);
//   //     // }, faceData[0].descriptor.length);
//   //     const tree= new KDTree(faceData?.map(data=>[...data.descriptor]),(a: number[], b: number[]) => {
//   //       console.log("adddddddcccddd",a,b )
//   //     })
//   //   //   const tree = new KDTree(faceData?.map(u => [...u.descriptor]), (a: number[], b: number[]) => {
//   //   //     return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
//   //   // }, faceData[0].descriptor.length);
    
//   // console.log("treee data is there.......",tree)
//   //     // Find nearest face
//   //     const nearest = tree.nearest([...uploadedFaceDescriptor], 1)[0]; // Get closest match
//   //     const matchedUser = faceData.find(u => [...u.descriptor].toString() === nearest[0].toString());
  
//   //     if (matchedUser) {
//   //         return { status: 200, message: `Face matched! Attendance marked for ${matchedUser.id}` };
//   //     }
//   const { imagepoint } = bodyData;
//   const users = await User.findAll();
// console.log("yserrrrrrrrrrrrrr")
//   for (let user of users) {
//     const storedDescriptor = new Float32Array(user.imagepoint);
//     console.log("......",storedDescriptor)
//     const distance = faceapi.euclideanDistance(storedDescriptor, imagepoint);
// console.log("distancec,,,,",distance)
//     if (distance < 0.5) { // Adjust threshold for better accuracy
//       // return res.json({ match: true });
//       return { status: 200, message: "Face matchedd" };

//     }
//   }

//       return { status: 200, message: "Face did not match, attendance failed" };
//   }

  // using open cv ....
  // async addUser(bodyData:any,file:any){
  //   console.log("in ad usre,,,",bodyData,file)
  //     const { name } = bodyData;
  //     const filePath = file[0].path;    
  //       await User.create({ name, images: filePath });
    
  //       return { status:200,message : "User registered successfully!"}
    
  // }

  // async verifyUser(file:any){
  //   console.log("verify ma aveche.....")
  //   const  image  = "https://i.pinimg.com/originals/af/5f/3d/af5f3d44fc88d22dbc2b379b8044466f.png";
  //   console.log("image is ",image)
  //   const users = await User.findAll();
  
  //   if (!users.length) {
  //     return { status: 200, message: "No registered users!" };
  //   }
  
  //   for (let user of users) {
  //     for (let storedImage of user.images) {
  //       if (await this.compareFaces(image, storedImage)) {
  //         return { status: 200, message: `Attendance marked for ${user.id}` };
  //       }
  //     }
  //   }
  
  //   return{ status: 200, message: "Face not recognized!" };
  // }
  // async compareFaces(face1: any, face2: any) {
  //   face1="https://i.pinimg.com/originals/af/5f/3d/af5f3d44fc88d22dbc2b379b8044466f.png"
  //   face2="https://i.pinimg.com/originals/af/5f/3d/af5f3d44fc88d22dbc2b379b8044466f.png"
  //   console.log("favec12,,,,",face1,face2)
  //   try {
  //     console.log("compare ma ve chheh...........");
      
  //     // Check if the input files are valid
  //     if (!face1 || !face2) {
  //       throw new Error("Both face images must be provided.");
  //     }
  
  //     const mat1 = cv.imread(face1);
  //     const mat2 = cv.imread(face2);
      
  //     if (mat1.empty() || mat2.empty()) {
  //       throw new Error("Error reading one or both face images.");
  //     }
  //     // if (mat1.empty() || mat2.empty()) {
  //     //   throw new Error("Error reading one or both face images.");
  //     // }
  
  //     // Log image sizes to debug
  //     console.log("Mat1 size:", mat1.rows, mat1.cols);
  //     console.log("Mat2 size:", mat2.rows, mat2.cols);
  
  //     // Convert to grayscale
  //     cv.cvtColor(mat1, mat1, cv.COLOR_RGBA2GRAY);
  //     cv.cvtColor(mat2, mat2, cv.COLOR_RGBA2GRAY);
  
  //     const diff = new cv.Mat();
  //     cv.absdiff(mat1, mat2, diff);
  //     const nonZero = cv.countNonZero(diff);
      
  //     mat1.delete();
  //     mat2.delete();
  //     diff.delete();
  
  //     console.log("end..............");
  //     return nonZero < 5000; // If differences are below threshold, consider a match
  
  //   } catch (error:any) {
  //     console.error("Error in compareFaces:", error.message);
  //     return false; // Return false or handle the error accordingly
  //   }
  // }  

  async addUser(bodyData:any,file:any){
    console.log("bodydatat......",bodyData,file)
    const { name } = bodyData; 

  // Check if the file is uploaded
  if (!file) {
    return{status:200 ,message: 'No file uploaded'}
  }

  const imagePath = file[0].path;
console.log("image...",imagePath)
  const fileBuffer = fs.readFileSync(imagePath);

  const formData = new FormData();
  formData.append('api_key', API_KEY);
  formData.append('api_secret', API_SECRET);

  formData.append('image_file', fileBuffer, { filename: file[0].originalname });

  const response=await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', formData, {
    headers: formData.getHeaders(),
  })
  if(response?.data?.faces?.length == 0){
    return{status:200 ,message: 'No face detected in the image'}

  }
        if (response?.data?.faces && response.data.faces.length > 0) {
          const faceToken = response.data.faces[0].face_token;
    
          const result= await User.findAll()
          const users = result;
    
          for (const user of users) {
            console.log("facetokens......",user.dataValues)
            const compareFormData = new FormData();
            compareFormData.append('api_key', API_KEY);
            compareFormData.append('api_secret', API_SECRET);
            compareFormData.append('face_token1', faceToken);
            compareFormData.append('face_token2', user.dataValues.face_token);
    
            const compareResponse = await axios.post('https://api-us.faceplusplus.com/facepp/v3/compare', compareFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log("compar response...",compareResponse)
    
            if (compareResponse.data.confidence > 80) { // 80% confidence threshold
              // return res.status(200).json({ message: `User identified: ${user.name}` });
              return{status:200 ,message: 'user is already exist pls add other user'}
    
            }
            else{
              User.create({ name, images:file[0].path,face_token: faceToken})
              return{status:200 ,message: 'User registered successfully'}

            }
          }
    
          // res.status(404).json({ message: 'No match found' });
        }

    // .then((response:any) => {
    //   console.log("Response:", response);

    //   if (response.data.faces && response.data.faces.length > 0) {
    //     const faceToken = response.data.faces[0].face_token;

    //     User.create({ name, images:file[0].path,face_token: faceToken})
    //       .then(() => {
    //         return{status:200 ,message: 'User registered successfully'}
    //       })
    //       .catch((error) => {
    //         console.error('Database error:', error);
    //         return{status:200 ,message: 'Error saving user to database'}

    //       });
    //   } else {
    //     return{status:200 ,message: 'No face detected in the image'}

    //   }
    // })
    // .catch((error:any) => {
    //   console.error('Error with Face++ API:', error);
    //   return{status:200 ,message: 'Error registering user'}

    // });

  }
//add user final ...............................................................................
//   async addUser(bodyData:any,file:any){
//     console.log("bodydatat......",bodyData,file)
//     // const { name } = bodyData;
//     // const imagePath = file.path;
  
//     // // try {
//     //   // Send image to Face++ for face detection
//     //   const formData = new FormData();
//     //   const fileBuffer = fs.readFileSync(imagePath);

//     //   formData.append('api_key', API_KEY);
//     //   formData.append('api_secret', API_SECRET);
//     //   formData.append('image_file', fs.createReadStream(imagePath));
  
//     //   const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', formData, {
//     //     headers: {
//     //       'Content-Type': 'multipart/form-data',
//     //     },
//     //   });

//     //   console.log("response is there.....",response)
  
//     //   if (response.data.faces.length > 0) {
//     //     const faceToken = response.data.faces[0].face_token;
  
//     //     // Store user information in the database with the face token
//     //             await User.create({ name, face_token: faceToken });

//     //     // await pool.query('INSERT INTO users (name, face_token) VALUES ($1, $2)', [name, faceToken]);
//     //   return{ status: 200, message: 'User registered successfully' };

//     //     // res.status(200).json({ message: 'User registered successfully' });
//     //   } else {
//     //     return{ status: 200, message: 'No face detected in the image' };

//     //     // res.status(400).json({ message: 'No face detected in the image' });
//     //   }
//     // // } catch (error) {
//     // //   return{ status: 200, message: 'No face detected in the image' };

//     // //   // res.status(500).json({ message: 'Error registering user', error });
//     // // }
//     const { name } = bodyData; // Assuming the name is coming from the body
//   // const file = req.file; // File uploaded by user

//   // Check if the file is uploaded
//   if (!file) {
//     return{status:200 ,message: 'No file uploaded'}

//     // return res.status(400).json({ message: 'No file uploaded' });
//   }

//   const imagePath = file[0].path;
// console.log("image...",imagePath)
//   // Read the image file as a buffer
//   const fileBuffer = fs.readFileSync(imagePath);

//   // Create FormData and append necessary fields
//   const formData = new FormData();
//   formData.append('api_key', API_KEY);
//   formData.append('api_secret', API_SECRET);

//   // Append the file buffer directly (no Blob needed)
//   formData.append('image_file', fileBuffer, { filename: file[0].originalname });

//   // Send the image to Face++ for face detection
//   axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', formData, {
//     headers: formData.getHeaders(),
//   })
//     .then((response:any) => {
//       console.log("Response:", response);

//       if (response.data.faces && response.data.faces.length > 0) {
//         const faceToken = response.data.faces[0].face_token;

//         // Store user information in the database with the face token
//         User.create({ name, images:file[0].path,face_token: faceToken})
//           .then(() => {
//             return{status:200 ,message: 'User registered successfully'}
//             // res.status(200).json({ message: 'User registered successfully' });
//           })
//           .catch((error) => {
//             console.error('Database error:', error);
//             return{status:200 ,message: 'Error saving user to database'}

//             // res.status(500).json({ message: 'Error saving user to database' });
//           });
//       } else {
//         return{status:200 ,message: 'No face detected in the image'}

//         // res.status(400).json({ message: 'No face detected in the image' });
//       }
//     })
//     .catch((error:any) => {
//       console.error('Error with Face++ API:', error);
//       return{status:200 ,message: 'Error registering user'}

//       // res.status(500).json({ message: 'Error registering user' });
//     });

//   }
// -----------------------------------------------------------------------------------------------
async verifyUser(file:any){
  console.log("files ......",file)
  const imagePath = file[0].path;

  try {
    // Send image to Face++ for face detection
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('image_file', fs.createReadStream(imagePath));

    const detectResponse = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (detectResponse.data.faces.length > 0) {
      const faceToken = detectResponse.data.faces[0].face_token;

      // Retrieve all stored face tokens from the database
      // const result = await pool.query('SELECT * FROM users');
      const result= await User.findAll()
      // console.log("resultt.....",result)
      const users = result;

      for (const user of users) {
        console.log("facetokens......",user.dataValues)
        // Compare the incoming face with the stored face tokens
        const compareFormData = new FormData();
        compareFormData.append('api_key', API_KEY);
        compareFormData.append('api_secret', API_SECRET);
        compareFormData.append('face_token1', faceToken);
        compareFormData.append('face_token2', user.dataValues.face_token);

        const compareResponse = await axios.post('https://api-us.faceplusplus.com/facepp/v3/compare', compareFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (compareResponse.data.confidence > 80) { // 80% confidence threshold
          // return res.status(200).json({ message: `User identified: ${user.name}` });
          return{status:200 ,message: `User identified: ${user.dataValues.name}`}

        }
      }
      return{status:200 ,message: 'No match found'}

      // res.status(404).json({ message: 'No match found' });
    } else {
      return{status:200 ,message: 'No face detected in the image'}

      // res.status(400).json({ message: 'No face detected in the image' });
    }
  } catch (error) {
    return{status:200 ,message: 'Error comparing faces', error }

    // res.status(500).json({ message: 'Error comparing faces', error });
  }
}

}
module.exports = UserModel;

// }

