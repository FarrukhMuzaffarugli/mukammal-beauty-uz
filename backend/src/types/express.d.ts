import type { UserDocument } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      userId?: string;
      roles?: string[];
    }
  }
}

export {};
