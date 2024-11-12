import { Request } from 'express';
import { Document } from 'mongoose';
import { User } from './playload';

export interface IUser extends Document {
  name: string;
  email: string | null;
  password: string | null;
  provider?: string;
  provider_id?: string;
  created_at: Date;
  updated_at: Date;
}



export interface AuthenticatedRequest extends Request {
  user?: {
    id?: string; // This must match the User interface
    // Include other properties if needed
  }; // Make sure this matches the User interface
}



