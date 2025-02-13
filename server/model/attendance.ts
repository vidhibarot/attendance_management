// const {
//     attendance_master:AttendanceMaster,
//     attendance:Attendance
//   } = require("../Database/schema/index.ts");
import models from '../Database/schema/index'; // Path to where your index.js file is located

const { AttendanceMaster,Attendance } = models; // Destructure to get the model

//   import {} from "../Database/schema"

//   import AttendanceMaster from '../Database/Schema/attendance_master';  // Adjust based on the actual folder structure

  const moment = require('moment');
  class AttendanceModel {
      async addAttendance(bodyData: any) {
        function parseTimeToMinutes(time: string): number {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            return hours * 60 + minutes + seconds / 60;
        }
        console.log("in model file .......",bodyData);
        let daily_minutes = 480;
        let date = moment(new Date()).format("YYYY-MM-DD");
        console.log("pela ave cheheh.....",date)
        let checkUser = await AttendanceMaster.findOne({
            where: {
                date: date,
                user_id: bodyData?.user_id
            }
        });
        console.log("checkUsercheckUser",checkUser)
        // if (bodyData?.check_in && bodyData.check_out) {
        //     let checkInMinutes = parseTimeToMinutes(check_in);
        //     let checkOutMinutes = parseTimeToMinutes(check_out);
        //     let workedMinutes = Math.round(checkOutMinutes - checkInMinutes);
        //     console.log("Worked minutes: ", workedMinutes);

        //     // Calculate the total worked minutes and overtime
        //     let updatePayroll = {
        //         check_out: bodyData?.check_out,
        //         minutes: workedMinutes < daily_minutes ? workedMinutes : daily_minutes,
        //         ot_minutes: workedMinutes > daily_minutes ? workedMinutes - daily_minutes : 0
        //     };

        //     console.log("Updated payroll: ", updatePayroll);

        //     // Update the attendance record with check-out time and minutes worked
        //     await Attendance.update(updatePayroll, {
        //         where: { id: lastAttendance?.id }
        //     });

        //     // Increment the total minutes and overtime in AttendanceMaster table
        //     return await AttendanceMaster.increment({
        //         minutes: updatePayroll.minutes,
        //         ot_minutes: updatePayroll.ot_minutes
        //     }, {
        //         where: {
        //             user_id: bodyData?.user_id,
        //             date: date
        //         }
        //     });
        // }
        if(bodyData?.check_in){
          console.log("if condition check in male  heheh........,date",date)
            if(!checkUser){
                let payrollMasterData = {
                    user_id: bodyData?.user_id,
                    date: date
                };
  
                let payrollMaster = await AttendanceMaster.create(payrollMasterData);
  
                let payrollData = {
                    master_id: payrollMaster?.id,
                    check_in: bodyData?.check_in,
                };
  
                 await Attendance.create(payrollData);
                 return {
                    status: 200,
                    message: "Attendance Added suceesfully",
        
                };
            }
            else{
                let checkClockOut = await Attendance.findOne({
                    where: {
                        master_id: checkUser?.id,
                    },
                    limit: 1,
                    order: [['id', 'DESC']]
                });
  
                if (checkClockOut?.check_out !== null) {
                    let payrollData = {
                        master_id: checkUser?.id,
                        check_in: bodyData?.check_in,
                    };
  
                    await Attendance.create(payrollData);
                    return {
                        status: 200,
                        message: "Attendance Added suceesfully",
            
                    };
  
                }
                else {
                    return {
                        status: 404,
                        message: "Please first check out",
  
                    };
                }
            }
        }
        else{
            if (!checkUser) {
                return {
                    status:405,
                    message:"Please first check in "
                };
            }
  
            let checkClockOut = await Attendance.findOne({
                where: {
                    master_id: checkUser?.id,
                },
                limit: 1,
                order: [['id', 'DESC']]
            });
  
            if (checkClockOut?.check_out !== null) {
                return {
                    status: 405,
                    message:"Please first check in "
  
                };
            }
  console.log("ghchgdhh",checkClockOut?.dataValues)
            let clock_in = checkClockOut?.dataValues?.check_in;
            let clock_out = bodyData?.check_out;
            
            
            var minute:any
            // Ensure both clock_in and clock_out are valid strings
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
                check_out: bodyData?.check_out,
                ot_minutes: 0,
            };
            if (checkUser?.minutes < daily_minutes) {
                console.log("checkuserrrrrrrrrr",checkUser?.dataValues?.minutes)
              var NewMinute = daily_minutes - checkUser?.dataValues?.minutes;
              console.log("newminuttttt beforr",minute,NewMinute)

              if (minute > NewMinute) {
                console.log("newminuttttt after",NewMinute)

                  let otMinutes = minute - NewMinute;
                  update_payroll.minutes = NewMinute;
                  update_payroll.ot_minutes = otMinutes;
                     
              } else {
                  update_payroll.minutes = minute
              }
          }
  
          if(checkUser?.minutes==daily_minutes){
            update_payroll.ot_minutes= minute
          }
  
          console.log("avechhe ahi............",update_payroll)
          await Attendance.update(update_payroll, {
              where: {
                  id: checkClockOut?.id
              },
          });
  console.log("update_payroll?.minutes",update_payroll?.minutes)
           await AttendanceMaster.increment({
              minutes: update_payroll?.minutes,
              ot_minutes: update_payroll?.ot_minutes
          }, {
              where: {
                  user_id: bodyData?.user_id,
                  date: date
              },
          });
          return {
            status: 200,
            message: "Attendance Added suceesfully",

        };
        }
       
      }
      async getAttendance(bodyData: any) {
        const data = await AttendanceMaster.findAll({
            where: {
                user_id: bodyData?.user_id
            }
        });
        console.log("data...", data);
    
        let totalMinutes = 0;
    
        data?.forEach((values: any) => {
            const minutes = values?.dataValues?.minutes || 0;
            const otMinutes = values?.dataValues?.ot_minutes || 0;
            
            totalMinutes += minutes + otMinutes;
    
            console.log("----------------------", typeof(minutes), typeof(otMinutes));
        });
    
        // Convert total minutes to hours and minutes
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
    
        console.log(`Total Hours: ${totalHours} hours and ${remainingMinutes} minutes`);
        return {
            status: 200,
            message: `Total Hours: ${totalHours} hours and ${remainingMinutes} minutes`,

        };
    }
    
    }
    
    module.exports = AttendanceModel;
    