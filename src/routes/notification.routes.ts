import express from 'express';
import NotificationController from '../controllers/notification.controller';

const notificationRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management APIs
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - message
 *             properties:
 *               userId:
 *                 type: integer
 *               message:
 *                 type: string
 *               earnUserId:
 *                 type: integer
 *               earnUserName:
 *                 type: string
 *               earnCoin:
 *                 type: number
 *               earnType:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               userId: 1
 *               message: "Referral reward"
 *               earnUserId: 2
 *               earnUserName: "John Doe"
 *               earnCoin: 100
 *               earnType: "referral"
 *               status: "sent"
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       500:
 *         description: Server error
 */
notificationRouter.post('/notifications', NotificationController.create);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications (optionally by userId)
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by userId
 *     responses:
 *       200:
 *         description: List of notifications
 *       500:
 *         description: Server error
 */
notificationRouter.get('/notifications', NotificationController.getAll);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get a single notification by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification data
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
notificationRouter.get('/notifications/:id', NotificationController.getById);

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     summary: Update a notification by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               earnUserId:
 *                 type: integer
 *               earnUserName:
 *                 type: string
 *               earnCoin:
 *                 type: number
 *               earnType:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               message: "Updated message"
 *               status: "read"
 *     responses:
 *       200:
 *         description: Notification updated
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
notificationRouter.put('/notifications/:id', NotificationController.update);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
notificationRouter.delete('/notifications/:id', NotificationController.delete);

export default notificationRouter;
