import QRCode from 'qrcode';

export const generateUserQRCode = async (userData: {
  name: string;
  email: string;
  phone: string;
}): Promise<string> => {
  const dataString = `Name: ${userData.name}\nEmail: ${userData.email}\nPhone: ${userData.phone}`;

  try {
    const qrCode = await QRCode.toDataURL(dataString);
    return qrCode; // base64 image string
  } catch (err) {
    throw new Error('QR code generation failed');
  }
};
