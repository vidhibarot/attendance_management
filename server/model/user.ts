import models from "../Database/schema/index";
const { User } = models;
import fs from "fs";
import FormData from "form-data";
import axios from "axios";

const API_KEY = "_UXutxBc1t5uQ2IYYA3ux5LgyYOeiGdA";
const API_SECRET = "jc7_GOkNvnkb8Z_TLst6S3Dz66EFQtBg";

class UserModel {
  async addUser(bodyData: any, file: any) {
    console.log("bodydatat......", bodyData, file);
    const { name } = bodyData;

    if (!file) {
      return { status: 200, message: "No file uploaded" };
    }

    const imagePath = file[0].path;
    console.log("image...", imagePath);
    const fileBuffer = fs.readFileSync(imagePath);

    const formData = new FormData();
    formData.append("api_key", API_KEY);
    formData.append("api_secret", API_SECRET);

    formData.append("image_file", fileBuffer, {
      filename: file[0].originalname,
    });

    const response = await axios.post(
      "https://api-us.faceplusplus.com/facepp/v3/detect",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    if (response?.data?.faces?.length == 0) {
      return { status: 200, message: "No face detected in the image" };
    }
    if (response?.data?.faces && response.data.faces.length > 0) {
      const faceToken = response.data.faces[0].face_token;

      const result = await User.findAll();
      const users = result;

      for (const user of users) {
        const compareFormData = new FormData();
        compareFormData.append("api_key", API_KEY);
        compareFormData.append("api_secret", API_SECRET);
        compareFormData.append("face_token1", faceToken);
        compareFormData.append("face_token2", user.dataValues.face_token);

        const compareResponse = await axios.post(
          "https://api-us.faceplusplus.com/facepp/v3/compare",
          compareFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("compar response...", compareResponse);

        if (compareResponse.data.confidence > 80) {
          return {
            status: 200,
            message: "user is already exist pls add other user",
          };
        } else {
          User.create({ name, images: file[0].path, face_token: faceToken });
          return { status: 200, message: "User registered successfully" };
        }
      }
    }
  }

  //verrify User ..........
  async verifyUser(file: any) {
    const imagePath = file[0].path;

    try {
      const formData = new FormData();
      formData.append("api_key", API_KEY);
      formData.append("api_secret", API_SECRET);
      formData.append("image_file", fs.createReadStream(imagePath));

      const detectResponse = await axios.post(
        "https://api-us.faceplusplus.com/facepp/v3/detect",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (detectResponse.data.faces.length > 0) {
        const faceToken = detectResponse.data.faces[0].face_token;

        const result = await User.findAll();
        const users = result;

        for (const user of users) {
          console.log("facetokens......", user.dataValues);
          const compareFormData = new FormData();
          compareFormData.append("api_key", API_KEY);
          compareFormData.append("api_secret", API_SECRET);
          compareFormData.append("face_token1", faceToken);
          compareFormData.append("face_token2", user.dataValues.face_token);

          const compareResponse = await axios.post(
            "https://api-us.faceplusplus.com/facepp/v3/compare",
            compareFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (compareResponse.data.confidence > 80) {
            return {
              status: 200,
              message: `User identified: ${user.dataValues.name}`,
            };
          }
        }
        return { status: 200, message: "No match found" };
      } else {
        return { status: 200, message: "No face detected in the image" };
      }
    } catch (error) {
      return { status: 200, message: "Error comparing faces", error };
    }
  }
}
module.exports = UserModel;
