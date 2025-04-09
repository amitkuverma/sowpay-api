import { Request, Response } from 'express';

export const createOrder = async (req: Request, res: Response) => {
  const { userId, items, totalAmount } = req.body;

  // Simulate DB logic
  const newOrder = {
    id: Math.floor(Math.random() * 10000),
    userId,
    items,
    totalAmount,
    status: 'placed',
    createdAt: new Date()
  };

  res.status(201).json({ message: 'Order placed', order: newOrder });
};

export const getAllOrders = async (_: Request, res: Response) => {
  // Dummy response
  res.status(200).json([{ id: 1, userId: 10, status: 'placed' }]);
};

export const getOrderById = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  if (!orderId) return res.status(400).json({ error: 'Invalid order ID' });

  // Simulate lookup
  res.status(200).json({ id: orderId, userId: 10, status: 'placed' });
};

export const notifyUser = async (req: Request, res: Response) => {
  const { userId, message } = req.body;

  // Simulate notification send (email, SMS, push)
  res.status(200).json({
    success: true,
    message: `Notification sent to user ${userId}`,
    content: message
  });
};
