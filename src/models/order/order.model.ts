import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import User from '../user/user.model'; // Assuming you have a User model

interface OrderAttributes {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type OrderCreationAttributes = Optional<OrderAttributes, 'id'>;

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
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
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'placed',
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  }
);

export default Order;
