import { Sequelize, Model, DataTypes } from 'sequelize';

export default (sequelize: Sequelize, DataTypes:any) => {
    class Attendance extends Model {
        id!: number;
        master_id!: number;
        check_in!: Date | null;
        check_out!: Date | null;
        minutes!: number;
        ot_minutes!: number;
        status!: number;
        createdAt!: Date;
        updatedAt!: Date;
    
    static associate(models: any) {
      Attendance.belongsTo(models.AttendanceMaster, {
        foreignKey: 'master_id',
        onDelete: 'cascade',
      });
    }
  }

  Attendance.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20).UNSIGNED,
      },
      master_id: {
        allowNull: false,
        type: DataTypes.BIGINT(20).UNSIGNED,
        references: {
          model: 'attendance_master', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      check_in: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      check_out: {
        type: DataTypes.TIME,
        allowNull: true,
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
      status: {
        allowNull: false,
        type: DataTypes.TINYINT(1),
        defaultValue: 1,  // 0 => Inactive, 1 => Active
        comment: "0 => Inactive, 1 => Active",
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
      modelName: 'Attendance',
      tableName: 'attendance',  
      freezeTableName: true,   
    }
  );

  return Attendance;
};
