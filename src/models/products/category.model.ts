import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class Category extends Model {}

Category.init({
  categoryId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Category',
  tableName: 'categories',
  timestamps: true
});

export default Category;
