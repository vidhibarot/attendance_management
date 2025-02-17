import models from "../Database/schema/index";
const { User, Attendance, AttendanceMaster } = models;
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { timeEnd } from "console";
const moment = require("moment");

const API_KEY = "_UXutxBc1t5uQ2IYYA3ux5LgyYOeiGdA";
const API_SECRET = "jc7_GOkNvnkb8Z_TLst6S3Dz66EFQtBg";

class UserModel {
  //With image add user.......................................................
  async addUser(bodyData: any, file: any) {
    const { name } = bodyData;
    console.log("bodyyy..", bodyData, file);

    if (!file) {
      return { status: 422, message: "No file uploaded" };
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
    if (bodyData?.faces?.length == 0) {
      return { status: 404, message: "No face detected in the image" };
    }
    if (bodyData?.faces && response.data.faces.length > 0) {
      const faceToken = response.data.faces[0].face_token;

      const result = await User.findAll();
      const users = result;
      // console.log("users.........",users)

      if (users?.length == 0) {
        console.log("id ma ache cheheheh.,mmmmmmmmmm");
        User.create({ name, images: file[0].path, face_token: faceToken });
        return { status: 200, message: "User registered successfully" };
      } else {
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
            console.log("ifgg ma ave chehehe.......");

            return {
              status: 404,
              message: "user is already exist pls add other user",
            };
          } else {
            console.log("else ma ave chehehe.......");
            User.create({ name, images: file[0].path, face_token: faceToken });
            return { status: 200, message: "User registered successfully" };
          }
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
            const data = {
              user_id: user?.dataValues?.id,
            };
            const attendanceResponse = await this.addAttendance(data);
            console.log("atemndance respndeeee", attendanceResponse);
            // this.addAttendance(data)
            return {
              status: 200,
              message: `User identified: ${user.dataValues.name} ${attendanceResponse?.message}`,
            };
          }
        }
        return { status: 404, message: "No match found" };
      } else {
        return { status: 422, message: "No face detected in the image" };
      }
    } catch (error) {
      return { status: 404, message: "Error comparing faces", error };
    }
  }

  async addAttendance(bodyData: any) {
    function parseTimeToMinutes(time: string): number {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return hours * 60 + minutes + seconds / 60;
    }
    console.log("in model file .......", bodyData);
    let daily_minutes = 480;
    let date = moment(new Date()).format("YYYY-MM-DD");
    console.log("pela ave cheheh.....", date);
    let currentTime = moment().format("HH:mm:ss");
    console.log("current time is there.....");

    let checkUser = await AttendanceMaster.findOne({
      where: {
        date: date,
        user_id: bodyData?.user_id,
      },
    });
    console.log("checkUsercheckUser", checkUser);
    // if (bodyData?.check_in) {
    console.log("if condition check in male  heheh........,date", date);
    if (!checkUser) {
      console.log("user nathi malto.........");
      let payrollMasterData = {
        user_id: bodyData?.user_id,
        date: date,
      };

      let payrollMaster = await AttendanceMaster.create(payrollMasterData);

      let payrollData = {
        master_id: payrollMaster?.id,
        check_in: currentTime,
      };

      await Attendance.create(payrollData);
      return {
        status: 200,
        message:
          "Welcome! You have successfully checked in. Have a productive day!",
      };
      // } else {
      //   let checkClockOut = await Attendance.findOne({
      //     where: {
      //       master_id: checkUser?.id,
      //     },
      //     limit: 1,
      //     order: [["id", "DESC"]],
      //   });

      //   if (checkClockOut?.check_out !== null) {
      //     let payrollData = {
      //       master_id: checkUser?.id,
      //       check_in: bodyData?.check_in,
      //     };

      //     await Attendance.create(payrollData);
      //     return {
      //       status: 200,
      //       message: "Attendance Added suceesfully",
      //     };
      //   } else {
      //     return {
      //       status: 404,
      //       message: "Please first check out",
      //     };
      //   }
    } else {
      const findLast = await Attendance.findOne({
        where: {
          master_id: checkUser?.id,
        },
        order: [["id", "DESC"]],
      });
      console.log("findlat........", findLast);
      if (findLast?.dataValues?.check_out) {
        console.log("user check out ma avehehehe.....");
        let payrollData = {
          master_id: findLast?.dataValues.master_id,
          check_in: currentTime,
        };

        await Attendance.create(payrollData);
        return {
          status: 200,
          message:
            "Welcome! You have successfully checked in. Have a productive day!",
        };
      } else {
        console.log("user check in ma avehehehe.....");

        let clock_in = findLast?.dataValues?.check_in;
        let clock_out = currentTime;

        var minute: any;
        if (clock_in && clock_out) {
          // Parse clock_in and clock_out into total minutes
          const checkInMinutes = parseTimeToMinutes(clock_in);
          const checkOutMinutes = parseTimeToMinutes(clock_out);

          // Calculate the difference in minutes
          minute = Math.round(checkOutMinutes - checkInMinutes);

          console.log("minute difference>>>", minute);
        }
        let update_payroll = {
          minutes: 0,
          check_out: currentTime,
          ot_minutes: 0,
        };
        if (checkUser?.minutes < daily_minutes) {
          console.log("checkuserrrrrrrrrr", checkUser?.dataValues?.minutes);
          var NewMinute = daily_minutes - checkUser?.dataValues?.minutes;
          console.log("newminuttttt beforr", minute, NewMinute);

          if (minute > NewMinute) {
            console.log("newminuttttt after", NewMinute);

            let otMinutes = minute - NewMinute;
            update_payroll.minutes = NewMinute;
            update_payroll.ot_minutes = otMinutes;
          } else {
            update_payroll.minutes = minute;
          }
        }

        if (checkUser?.minutes == daily_minutes) {
          update_payroll.ot_minutes = minute;
        }

        console.log("avechhe ahi............", update_payroll);
        await Attendance.update(update_payroll, {
          where: {
            id: findLast?.id,
          },
        });
        console.log("update_payroll?.minutes", update_payroll?.minutes);
        await AttendanceMaster.increment(
          {
            minutes: update_payroll?.minutes,
            ot_minutes: update_payroll?.ot_minutes,
          },
          {
            where: {
              user_id: bodyData?.user_id,
              date: date,
            },
          }
        );
        return {
          status: 200,
          message:
            "Goodbye! You have successfully checked out. Have a great rest of your day!",
        };
      }
    }
    // } else {
    //   if (!checkUser) {
    //     return {
    //       status: 405,
    //       message: "Please first check in ",
    //     };
    //   }

    //   let checkClockOut = await Attendance.findOne({
    //     where: {
    //       master_id: checkUser?.id,
    //     },
    //     limit: 1,
    //     order: [["id", "DESC"]],
    //   });

    //   if (checkClockOut?.check_out !== null) {
    //     return {
    //       status: 405,
    //       message: "Please first check in ",
    //     };
    //   }
    //   console.log("ghchgdhh", checkClockOut?.dataValues);
    //   let clock_in = checkClockOut?.dataValues?.check_in;
    //   let clock_out = bodyData?.check_out;

    //   var minute: any;
    //   // Ensure both clock_in and clock_out are valid strings
    //   if (clock_in && clock_out) {
    //     // Parse clock_in and clock_out into total minutes
    //     const checkInMinutes = parseTimeToMinutes(clock_in);
    //     const checkOutMinutes = parseTimeToMinutes(clock_out);

    //     // Calculate the difference in minutes
    //     minute = Math.round(checkOutMinutes - checkInMinutes);

    //     console.log("minute difference>>>", minute);
    //   }

    //   let update_payroll = {
    //     minutes: 0,
    //     check_out: bodyData?.check_out,
    //     ot_minutes: 0,
    //   };
    //   if (checkUser?.minutes < daily_minutes) {
    //     console.log("checkuserrrrrrrrrr", checkUser?.dataValues?.minutes);
    //     var NewMinute = daily_minutes - checkUser?.dataValues?.minutes;
    //     console.log("newminuttttt beforr", minute, NewMinute);

    //     if (minute > NewMinute) {
    //       console.log("newminuttttt after", NewMinute);

    //       let otMinutes = minute - NewMinute;
    //       update_payroll.minutes = NewMinute;
    //       update_payroll.ot_minutes = otMinutes;
    //     } else {
    //       update_payroll.minutes = minute;
    //     }
    //   }

    //   if (checkUser?.minutes == daily_minutes) {
    //     update_payroll.ot_minutes = minute;
    //   }

    //   console.log("avechhe ahi............", update_payroll);
    //   await Attendance.update(update_payroll, {
    //     where: {
    //       id: checkClockOut?.id,
    //     },
    //   });
    //   console.log("update_payroll?.minutes", update_payroll?.minutes);
    //   await AttendanceMaster.increment(
    //     {
    //       minutes: update_payroll?.minutes,
    //       ot_minutes: update_payroll?.ot_minutes,
    //     },
    //     {
    //       where: {
    //         user_id: bodyData?.user_id,
    //         date: date,
    //       },
    //     }
    //   );
    //   return {
    //     status: 200,
    //     message: "Attendance Added suceesfully",
    //   };
    // }
  }
  // async addUser(bodyData: any) {
  //   console.log("ass use ma ave che,,,,,,,,")
  //   const {name}=bodyData
  //   if (bodyData?.faces?.length == 0) {
  //     return { status: 404, message: "No face detected in the image" };
  //   }
  //   if (bodyData?.faces && bodyData.faces.length > 0) {
  //     const faceToken = bodyData.faces[0].face_token;

  //     const result = await User.findAll();
  //     const users = result;
  //     // console.log("users.........",users)

  //     if (users?.length == 0) {
  //       console.log("id ma ache cheheheh.,mmmmmmmmmm");
  //       User.create({ name, face_token: faceToken });
  //       return { status: 200, message: "User registered successfully" };
  //     } else {
  //       for (const user of users) {
  //         const compareFormData = new FormData();
  //         compareFormData.append("api_key", API_KEY);
  //         compareFormData.append("api_secret", API_SECRET);
  //         compareFormData.append("face_token1", faceToken);
  //         compareFormData.append("face_token2", user.dataValues.face_token);

  //         const compareResponse = await axios.post(
  //           "https://api-us.faceplusplus.com/facepp/v3/compare",
  //           compareFormData,
  //           {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           }
  //         );
  //         console.log("compar response...", compareResponse);

  //         if (compareResponse.data.confidence > 80) {
  //           console.log("ifgg ma ave chehehe.......");

  //           return {
  //             status: 200,
  //             message: "user is already exist pls add other user",
  //           };
  //         } else {
  //           console.log("else ma ave chehehe.......");
  //           User.create({ name, face_token: faceToken });
  //           return { status: 200, message: "User registered successfully" };
  //         }
  //       }
  //     }
  //   }
  // }
  async detectUser(file: any){
    console.log("filennnn",file)
    const imageFile = file[0].path; 
    const formData = new FormData();
    
    formData.append("api_key", API_KEY);
    formData.append("api_secret", API_SECRET);
    formData.append("image_file", fs.createReadStream(imageFile));

    // Send request to Face++ API
    const response = await axios.post(
      "https://api-us.faceplusplus.com/facepp/v3/detect",
      formData,
      { headers: formData.getHeaders() }
    );
console.log("repspones ein delect user...",response)
    return { status: 200, message: "face " ,data:response};

    // return {status :200 message:response}

  }
}
module.exports = UserModel;
