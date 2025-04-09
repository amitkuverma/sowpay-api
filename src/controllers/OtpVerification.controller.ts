import { Request, Response } from 'express';
import OtpService from '../services/otp.service';
import User from '../models/user/user.model';

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.update(
      { otp, emailVerified: false },
      { where: { userId } }
    );

    await OtpService.sendOtp(user.email, otp);

    return res.status(200).json({ message: 'OTP sent successfully to email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Server error sending OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;

    const user: any = await User.findOne({
      where: { userId, otp, verified: false }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.verified = true;
    user.emailVerified = true;
    await user.save();

    return res.status(200).json({ message: 'OTP verified, email confirmed' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Server error verifying OTP' });
  }
};
