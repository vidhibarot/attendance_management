import { Sequelize, DataTypes } from 'sequelize';
import AttendanceMaster from './attendance_master'; 
import Attendance from "./attendance"
import User from "./user"
require('dotenv').config();

const sequelize = new Sequelize("attandancemanagement", 'root', "", {
  host: 'localhost',
  dialect: 'mysql', 

});

const models = {
  AttendanceMaster: AttendanceMaster(sequelize, DataTypes),
  Attendance: Attendance(sequelize,DataTypes),
  User:User(sequelize,DataTypes),
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;
