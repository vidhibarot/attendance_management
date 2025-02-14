var router = (require('express')).Router()
const userController = new (require('../controller/user'))
console.log("route file maave chehe............")
import { Upload } from "../fileUpload/imageupload";
router.route("/add").post(Upload.array('images'),userController.addUser);

router.route("/verifyattendance").post(Upload.array('images'),userController.verifyUser);
// router.route("/verifyattendance").post(userController.verifyUser);


// router.route("/get").post(userController.getAttendance);

module.exports = router