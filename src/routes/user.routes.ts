import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: "Get all users."
 *     description: "Fetches a list of all users from the database."
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []  # Adds the Bearer token requirement
 *     responses:
 *       200:
 *         description: "List of users."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: "The user ID."
 *                   name:
 *                     type: string
 *                     description: "The user's name."
 *                   email:
 *                     type: string
 *                     description: "The user's email address."
 *                   isAdmin:
 *                     type: boolean
 *                     description: "Whether the user is an admin."
 *       401:
 *         description: "Unauthorized access."
 *       500:
 *         description: "Internal server error."
 */
router.get('/users', authenticateToken, UserController.getAllUsers);

/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
 *     description: Retrieve a user by their ID from the database.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user's ID.
 *                 name:
 *                   type: string
 *                   description: The user's name.
 *                 email:
 *                   type: string
 *                   description: The user's email.
 *                 mobile:
 *                   type: string
 *                   description: The user's mobile number.
 *                 status:
 *                   type: string
 *                   description: The user's status.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.get('/users/:userId', authenticateToken, UserController.getUserById);

/**
 * @openapi
 * /api/users/{userId}/status:
 *   put:
 *     summary: Update user status
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
 *     description: Update the status of a user by their ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the user.
 *     responses:
 *       200:
 *         description: User status updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user's ID.
 *                 status:
 *                   type: string
 *                   description: The updated status.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.put('/users/:userId/status', authenticateToken, UserController.updateUserStatus);

/**
 * @openapi
 * /api/users/{userId}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
 *     description: Update general user details by their ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the user.
 *               email:
 *                 type: string
 *                 description: The updated email of the user.
 *     responses:
 *       200:
 *         description: User details updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user's ID.
 *                 name:
 *                   type: string
 *                   description: The updated name of the user.
 *                 email:
 *                   type: string
 *                   description: The updated email of the user.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.put('/users/:userId', UserController.updateUser);

/**
 * @swagger
 * /api/delete/{userId}:
 *   delete:
 *     summary: Delete a user profile and their referrals
 *     description: Deletes the specified user and all referrals made by them.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User and their referrals successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User and referrals deleted successfully
 *       404:
 *         description: User or referrals not found
 *       500:
 *         description: Server error
 */

// API to get all the referrals made by a user
router.delete('/delete/:userId', authenticateToken, UserController.deleteUserProfile);

export default router;
