import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const Attendance: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [name, setName] = useState<string>('');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages([...capturedImages, imageSrc]);
    }
  };

  const registerUser = async () => {
    const formData = new FormData();
    capturedImages.forEach((img, index) => {
      console.log("register user data......",img)

      formData.append('images', dataURItoBlob(img), `face_${index}.jpg`);
    });
    formData.append('name', name);
    console.log("register user data......",name)

    try {
      const response = await axios.post('http://localhost:5002/user/add', formData);
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
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const formData = new FormData();
      formData.append('image', dataURItoBlob(imageSrc));

      // try {
      //   const response = await axios.post('http://localhost:5000/verify', formData);
      //   setMessage(response.data.message);
      // } catch (error) {
      //   setMessage('Error during verification');
      // }
    }
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


