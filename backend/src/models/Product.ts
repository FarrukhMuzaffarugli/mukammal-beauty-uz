import { Schema, model, Document, Types } from 'mongoose';
import { generateId } from '../utils/id';

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductSale {
  on: boolean;
  price: number;
  starts_at: Date | null;
  ends_at: Date | null;
}

export interface ProductDocument extends Document {
  _id: Types.ObjectId;
  product_id: string;
  sku: string;
  name: string;
  brand: string;
  category_id: string[];
  price: number;
  stock: number;
  status: ProductStatus;
  thumbnail: string;
  images: string[];
  description: string;
  sale: ProductSale;
  video_url: string | null;
  created_at: Date;
  updated_at: Date;
}

const SaleSchema = new Schema<ProductSale>(
  {
    on: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    starts_at: { type: Date, default: null },
    ends_at: { type: Date, default: null }
  },
  { _id: false }
);

const ProductSchema = new Schema<ProductDocument>(
  {
    product_id: { type: String, default: generateId, unique: true, index: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category_id: { type: [String], default: [], index: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
    thumbnail: { type: String, default: '' },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
    sale: { type: SaleSchema, default: () => ({}) },
    video_url: { type: String, default: null }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false }
);

ProductSchema.index({ name: 'text', brand: 'text', description: 'text' });

export const Product = model<ProductDocument>('Product', ProductSchema);
