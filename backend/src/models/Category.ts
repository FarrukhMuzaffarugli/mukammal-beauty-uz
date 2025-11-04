import { Schema, model, Document, Types } from 'mongoose';
import { generateId } from '../utils/id';

export interface CategoryDocument extends Document {
  _id: Types.ObjectId;
  category_id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  created_at: Date;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    category_id: { type: String, default: generateId, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parent_id: { type: String, default: null },
    icon: { type: String, default: null }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false }, versionKey: false }
);

export const Category = model<CategoryDocument>('Category', CategorySchema);
