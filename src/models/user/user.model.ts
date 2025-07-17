import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class User extends Model {
  public userId!: number;
  public name!: string;
  public email!: string;
  public number!: string;
  public password!: string;
  public referredBy?: string;
  public referralCode?: string;
  public parentUserId?: number | null;
  public address?: string;
  public userRole?: string;
  public otp?: string;
  public otpExpiry?: Date;
  public emailVerified!: boolean;
  public status!: string;
  public profilePicture?: string;
  public provider!: string;
  public isShopkeeper!: boolean;
  public isAdmin!: boolean;
  public wallet!: number;
  public shop_front_url?: string;
  public shop_counter_url?: string;
  public other_img_url?: string;
  public qr_img_url?: string;
}

User.init({
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referredBy: DataTypes.STRING,
  parentUserId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'users',
      key: 'userId',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  referralCode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  address: DataTypes.STRING,
  userRole: DataTypes.STRING,
  otp: DataTypes.STRING,
  otpExpiry: DataTypes.DATE,
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'pending',
  },
  profilePicture: DataTypes.STRING,
  provider: DataTypes.STRING,
  isShopkeeper: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  wallet: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  shop_front_url: DataTypes.STRING,
  shop_counter_url: DataTypes.STRING,
  other_img_url: DataTypes.STRING,
  qr_img_url: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

export default User;
