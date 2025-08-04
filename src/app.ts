import express, { Application } from 'express';
import corsMiddleware from './middlewares/cors';
import userRoutes from './routes/user.routes';
import { setupSwagger } from './config/swagger';
import paymentRouter from './routes/payment.routes';
import transRouter from './routes/transaction.routes';
import fileRouter from './routes/file.routes';
import orderRouter from './routes/order.routes';
import authRouter from './routes/auth.routes';
import detailsRouter from './routes/auth.routes';
import productRouter from './routes/product.routes';
import basicRouter from './routes/basicDetails.routes';
import notificationRouter from './routes/notification.routes';
import path from 'path';

const app: Application = express();

// ✅ Apply correct body parsers — remove bodyParser
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// ✅ CORS middleware
app.use(corsMiddleware);

// ✅ Routes
app.use('/api', userRoutes, paymentRouter, transRouter, fileRouter, orderRouter, detailsRouter, productRouter, basicRouter, notificationRouter);
app.use('/auth', authRouter);
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// ✅ Swagger
setupSwagger(app);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('API is running');
});

// ✅ Catch-all 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
