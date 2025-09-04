import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button, Input, Card, ErrorMessage } from '../../styles/GlobalStyles';
import { LoginFormData } from '../../types';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FormContainer = styled(Card)`
  max-width: 400px;
  margin: 2rem auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.875rem;
  font-weight: 700;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
`;

const StyledInput = styled(Input)`
  padding-left: 2.5rem;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const GoogleButton = styled(Button)`
  background-color: #4285f4;
  margin-bottom: 1rem;
  
  &:hover:not(:disabled) {
    background-color: #3367d6;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border};
  }
  
  span {
    padding: 0 1rem;
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.875rem;
  }
`;

const SignupLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      login(response.data.token, response.data.user);
      toast.success('Login successful!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.error('Google OAuth is not configured yet. Please use email/password login.');
  };

  return (
    <FormContainer>
      <Title>Welcome Back</Title>
      
      <GoogleButton type="button" onClick={handleGoogleLogin} fullWidth>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </GoogleButton>

      <Divider>
        <span>or</span>
      </Divider>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <InputWrapper>
            <InputIcon>
              <Mail size={18} />
            </InputIcon>
            <StyledInput
              id="email"
              type="email"
              placeholder="Enter your email"
              hasError={!!errors.email}
              {...register('email')}
            />
          </InputWrapper>
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <InputWrapper>
            <InputIcon>
              <Lock size={18} />
            </InputIcon>
            <StyledInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              hasError={!!errors.password}
              {...register('password')}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </PasswordToggle>
          </InputWrapper>
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </FormGroup>

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <SignupLink>
        Don't have an account?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>
          Sign up
        </a>
      </SignupLink>
    </FormContainer>
  );
};

export default LoginForm;
