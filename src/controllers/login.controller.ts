import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user/user.model';
import { generateOtp, sendOtp } from '../utils/otp.utils';

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user: any = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.emailVerified) {
      return res.status(401).json({ message: 'Email not verified' });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        status: user.status,
        emailVerified: user.emailVerified,
        userRole: user.userRole,
        isShopkeeper: user.isShopkeeper,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    return res.json({ message: 'Login successful', token, userRole: user.userRole, userId: user.userId });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Resend OTP
export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user: any = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({ otp, otpExpiry });
    await sendOtp(email, otp);

    return res.json({ userId: user.userId, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Forgot Password (Send OTP)
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user: any = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({ otp, otpExpiry });
    await sendOtp(email, otp);

    return res.json({ user: user.userId, email: user.email, message: 'OTP sent successfully. Check your email.' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user: any = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || new Date(user.otpExpiry) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await user.update({
      emailVerified: true,
      otp: null,
      otpExpiry: null,
    });

    return res.status(200).json({ email, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const user: any = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || new Date(user.otpExpiry) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({
      password: hashedPassword,
      otp: otp,
      otpExpiry: otpExpiry,
    });

    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
