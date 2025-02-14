import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
const FACEPP_API_KEY = "_UXutxBc1t5uQ2IYYA3ux5LgyYOeiGdA";
const FACEPP_API_SECRET = "jc7_GOkNvnkb8Z_TLst6S3Dz66EFQtBg";
const FACEPP_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";

const Attendance: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [name, setName] = useState<string>('');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages([...capturedImages, imageSrc]);
    }
  };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     detectFace();
  //   }, 500); // Detect face every 500ms

  //   return () => clearInterval(interval);
  // }, []);

  // // Send Image to Face++ for Face Detection
  // const detectFace = async () => {
  //   if (!webcamRef.current) return;
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   if (!imageSrc) return;

  //   const formData = new FormData();
  //   formData.append("api_key", FACEPP_API_KEY);
  //   formData.append("api_secret", FACEPP_API_SECRET);
  //   formData.append("image_file", dataURItoBlob(imageSrc));

  //   try {
  //     const response = await axios.post(FACEPP_DETECT_URL, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (response.data.faces.length > 0) {
  //       drawFaceCircle(response.data.faces[0].face_rectangle);
  //     } else {
  //       clearCanvas();
  //     }
  //   } catch (error) {
  //     console.error("Face detection failed:", error);
  //   }
  // };
  // // Draw Circle Around Detected Face
  // const drawFaceCircle = (face: { top: number; left: number; width: number; height: number }) => {
  //   const canvas = canvasRef.current;
  //   if (!canvas || !webcamRef.current) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   const video = webcamRef.current.video;
  //   if (!video) return;

  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   ctx.beginPath();
  //   ctx.arc(
  //     face.left + face.width / 2, // Center X
  //     face.top + face.height / 2, // Center Y
  //     Math.max(face.width, face.height) / 2, // Radius
  //     0,
  //     2 * Math.PI
  //   );
  //   ctx.lineWidth = 3;
  //   ctx.strokeStyle = "red";
  //   ctx.stroke();
  // };

  // // Clear Canvas If No Face Is Detected
  // const clearCanvas = () => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  // };
  const registerUser = async () => {
    const formData = new FormData();
    capturedImages.forEach((img, index) => {
      console.log("register user data......",img)
console.log("hgfddfgdgf",dataURItoBlob(img), `face_${index}.jpg`)
      formData.append('images', dataURItoBlob(img), `face_${index}.jpg`);
    });
    formData.append('name', name);
    console.log("register user data......",name)

    try {
      const response = await axios.post('http://localhost:5003/user/add', formData);
      console.log("response innnnnn",response);
      if(response.status==200){
        setMessage(response.data.message);

      }
      else{
        alert(response.data.message)

      }
    } catch (error) {
      console.log(error)
      setMessage('Error during registration');
    }
  };

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  const VerifyUser = async () => {
    console.log("verify user ma ave chehehe.........")
    const imageSrc = webcamRef.current?.getScreenshot();
    const formData = new FormData();

    console.log("imafe srcmale chehehehe....",imageSrc)
    if(capturedImages){
      capturedImages.forEach((img, index) => {
        console.log("register user data......",img)
  console.log("hgfddfgdgf",dataURItoBlob(img), `face_${index}.jpg`)
        formData.append('images', dataURItoBlob(img), `face_${index}.jpg`);
      });

      try {
        const response = await axios.post('http://localhost:5003/user/verifyattendance', formData);
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Error during verification');
      // }
    }
    }

    // if (imageSrc) {
      // const formData = new FormData();
    //   console.log("formdata image src....",dataURItoBlob(imageSrc))
    //   formData.append('image', dataURItoBlob(imageSrc));

     
  };
  

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="40%"
        height="40%"
      />
      <button onClick={captureImage}>Capture Angle</button>
      <button onClick={registerUser}>Register</button>
      <button onClick={VerifyUser}>Verify Attendance</button>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>{message}</p>
      {/* <div>
        {capturedImages.map((img, index) => (
          <img key={index} src={img} alt={`face_${index}`} />
        ))}
      </div> */}
    </div>
  );
};

export default Attendance;


