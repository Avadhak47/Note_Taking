import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/index.js';

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: undefined,
  },
  otpExpires: {
    type: Date,
    default: undefined,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  profilePicture: {
    type: String,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Add comparePassword to the interface
declare module 'mongoose' {
  interface Document {
    comparePassword?(candidatePassword: string): Promise<boolean>;
  }
}

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.otp;
  delete userObject.otpExpires;
  return userObject;
};

export default mongoose.model<IUser>('User', userSchema);
