import { Schema, model, Document, Types } from 'mongoose';
import { generateId } from '../utils/id';

export type UserRole = 'user' | 'admin';

export interface Address {
  address_id: string;
  label: string;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  is_default: boolean;
}

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  user_id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  roles: UserRole[];
  addresses: Address[];
  wishlist: string[];
  created_at: Date;
  updated_at: Date;
  comparePassword?(password: string): Promise<boolean>;
}

const AddressSchema = new Schema<Address>(
  {
    address_id: { type: String, default: generateId },
    label: { type: String, required: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    street: { type: String, required: true },
    is_default: { type: Boolean, default: false }
  },
  { _id: false }
);

const UserSchema = new Schema<UserDocument>(
  {
    user_id: { type: String, default: generateId, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    roles: { type: [String], enum: ['user', 'admin'], default: ['user'] },
    addresses: { type: [AddressSchema], default: [] },
    wishlist: { type: [String], default: [] }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false }
);

UserSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model<UserDocument>('User', UserSchema);
