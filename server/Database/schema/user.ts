import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize,DataTypes:any) => {
  class User extends Model {
    id!: number;
    name!: string;
    images!: string;
    imagepoint!:number[]
    createdAt!: Date;
    updatedAt!: Date;

    static associate(models: any) {
    //   User.hasMany(models.Attendance, {
    //     foreignKey: 'master_id',
    //     onDelete: 'cascade',
    //   });
    }
  }

  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20).UNSIGNED,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      images: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      imagepoint: {
        type: DataTypes.JSON,  // using JSON to store the array
        // type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
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
        modelName: 'User',
        tableName: 'user',  
        freezeTableName: true, 

    }
  );

  return User;
};
