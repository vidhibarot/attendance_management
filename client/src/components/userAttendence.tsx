import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa"; 
const FACEPP_API_KEY = "_UXutxBc1t5uQ2IYYA3ux5LgyYOeiGdA";
const FACEPP_API_SECRET = "jc7_GOkNvnkb8Z_TLst6S3Dz66EFQtBg";
const FACEPP_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";


const Attendance: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [name, setName] = useState<string>("");
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [success,setSucess]=useState<boolean>();

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages([...capturedImages, imageSrc]);
    }
  };

  const registerUser = async () => {
    const formData = new FormData();
    capturedImages.forEach((img, index) => {
      console.log("register user data......", img);
      console.log("hgfddfgdgf", dataURItoBlob(img), `face_${index}.jpg`);
      formData.append("images", dataURItoBlob(img), `face_${index}.jpg`);
    });
    formData.append("name", name);
    console.log("register user data......", name);

    try {
      const response = await axios.post(
        "http://localhost:5003/user/add",
        formData
      );
      console.log("response innnnnn", response);
      if (response.status == 200) {
        setMessage(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error during registration");
    }
  };

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  const VerifyUser = async () => {
    console.log("verify user ma ave chehehe.........");
    const imageSrc = webcamRef.current?.getScreenshot();
    const formData = new FormData();

    console.log("imafe srcmale chehehehe....", imageSrc);
    if (capturedImages) {
      capturedImages.forEach((img, index) => {
        console.log("register user data......", img);
        console.log("hgfddfgdgf", dataURItoBlob(img), `face_${index}.jpg`);
        formData.append("images", dataURItoBlob(img), `face_${index}.jpg`);
      });

      try {
        const response = await axios.post(
          "http://localhost:5003/user/verifyattendance",
          formData
        );
        console.log("status............",response?.status)
        if (response.status === 200) {
          console.log("in atatus 20000")
          setMessage(response.data.message);
          setSucess(true)
          // setVerified(true); // Set verified to true to show success

        } else {
          console.log("in status ....... else part ")
           setSucess(false)
          setMessage("Verification failed")
        }
  
        setMessage(response.data.message);
      } catch (error) {
        setMessage("Error during verification");
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
            {success ? (
        <div style={{ textAlign: "center", color: "green", fontSize: "24px" }}>
          <FaCheckCircle size={80} />
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="40%"
            height="40%"
          />
        </div>
      )}


      {/* <div style={{ position: "relative", display: "inline-block" }}> */}
      {/* <Webcam ref={webcamRef} width={400} height={300} screenshotFormat="image/jpeg" /> */}
      {/* <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="40%"
          height="40%"
        /> */}
        {/* <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} /> */}
        {/*  */}
      {/* </div> */}

      {/* <div>
        {capturedImages.map((img, index) => (
          <img key={index} src={img} alt={`face_${index}`} />
        ))}
      </div> */}

      <div>
        {" "}
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
      </div>
    </div>
  );
};

export default Attendance;
