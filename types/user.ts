import { Document } from 'mongoose';
import { playload } from './playload';
import { Request } from 'express';

export interface IUser extends Document {
  name: string;
  email: string | null;
  password: string | null;
  provider?: string;
  provider_id?: string;
  created_at: Date;
  updated_at: Date;
}

// Define the extended Request type
export interface AuthenticatedRequest extends Request {
  user?: playload['user']; // Extend with the user property
}

