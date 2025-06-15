import { Router } from 'express';
import {
  googleAuth,
  appleAuth,
  register,
  getUserQrCode
} from '../controllers/auth.controller';

import {
  forgotPassword,
  login,
  resendOtp,
  resetPassword,
  verifyOTP
} from '../controllers/login.controller';

import UserController from '../controllers/user.controller';
import {
  sendOtp,
  verifyOtp
} from '../controllers/OtpVerification.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication and authorization
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               number:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrMobile:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP for verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrMobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/resend-otp', resendOtp);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrMobile:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent to email
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /auth/reset-internal-password:
 *   post:
 *     summary: Reset password internally with token (admin/system use)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.post('/reset-internal-password', UserController.resetPassword);

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP to email or mobile
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contact:
 *                 type: string
 *                 description: Email or mobile number
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post('/send-otp', sendOtp);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contact:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post('/verify-otp', verifyOtp);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login or register using Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google auth successful
 */
router.post('/google', googleAuth);

/**
 * @swagger
 * /auth/apple:
 *   post:
 *     summary: Login or register using Apple
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Apple auth successful
 */
router.post('/apple', appleAuth);

/**
 * @swagger
 * /auth/qrcode:
 *   post:
 *     summary: Generate user QR code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: QR code generated successfully
 */
router.post('/qrcode', getUserQrCode);

export default router;
