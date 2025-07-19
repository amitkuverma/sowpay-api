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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: {
        userRole: 'shopkepper',
        name: { [Op.like]: `%${search}%` },
      },
      include: [
        {
          model: BasicDetails,
          as: 'details', // ✅ must match User.hasOne alias
          required: false, // use true if you only want users who have BasicDetails
        },
      ],
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    const formatted = rows.map((user: any) => ({
      name: user.name,
      userId: user.details?.userId || null,
      category: user.details?.category || 'N/A',
      image: user.details?.image || '/default.png',
      review: user.details?.review || 0,
      distance: user.details?.distance || 'N/A',
      qrCode: user.details?.qrCode || null,
      address: user.details?.address || 'N/A',
      latitude: user.details?.latitude || 0,
      longitude: user.details?.longitude || 0,
      path: `/shop/${user.userId}`,
    }));

    res.json({
      data: formatted,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err: any) {
    console.error('❌ Error fetching shops:', err.message);
    res.status(500).json({ message: 'Failed to load shops', error: err.message });
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
