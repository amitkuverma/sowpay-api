import sequelize from '../config/database';
import User from './user/user.model';
import Payment from './user/payment.model';
import AccountDetails from './user/account.model';
import Transaction from './user/transaction.model';
import Coin from './user/coin.model';

import Order from './order/order.model';
import OrderItem from './order/orderItem.model';
import Product from './products/product.model';
import Notification from './order/notification.model';

import defineAssociationsDynamically from '../associations';
import BasicDetails from './user/user_details.model';

const models = {
  User,
  Payment,
  AccountDetails,
  Transaction,
  BasicDetails,
  Coin,
  Order,
  OrderItem,
  Product,
  Notification,
};

const modelAssociations = {
  User: {
    hasMany: [
      { targetModel: 'Payment', foreignKey: 'userId', as: 'payments' },
      { targetModel: 'AccountDetails', foreignKey: 'userId', as: 'accountDetails' },
      { targetModel: 'Transaction', foreignKey: 'userId', as: 'transactions' },
      { targetModel: 'Order', foreignKey: 'userId', as: 'orders' },
      { targetModel: 'Notification', foreignKey: 'userId', as: 'notifications' },
    ],
  },

  Payment: {
    belongsTo: [{ targetModel: 'User', foreignKey: 'userId', as: 'paymentUser' }],
  },

  AccountDetails: {
    belongsTo: [{ targetModel: 'User', foreignKey: 'userId', as: 'accountUser' }],
  },

  Transaction: {
    belongsTo: [{ targetModel: 'User', foreignKey: 'userId', as: 'transactionUser' }],
  },

  BasicDetails: {
    belongsTo: [{ targetModel: 'User', foreignKey: 'userId', as: 'basicUser' }],
  },

  Order: {
    belongsTo: [{ targetModel: 'User', foreignKey: 'userId', as: 'user' }],
    hasMany: [{ targetModel: 'OrderItem', foreignKey: 'orderId', as: 'orderItems' }],
  },

  OrderItem: {
    belongsTo: [
      { targetModel: 'Order', foreignKey: 'orderId', as: 'order' },
      { targetModel: 'User', foreignKey: 'userId', as: 'user' },
      { targetModel: 'Product', foreignKey: 'productId', as: 'product' },
    ],
  },

  Product: {
    hasMany: [{ targetModel: 'OrderItem', foreignKey: 'productId', as: 'orderItems' }],
  },

  Notification: {
    belongsTo: [{ targetModel: 'User', foreignKey: 'userId', as: 'user' }],
  },

};

defineAssociationsDynamically(models, modelAssociations);

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

export { initDb, models };
