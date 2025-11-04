import { Schema, model, Document, Types } from 'mongoose';

export interface TokenDocument extends Document {
  _id: Types.ObjectId;
  user_id: string;
  token_id: string;
  token_hash: string;
  user_agent: string;
  created_at: Date;
  expires_at: Date;
}

const TokenSchema = new Schema<TokenDocument>(
  {
    user_id: { type: String, required: true, index: true },
    token_id: { type: String, required: true, unique: true },
    token_hash: { type: String, required: true },
    user_agent: { type: String, default: '' },
    expires_at: { type: Date, required: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false }, versionKey: false }
);

TokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const Token = model<TokenDocument>('Token', TokenSchema);
