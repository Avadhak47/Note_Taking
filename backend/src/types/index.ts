import { Document } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  googleId?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INote extends Document {
  _id: string;
  title: string;
  content: string;
  userId: string;
  tags?: string[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface GoogleProfile {
  id: string;
  emails: Array<{ value: string; verified: boolean }>;
  name: {
    givenName: string;
    familyName: string;
  };
  photos: Array<{ value: string }>;
}
