import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import OTPVerification from './OTPVerification';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const AuthWrapper = styled.div`
  width: 100%;
  max-width: 500px;
`;

type AuthMode = 'login' | 'signup' | 'otp-verification';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [pendingEmail, setPendingEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // Handle Google OAuth callback
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('message');

    if (token) {
      // Extract user info from token (you might want to decode it or fetch profile)
      // For now, we'll fetch the profile with the token
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else if (error) {
      toast.error(error);
    }
  }, [location, login, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignupSuccess = (email: string) => {
    setPendingEmail(email);
    setMode('otp-verification');
  };

  const handleVerificationSuccess = () => {
    navigate('/dashboard');
  };

  const handleBackToSignup = () => {
    setMode('signup');
    setPendingEmail('');
  };

  const renderAuthComponent = () => {
    switch (mode) {
      case 'signup':
        return (
          <SignupForm
            onSignupSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        );
      case 'otp-verification':
        return (
          <OTPVerification
            email={pendingEmail}
            onVerificationSuccess={handleVerificationSuccess}
            onBack={handleBackToSignup}
          />
        );
      default:
        return (
          <LoginForm
            onSwitchToSignup={() => setMode('signup')}
          />
        );
    }
  };

  return (
    <Container>
      <AuthWrapper>
        {renderAuthComponent()}
      </AuthWrapper>
    </Container>
  );
};

export default AuthPage;
