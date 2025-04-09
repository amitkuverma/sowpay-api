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
                user: 'amitmobile15@gmail.com', // Use environment variable for security!
                pass: 'qlcb qwak gxgk jsre',               // Use environment variable for security!
            },
            connectionTimeout: 5000,
        });

        const mailOptions = {
            from: '"Amit Verma" <amitmobile15@gmail.com>', // Better sender name format
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
            html: `<p>Your OTP code is: <b>${otp}</b></p>`, // Optional: HTML format
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        throw new Error('Failed to send OTP. Please try again.');
    }
};
