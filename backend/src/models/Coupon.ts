import { Schema, model, Document, Types } from 'mongoose';
import { generateId } from '../utils/id';

export type CouponType = 'percentage' | 'fixed';
export type CouponStatus = 'active' | 'inactive' | 'expired';

export interface CouponDocument extends Document {
  _id: Types.ObjectId;
  coupon_id: string;
  code: string;
  description: string;
  discount_type: CouponType;
  discount_value: number;
  min_order_amount: number;
  usage_limit: number;
  usage_count: number;
  starts_at: Date | null;
  ends_at: Date | null;
  status: CouponStatus;
  created_at: Date;
  updated_at: Date;
}

const CouponSchema = new Schema<CouponDocument>(
  {
    coupon_id: { type: String, default: generateId, unique: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, default: '' },
    discount_type: { type: String, enum: ['percentage', 'fixed'], required: true },
    discount_value: { type: Number, required: true },
    min_order_amount: { type: Number, default: 0 },
    usage_limit: { type: Number, default: 0 },
    usage_count: { type: Number, default: 0 },
    starts_at: { type: Date, default: null },
    ends_at: { type: Date, default: null },
    status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'inactive' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false }
);

export const Coupon = model<CouponDocument>('Coupon', CouponSchema);
