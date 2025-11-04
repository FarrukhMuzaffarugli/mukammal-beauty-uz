import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { Product } from '../models/Product';
import { AppError } from '../utils/AppError';

const parseNumber = (value: unknown, defaultValue: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
};

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseNumber(req.query.page, 1);
  const limit = parseNumber(req.query.limit, 12);
  const skip = (page - 1) * limit;

  const search = (req.query.search as string) ?? '';
  const status = (req.query.status as string) ?? 'active';
  const category = (req.query.category as string) ?? '';
  const brand = (req.query.brand as string) ?? '';
  const onSale = req.query.sale === 'true';

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category_id = category.includes(',') ? { $in: category.split(',') } : category;
  }

  if (brand) {
    filter.brand = brand;
  }

  if (onSale) {
    filter['sale.on'] = true;
  }

  const sortOption = req.query.sort as string;
  let sort: Record<string, 1 | -1> = { created_at: -1 };
  if (sortOption === 'price_asc') {
    sort = { price: 1 };
  } else if (sortOption === 'price_desc') {
    sort = { price: -1 };
  } else if (sortOption === 'newest') {
    sort = { created_at: -1 };
  }

  const query = Product.find(filter).skip(skip).limit(limit).lean();

  if (search) {
    query.sort({ score: { $meta: 'textScore' } });
    query.select({ score: { $meta: 'textScore' } });
  } else {
    query.sort(sort);
  }

  const [items, total] = await Promise.all([query, Product.countDocuments(filter)]);

  res.json({
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id;
  const product = await Product.findOne({ product_id: productId }).lean();
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  res.json({ data: product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const existing = await Product.findOne({ sku: payload.sku });
  if (existing) {
    throw new AppError('SKU already exists', 409);
  }

  const product = await Product.create({
    ...payload,
    category_id: Array.isArray(payload.category_id)
      ? payload.category_id
      : payload.category_id
      ? [payload.category_id]
      : [],
    sale: {
      on: payload.sale?.on ?? false,
      price: payload.sale?.price ?? 0,
      starts_at: payload.sale?.starts_at ?? null,
      ends_at: payload.sale?.ends_at ?? null
    }
  });
  res.status(201).json({ data: product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id;

  const updates = { ...req.body };
  if (updates.category_id && !Array.isArray(updates.category_id)) {
    updates.category_id = [updates.category_id];
  }

  if (updates.sale) {
    updates.sale = {
      on: updates.sale.on ?? false,
      price: updates.sale.price ?? 0,
      starts_at: updates.sale.starts_at ?? null,
      ends_at: updates.sale.ends_at ?? null
    };
  }

  const product = await Product.findOneAndUpdate({ product_id: productId }, updates, {
    new: true
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({ data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id;
  const product = await Product.findOneAndDelete({ product_id: productId });
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  res.status(204).send();
});

export const relatedProducts = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id;
  const product = await Product.findOne({ product_id: productId });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const items = await Product.find({
    product_id: { $ne: productId },
    category_id: { $in: product.category_id },
    status: 'active'
  })
    .limit(8)
    .lean();

  res.json({ data: items });
});
