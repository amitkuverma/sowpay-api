import { Request, Response } from 'express';
import Product from '../../models/products/product.model';

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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch product', error });
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
