import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface ProductAttributes {
  id: number;
  userId: number;
  productName: string;
  description?: string;
  productImage?: string;
  inStock: boolean;
  discountPrize: number;
  productCategory: string;
  productUnit: number;
  productPrize: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ProductCreationAttributes = Optional<ProductAttributes, 'id'>;

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;  
  public userId!: number;
  public productName!: string;
  public description?: string;
  public productImage?: string;
  public inStock!: boolean;
  public discountPrize!: number;
  public productCategory!: string;
  public productUnit!: number;
  public productPrize!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
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
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    productImage: {
      type: DataTypes.TEXT('long'), // use 'long' for large base64 strings
      allowNull: true,
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    discountPrize: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    productCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productUnit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productPrize: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  }
);

export default Product;

