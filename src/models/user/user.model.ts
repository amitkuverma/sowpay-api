import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class User extends Model {
  public userId!: number;
  public name!: string;
  public email!: string;
  public number!: string;
  public password!: string;
  public referredBy!: string;
  public shop_front_url?: string;
  public shop_counter_url?: string;
  public other_img_url?: string;
  public address?: string;
  public type?: string;
  public parentUserId?: number | null; // Optional foreign key reference
  public otp?: string; // Optional OTP field
  public otpExpiry?: Date; // Optional OTP fieldx 
  public emailVerified!: boolean;
  public status!: string;
  public profilePicture?: string;
  public provider!: string;
  public isShopkeeper!: boolean;
  public isAdmin!: boolean;
}

User.init({
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referredBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  shop_front_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shop_counter_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  other_img_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qr_img_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentUserId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'users', // This should refer to the table name, not the model
      key: 'userId',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "pending" // Fixed typo here
  },  
  profilePicture: { 
    type: DataTypes.STRING 
  },
  provider: { 
    type: DataTypes.STRING 
  },
  isShopkeeper: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

export default User;
