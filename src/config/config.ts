import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

type Env = 'development' | 'production';

// Helper function to get environment variables and throw an error if undefined
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

const config: Record<Env, {
  db: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: string;
  };
  corsOrigin: string;
  swaggerUrl: string;
}> = {
  development: {
    db: {
      username: 'gorkhacoin',
      password: 'Gorkhacoin*&5413',
      database: 'test_db',
      host: '88.222.212.197',
      dialect: 'mysql', 
    },
    corsOrigin: '*',
    swaggerUrl: 'http://localhost:8081/',
  },
  // development: {
  //   db: {
  //     username: 'root',
  //     password: '',
  //     database: 'sowpay_db',
  //     host: 'localhost',
  //     dialect: 'mysql', 
  //   },
  //   corsOrigin: '*',
  //   swaggerUrl: 'http://localhost:8081/',
  // },
  production: {
    db: {
      username: 'gorkhacoin',
      password: 'Gorkhacoin*&5413',
      database: 'test_db',
      host: '88.222.212.197',
      dialect: 'mysql', 
    },
    corsOrigin: '*',
    swaggerUrl: 'https://sowpay-api.onrender.com/',
  },
};


const currentEnv: Env = (process.env.NODE_ENV as Env) || 'production';
export default config[currentEnv];
