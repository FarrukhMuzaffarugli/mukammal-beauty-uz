import { Schema, model, Document, Types } from 'mongoose';

interface CartItem {
  product_id: string;
  qty: number;
  price: number;
}

export interface CartDocument extends Document {
  _id: Types.ObjectId;
  user_id: string;
  items: CartItem[];
  total: number;
  updated_at: Date;
}

const CartItemSchema = new Schema<CartItem>(
  {
    product_id: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const CartSchema = new Schema<CartDocument>(
  {
    user_id: { type: String, required: true, unique: true, index: true },
    items: { type: [CartItemSchema], default: [] },
    total: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: false, updatedAt: 'updated_at' }, versionKey: false }
);

export const Cart = model<CartDocument>('Cart', CartSchema);
