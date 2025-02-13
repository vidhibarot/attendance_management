var router = (require('express')).Router()
const attendanceController = new (require('../controller/attendence'))
console.log("route file maave chehe............")
router.route("/add").post(attendanceController.addAttendance);

router.route("/get").post(attendanceController.getAttendance);

module.exports = router