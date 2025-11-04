import { Schema, model, Document, Types } from 'mongoose';
import { generateId } from '../utils/id';

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type DeliveryStatus = 'preparing' | 'shipping' | 'delivered';

interface OrderItem {
  product_id: string;
  name: string;
  qty: number;
  price: number;
  thumbnail: string;
}

interface OrderAddress {
  address_id?: string;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  street: string;
}

export interface OrderDocument extends Document {
  _id: Types.ObjectId;
  order_id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  address: OrderAddress;
  coupon_code?: string;
  discount?: number;
  created_at: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product_id: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true }
  },
  { _id: false }
);

const OrderAddressSchema = new Schema<OrderAddress>(
  {
    address_id: { type: String },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    street: { type: String, required: true }
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDocument>(
  {
    order_id: { type: String, default: generateId, unique: true, index: true },
    user_id: { type: String, required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    total_amount: { type: Number, required: true },
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    delivery_status: {
      type: String,
      enum: ['preparing', 'shipping', 'delivered'],
      default: 'preparing'
    },
    address: { type: OrderAddressSchema, required: true },
    coupon_code: { type: String, default: null },
    discount: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false }, versionKey: false }
);

export const Order = model<OrderDocument>('Order', OrderSchema);
