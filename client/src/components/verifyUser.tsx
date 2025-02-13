import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const VerifyUser: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [message, setMessage] = useState<string>('');


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

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="40%"
        height="40%"      />
      <button onClick={VerifyUser}>Verify Attendance</button>
      <p>{message}</p>
    </div>
  );
};

export default VerifyUser;
