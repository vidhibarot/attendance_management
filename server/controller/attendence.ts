const attendanceModel = new (require("../Model/attendance"));

class AttendanceController {
  // Method to add attendance
  async addAttendance(req: any, res: any) {
    console.log("Inside addAttendance.controllerrr..");
    try {
      // Make sure the model method is correct
      let data = await attendanceModel.addAttendance(req?.body);
      console.log("controller dddd",data)
      res.status(data.status).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  }
  async getAttendance(req: any, res: any) {
    console.log("Inside addAttendance.controllerrr..");
    try {
      let data = await attendanceModel.getAttendance(req?.body);
      console.log("controller dddd",data)
      res.status(data.status).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

module.exports = AttendanceController;
