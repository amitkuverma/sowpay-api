import QRCode from 'qrcode';

export const generateUserQRCode = async (userData: any): Promise<string> => {
  const dataString = `
Shop Name: ${userData.shopname}
Category: ${userData.category}
GST Number: ${userData.gst_number}
Address: ${userData.address}
Village: ${userData.village}
City: ${userData.city}
District: ${userData.district}
State: ${userData.state}
Pincode: ${userData.pincode}
Latitude: ${userData.latitude}
Longitude: ${userData.longitude}
`.trim();


  try {
    const qrCode = await QRCode.toDataURL(dataString);
    return qrCode; // base64 image string
  } catch (err) {
    throw new Error('QR code generation failed');
  }
};
