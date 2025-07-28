import { Request, Response } from 'express';
import Notification from '../models/order/notification.model'; // ORM model for Notification


class NotificationController {
  // 🔵 Create Notification
  async create(req: Request, res: Response) {
    try {
      const notification = await Notification.create(req.body);
      return res.status(201).json({ success: true, data: notification });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server Error', error: err });
    }
  }

  // 🟢 Get All Notifications (with optional userId filter)
  async getAll(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      const where = userId ? { userId: Number(userId) } : {};
      const notifications = await Notification.findAll({ where });
      return res.status(200).json({ success: true, data: notifications });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server Error', error: err });
    }
  }

  // 🟡 Get Single Notification by ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notification = await Notification.findByPk(id);
      if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
      return res.status(200).json({ success: true, data: notification });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server Error', error: err });
    }
  }

  // 🟠 Update Notification
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const [updated] = await Notification.update(req.body, { where: { id } });
      if (!updated) return res.status(404).json({ success: false, message: 'Notification not found' });
      const updatedNotification = await Notification.findByPk(id);
      return res.status(200).json({ success: true, data: updatedNotification });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server Error', error: err });
    }
  }

  // 🔴 Delete Notification
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await Notification.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ success: false, message: 'Notification not found' });
      return res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server Error', error: err });
    }
  }
}

export default new NotificationController();
