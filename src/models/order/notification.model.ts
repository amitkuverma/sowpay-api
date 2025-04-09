import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface NotificationAttributes {
  id: number;
  userId: number;
  message: string;
  status: string;
  createdAt?: Date;
}

type NotificationCreationAttributes = Optional<NotificationAttributes, 'id'>;

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public message!: string;
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
