import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import User from '../models/user/user.model';
import bcrypt from 'bcrypt';
import { generateOtp, sendOtp } from '../utils/otp.utils';
import { generateUserQRCode } from '../utils/qrcode.utils';

export const register = async (req: Request, res: Response) => {
  const { email, password, referralCode } = req.body;

  try {
    // Validate inputs
    if ( !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Handle referral logic
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ where: { referralCode } });
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
      referredBy = referrer.userId;
    }

    // Generate email OTP
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user’s referral code (e.g. based on timestamp + random string)
    const myReferralCode = `REF${Date.now().toString().slice(-6)}`;

    // Save user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      emailVerified: false,
      referralCode: myReferralCode,
      referredBy,
      otp,
      otpExpiry,
    });

    // Send OTP via email
    await sendOtp(email, otp);

    return res.status(201).json({
      message: 'Registration successful. Please verify your email via OTP.',
      userId: newUser.userId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const appleClient = jwksClient({ jwksUri: 'https://appleid.apple.com/auth/keys' });

// === GOOGLE LOGIN ===
export const googleAuth = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    let user = await User.findOne({ where: { email: payload.email } });

    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        profilePicture: payload.picture,
        provider: 'google',
      });
    }

    res.status(200).json({ message: 'Google login successful', user });
  } catch (error) {
    res.status(401).json({ error: 'Google auth failed', details: error });
  }
};

// === APPLE LOGIN ===
function getAppleKey(header: any, callback: any) {
  appleClient.getSigningKey(header.kid, function (err, key: any) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const appleAuth = async (req: Request, res: Response) => {
  const { id_token } = req.body;

  jwt.verify(id_token, getAppleKey, async (err, decoded: any) => {
    if (err || !decoded?.email) {
      return res.status(400).json({ error: 'Invalid Apple token', details: err });
    }

    let user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      user = await User.create({
        email: decoded.email,
        name: decoded.name || 'Apple User',
        provider: 'apple',
      });
    }

    res.status(200).json({ message: 'Apple login successful', user });
  });
};

export const getUserQrCode = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;

  try {
    const qrCode = await generateUserQRCode({ name, email, phone });

    res.json({
      message: 'QR Code generated successfully',
      qrCode, // This will be a base64 image
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate QR Code' });
  }
};
