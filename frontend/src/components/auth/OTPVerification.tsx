import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { Button, Card, ErrorMessage } from '../../styles/GlobalStyles';
import { OTPFormData } from '../../types';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FormContainer = styled(Card)`
  max-width: 400px;
  margin: 2rem auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.875rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const OTPContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const OTPInput = styled.input<{ hasError?: boolean }>`
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  border: 2px solid ${({ hasError, theme }) => hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  
  &:focus {
    border-color: ${({ hasError, theme }) => hasError ? theme.colors.error : theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ hasError, theme }) => hasError ? theme.colors.error + '20' : theme.colors.primary + '20'};
  }
`;

const ResendContainer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
`;

const ResendText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackButton = styled(Button)`
  margin-top: 1rem;
`;

const schema = yup.object().shape({
  otp: yup.string().matches(/^\d{6}$/, 'OTP must be 6 digits').required('OTP is required'),
});

interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email, 
  onVerificationSuccess, 
  onBack 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { login } = useAuth();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const {
    setValue,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<{ otp: string }>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    const otpString = newOtp.join('');
    setValue('otp', otpString);
    
    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Trigger validation
    if (otpString.length === 6) {
      trigger('otp');
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.verifyOTP({ email, otp: otpString });
      login(response.data.token, response.data.user);
      toast.success('Email verified successfully!');
      onVerificationSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'OTP verification failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    try {
      await authAPI.resendOTP(email);
      toast.success('OTP sent successfully!');
      setResendCooldown(60); // 60 second cooldown
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <FormContainer>
      <Title>Verify Your Email</Title>
      <Subtitle>
        We've sent a 6-digit verification code to <strong>{email}</strong>
      </Subtitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <OTPContainer>
          {otp.map((digit, index) => (
            <OTPInput
              key={index}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              hasError={!!errors.otp}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </OTPContainer>
        
        {errors.otp && <ErrorMessage style={{ textAlign: 'center' }}>{errors.otp.message}</ErrorMessage>}

        <Button type="submit" fullWidth disabled={isLoading || otp.join('').length !== 6}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <ResendContainer>
        <ResendText>Didn't receive the code?</ResendText>
        <ResendButton 
          type="button"
          onClick={handleResendOTP}
          disabled={resendCooldown > 0}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
        </ResendButton>
      </ResendContainer>

      <BackButton variant="ghost" fullWidth onClick={onBack}>
        Back to Signup
      </BackButton>
    </FormContainer>
  );
};

export default OTPVerification;
