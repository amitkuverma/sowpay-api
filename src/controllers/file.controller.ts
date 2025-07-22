import { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import User from '../models/user/user.model';
import Transaction from '../models/user/transaction.model';
import paymentService from '../services/payment.service';

const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath); // Specify the destination folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the original file name
    }
});

const upload = multer({ storage }).single('file'); // Ensure you specify 'file' as the field name

// Upload file controller
const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { id, type, columnName } = req.body;

    if (!id || !type || !columnName) {
        return res.status(400).json({ message: 'User ID, type, and column name are required.' });
    }

    try {
        let record;

        // Find the corresponding record based on type
        switch (type) {
            case 'user':
                record = await User.findByPk(id);
                break;
            case 'payment':
                record = await paymentService.findPaymentByUserId(id);
                break;
            case 'transaction':
                record = await Transaction.findByPk(id);
                break;
            default:
                return res.status(400).json({ message: 'Invalid type provided.' });
        }

        if (!record) {
            return res.status(404).json({ message: `${type} record not found.` });
        }

        // Update the dynamic column with the file path
        const filePath = req.file.path.replace(/^.*[\\\/]uploads[\\\/]/, 'uploads/');

        // Dynamically assign file details to the given column
        (record as any)[columnName] = filePath;


        // Optionally update additional metadata if needed
        if ('docname' in record && type === 'document') {
            record['docname'] = req.file.originalname;
        } else if ('filename' in record && type === 'profile') {
            record['filename'] = req.file.originalname;
            record['mimetype'] = req.file.mimetype;
        }

        await record.save();

        return res.status(200).json({
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} file updated successfully.`,
            file: record,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error updating file details in the database.', error });
    }
};


export { upload, uploadFile };
