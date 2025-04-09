import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import User from './user.model'; // Ensure the import path is correct

interface BasicDetailsAttributes {
  id: number;
  userId: number;
  village: string;
  city: string;
  district: string;
  state: string;
  shopname: string;
  category: string;
  gst_number: string;
  pincode: string;
  address: string;
  latitude: string;
  longitude: string;
  qrCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type BasicDetailsCreationAttributes = Optional<BasicDetailsAttributes, 'id'>;

class BasicDetails extends Model<BasicDetailsAttributes, BasicDetailsCreationAttributes> implements BasicDetailsAttributes {
  public id!: number;
  public userId!: number;
  public village!: string;
  public city!: string;
  public district!: string;
  public state!: string;
  public shopname!: string;
  public category!: string;
  public gst_number!: string;
  public pincode!: string;
  public address!: string;
  public latitude!: string;
  public longitude!: string;
  public qrCode!: string; // Assuming you want to store the QR code as a string

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BasicDetails.init(
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
    village: DataTypes.STRING,
    city: DataTypes.STRING,
    district: DataTypes.STRING,
    state: DataTypes.STRING,
    shopname: DataTypes.STRING,
    category: DataTypes.STRING,
    gst_number: DataTypes.STRING,
    pincode: DataTypes.STRING,
    address: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    qrCode: DataTypes.TEXT,
  },
  {
    tableName: 'basic_details',
    sequelize,
  }
);

// Relation to Users table
BasicDetails.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(BasicDetails, { foreignKey: 'userId', as: 'basicDetails' });

export default BasicDetails;
