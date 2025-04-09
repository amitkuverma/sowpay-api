// controllers/basicDetails.controller.ts
import { Request, Response } from 'express';
import BasicDetails from '../models/user/user_details.model';

export const createBasicDetails = async (req: Request, res: Response) => {
  try {
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
