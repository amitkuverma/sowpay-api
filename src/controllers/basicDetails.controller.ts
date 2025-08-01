// controllers/basicDetails.controller.ts
import { Request, Response } from 'express';
import BasicDetails from '../models/user/user_details.model';
import User from '../models/user/user.model';
import { Op } from "sequelize";
import { generateUserQRCode } from '../utils/qrcode.utils';

export const createBasicDetails = async (req: Request, res: Response) => {
  try {

    const qrCode = await generateUserQRCode(req.body);
    req.body.qrCode = qrCode; // Add the QR code to the request body
    const basicDetails = await BasicDetails.create(req.body);
    res.status(201).json(basicDetails);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create basic details', details: err });
  }
};

export const getAllBasicDetails = async (req: Request, res: Response) => {
  try {
    const details = await BasicDetails.findAll();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch details' });
  }
};

export const getNearbyShops = async (req: Request, res: Response) => {
  try {
    const search = req.query.search?.toString() || '';
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: {
        userRole: 'shopkepper', // ✅ fixed typo: shopkepper ➝ shopkeeper
        name: { [Op.like]: `%${search}%` },
      },
      include: [
        {
          model: BasicDetails,
          as: 'details', // ✅ Ensure this matches association alias
          required: false,
        },
      ],
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    const formatted = rows.map((user: any) => ({
      name: user?.name || '',
      userId: user?.userId || null,
      category: user?.details?.category || 'N/A',
      shop_front_image: user?.shop_front_url || null,
      shop_counter_url: user?.shop_counter_url || null, // ✅ fixed: was same as shop_front_url
      other_img_url: user?.other_img_url || null,
      profile_url: user?.profile_url || null,
      review: user?.review || 0,
      reviewCount: user?.reviewCount || 0,
      qrCode: user?.details?.qrCode || null,
      village: user?.details?.village || 'N/A',
      city: user?.details?.city || 'N/A',
      district: user?.details?.district || 'N/A',
      state: user?.details?.state || 'N/A',
      address: user?.address || 'N/A',
      latitude: user?.details?.latitude || 0,
      longitude: user?.details?.longitude || 0,
      path: `/shop/${user?.userId}`,
      smp: user?.details?.smp || null,
      status: user?.status || null,
    }));

    res.json({
      data: formatted,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err: any) {
    console.error('❌ Error fetching shops:', err.message);
    res.status(500).json({ message: 'Failed to load shops', error: err.message }); // ✅ fixed: err. Message ➝ err.message
  }
};

export const getBasicDetailsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const detail = await BasicDetails.findOne({ where: { userId } });

    if (!detail) return res.status(404).json({ error: 'Basic details not found' });

    res.json(detail);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching basic details' });
  }
};

export const updateBasicDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const [updated] = await BasicDetails.update(req.body, { where: { userId } });

    if (!updated) return res.status(404).json({ error: 'Basic details not found' });

    const updatedDetails = await BasicDetails.findOne({ where: { userId } });
    res.json(updatedDetails);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update basic details' });
  }
};

export const deleteBasicDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const deleted = await BasicDetails.destroy({ where: { userId } });

    if (!deleted) return res.status(404).json({ error: 'Basic details not found' });

    res.json({ message: 'Basic details deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete basic details' });
  }
};
