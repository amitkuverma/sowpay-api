import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import jwksClient from 'jwks-rsa';

import User from '../models/user/user.model'; // Use this one consistently
import { generateOtp, sendOtp } from '../utils/otp.utils';
import { generateUserQRCode } from '../utils/qrcode.utils';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const appleClient = jwksClient({ jwksUri: 'https://appleid.apple.com/auth/keys' });

// === REGISTER ===
export const register = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    number,
    address,
    type,
    isShopkeeper,
    isAdmin
  } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      number,
      address,
      emailVerified: false,
      otp,
      otpExpiry,
      type,
      isShopkeeper,
      isAdmin
    });

    await sendOtp(email, otp);

    return res.status(201).json({
      message: 'Registration successful. Please verify your email via OTP.',
      userId: newUser.userId
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

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

// === GENERATE USER QR CODE ===
export const getUserQrCode = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;

  try {
    const qrCode = await generateUserQRCode({ name, email, phone });

    res.json({
      message: 'QR Code generated successfully',
      qrCode, // base64 image
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate QR Code' });
  }
};
