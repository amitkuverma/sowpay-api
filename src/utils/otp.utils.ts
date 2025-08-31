import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generate a random 6-digit OTP
export const generateOtp = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send OTP via email
export const sendOtp = async (email: string, otp: string): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, // Use 587 if secure is false
            secure: true, // true for 465, false for 587
            auth: {
                user: 'sowpaymart@gmail.com', // Use environment variable for security!
                pass: 'vzrh romc ywov soir',               // Use environment variable for security!
                // user: 'amitmobile15@gmail.com', // Use environment variable for security!
                // pass: 'qlcb qwak gxgk jsre',               // Use environment variable for security!
            },
            connectionTimeout: 5000,
        });

        const mailOptions = {
            from: 'sowpaymart@gmail.com', // Better sender name format
            to: email,
           subject: 'One-Time Password (OTP) for Email Verification',

            text: `Dear User,

            We received a request to verify or update your email address. 
            Please use the One-Time Password (OTP) below to proceed:

            OTP: ${otp}

            This OTP is valid for the next 10 minutes. 
            If you did not request this, please ignore this message.

            Thank you,
            Sowpaymart Team`,

            html: `
              <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
                <h2 style="color:#2c3e50;">Email Verification Required</h2>
                <p>Dear User,</p>
                <p>We received a request to verify or update your email address. Please use the One-Time Password (OTP) below to proceed:</p>
                <p style="font-size: 18px; font-weight: bold; color: #2c3e50;">${otp}</p>
                <p>This OTP is valid for the next <b>10 minutes</b>.</p>
                <p>If you did not request this, you can safely ignore this message.</p>
                <br/>
                <p>Best regards,<br/>Sowpaymart Team</p>
              </div>
            `

        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        throw new Error('Failed to send OTP. Please try again.');
    }
};
