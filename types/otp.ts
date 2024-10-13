import { Document } from "mongoose";

export interface otp extends Document{
    user: String,
    OTP: string,
    createdAt?: Date
} 