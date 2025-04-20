import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByUserId,
  updateProduct,
  deleteProduct
} from '../controllers/orders/product.controller';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/products', getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/products/:id', getProductById);

/**
 * @swagger
 * /api/products/user/{userId}:
 *   get:
 *     summary: Get all products by user ID
 *     tags: [Products]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       404:
 *         description: No products found
 */
router.get('/products/user/:userId', getProductsByUserId);


/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discount:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/products', createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.put('/products/:id', updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/products/:id', deleteProduct);

export default router;
