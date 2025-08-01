import { Router } from 'express';
import {
  createBasicDetails,
  getAllBasicDetails,
  getBasicDetailsByUserId,
  updateBasicDetails,
  deleteBasicDetails,
  getNearbyShops,
} from '../controllers/basicDetails.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: BasicDetails
 *   description: API for managing user's basic details
 */

/**
 * @swagger
 * /api/basic-details:
 *   post:
 *     summary: Create basic details
 *     tags: [BasicDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - village
 *               - city
 *               - district
 *               - state
 *               - shopname
 *               - category
 *               - gst_number
 *               - pincode
 *               - address
 *               - latitude
 *               - longitude
 *             properties:
 *               userId:
 *                 type: integer
 *               village:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               state:
 *                 type: string
 *               shopname:
 *                 type: string
 *               category:
 *                 type: string
 *               gst_number:
 *                 type: string
 *               pincode:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/basic-details', createBasicDetails);

/**
 * @swagger
 * /api/shops:
 *   get:
 *     summary: Get a paginated list of nearby shops
 *     tags:
 *       - Shops
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter shops by name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Items per page
 *     responses:
 *       200:
 *         description: A list of nearby shops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       category:
 *                         type: string
 *                       image:
 *                         type: string
 *                       review:
 *                         type: number
 *                       reviewCount:
 *                         type: number
 *                       distance:
 *                         type: string
 *                       path:
 *                         type: string
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.get("/shops", getNearbyShops); // ✅ use correct controller

/**
 * @swagger
 * /api/basic-details:
 *   get:
 *     summary: Get all basic details
 *     tags: [BasicDetails]
 *     responses:
 *       200:
 *         description: List of all basic details
 */
router.get('/basic-details', getAllBasicDetails);

/**
 * @swagger
 * /api/basic-details/{userId}:
 *   get:
 *     summary: Get basic details by user ID
 *     tags: [BasicDetails]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Basic details found
 *       404:
 *         description: Not found
 */
router.get('/basic-details/:userId', getBasicDetailsByUserId);

/**
 * @swagger
 * /api/basic-details/{userId}:
 *   put:
 *     summary: Update basic details by user ID
 *     tags: [BasicDetails]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               village:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               state:
 *                 type: string
 *               shopname:
 *                 type: string
 *               category:
 *                 type: string
 *               gst_number:
 *                 type: string
 *               pincode:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */
router.put('/basic-details/:userId', updateBasicDetails);

/**
 * @swagger
 * /api/basic-details/{userId}:
 *   delete:
 *     summary: Delete basic details by user ID
 *     tags: [BasicDetails]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/basic-details/:userId', deleteBasicDetails);

export default router;
