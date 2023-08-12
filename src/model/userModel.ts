import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import { TodoInstance } from './todoModel';

export interface UserAttributes {
  id: string;
  email: string;
  firstName: string;
  phoneNumber: string;
  password: string;
}

export class UserInstance extends Model<UserAttributes> {}

UserInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: 'user',
  }
);

UserInstance.hasMany(TodoInstance, { foreignKey: 'userId', as: 'todo' });
TodoInstance.belongsTo(UserInstance, { foreignKey: 'userId', as: 'user' });
