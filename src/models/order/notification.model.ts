import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface NotificationAttributes {
  id: number;
  userId: number;
  message: string;
  earnUserId: number;
  earnUserName: string;
  earnCoin: number;
  earnType: string;
  status: string;
  createdAt?: Date;
}

type NotificationCreationAttributes = Optional<NotificationAttributes, 'id'>;

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public message!: string;
  public earnUserId!: number;
  public earnUserName!: string;
  public earnCoin!: number;
  public earnType!: string;
  public status!: string;

  public readonly createdAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    earnUserId: {
      type: DataTypes.INTEGER,
    },
    earnUserName: {
      type: DataTypes.STRING,
    },
    earnCoin: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    earnType: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'sent',
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    updatedAt: false,
  }
);

export default Notification;
