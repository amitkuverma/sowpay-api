import { Request, Response } from 'express';
import Product from '../../models/products/product.model';
import { Op } from 'sequelize';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create product', error });
  }
};

export const getAllProducts = async (_: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

export const getAllProductsThroughUserId = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search || "") as string;
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where: {
        userId: userId,
        productName: {
          [Op.like]: `%${search}%`,
        },
      },
      limit,
      offset,
    });

    res.json({
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      page,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

export const getProductsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const products = await Product.findAll({ where: { userId } });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this user' });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by userId:', error);
    return res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    return res.json({ message: 'Product updated', product });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    return res.json({ message: 'Product deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product', error });
  }
};
