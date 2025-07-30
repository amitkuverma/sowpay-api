import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByUserId,
  updateProduct,
  deleteProduct,
  getAllProductsThroughUserId
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
 * /api/products/filter:
 *   get:
 *     summary: Get products by userId with search and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user whose products are being fetched
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search term for product name
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
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Paginated list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *       400:
 *         description: Missing required userId
 *       500:
 *         description: Server error
 */
router.get('/products/filter', getAllProductsThroughUserId);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve a single product's details by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/product/:id", getProductById);

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
