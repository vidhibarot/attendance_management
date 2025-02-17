const userModel = new (require("../Model/user.ts"));

class UserController {
  async addUser(req: any, res: any) {
    console.log("Inside addAttendance.controllerrr..");
    try {
      // let data = await userModel.addUser(req?.body,req?.files);
      let data = await userModel.addUser(req?.body);

      console.log("controller dddd",data)
      res.status(data.status).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async verifyUser(req: any, res: any) {
    console.log("Inside addAttendance.controllerrr..");
    try {
      let data = await userModel.verifyUser(req?.files);
      console.log("controller dddd",data)
      res.status(data.status).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async detectUser(req: any, res: any) {
    try {
      // let data = await userModel.addUser(req?.body,req?.files);
      let data = await userModel.detectUser(req?.files);

      console.log("controller dddd",data)
      res.status(data.status).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

module.exports = UserController;
