import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize,DataTypes:any) => {
  class AttendanceMaster extends Model {
    id!: number;
    user_id!: number;
    date!: string;
    minutes!: number;
    ot_minutes!: number;
    createdAt!: Date;
    updatedAt!: Date;

    static associate(models: any) {
      AttendanceMaster.hasMany(models.Attendance, {
        foreignKey: 'master_id',
        onDelete: 'cascade',
      });
    }
  }

  AttendanceMaster.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20).UNSIGNED,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.BIGINT(20).UNSIGNED,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      minutes: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
        defaultValue: 0,
      },
      ot_minutes: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
        sequelize,
        modelName: 'AttendanceMaster',
        tableName: 'attendance_master',  
        freezeTableName: true, 

    }
  );

  return AttendanceMaster;
};
