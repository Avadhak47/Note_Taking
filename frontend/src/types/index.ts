export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface OTPFormData {
  email: string;
  otp: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
}

export interface ApiError {
  error: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
