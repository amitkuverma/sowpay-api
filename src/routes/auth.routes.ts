import { Router } from 'express';
import { googleAuth, appleAuth, register, getUserQrCode } from '../controllers/auth.controller';
import { login, resendOtp, resetPassword } from '../controllers/login.controller';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user with optional referral code
 *     tags: [Authentication]
 *     description: Register a new user with email and password. Optionally, a referral code can be provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               referralCode:
 *                 type: string
 *                 description: Optional referral code
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields or invalid referral code
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Internal server error
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     description: Log in a user and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials.
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP for password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP resent successfully. Check your email.
 *       400:
 *         description: Missing email in request body.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
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
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "MySecurePassword123!"
 *     responses:
 *       200:
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successful.
 *       400:
 *         description: Invalid input or weak password.
 *       401:
 *         description: Invalid or expired OTP.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login/Register with Google
 *     tags: [Authentication]
 *     requestBody:
 *       description: Google ID token from frontend
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google ID token
 *                 example: eyJhbGciOiJSUzI1NiIsInR...
 *     responses:
 *       200:
 *         description: Successful login or registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid token
 *       401:
 *         description: Authentication failed
 */
router.post('/google', googleAuth);

/**
 * @swagger
 * /auth/apple:
 *   post:
 *     summary: Login/Register with Apple
 *     tags: [Authentication]
 *     requestBody:
 *       description: Apple ID token from frontend
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_token
 *             properties:
 *               id_token:
 *                 type: string
 *                 description: Apple ID token (JWT)
 *                 example: eyJraWQiOiJ...
 *     responses:
 *       200:
 *         description: Successful login or registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid token
 */
router.post('/apple', appleAuth);

/**
 * @swagger
 * /auth/qrcode:
 *   post:
 *     summary: Generate QR code for full user/shop info
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
 *               phone:
 *                 type: string
 *               userId:
 *                 type: integer
 *               village:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               state:
 *                 type: string
 *               shopname:
 *                 type: string
 *               category:
 *                 type: string
 *               gst_number:
 *                 type: string
 *               pincode:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCode:
 *                   type: string
 *                   format: uri
 *                   description: Base64-encoded QR image (Data URL)
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Server error while generating QR code
 */
router.post('/qrcode', getUserQrCode);

export default router;
