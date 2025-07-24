import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { OtpVerificationForm } from './OtpVerificationForm';
import { ResetPasswordForm } from './ResetPasswordForm';

export type AuthStep = 'login' | 'signup' | 'forgot-password' | 'otp-verification' | 'reset-password';

export const AuthFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [contactForOtp, setContactForOtp] = useState('');

  const handleStepChange = (step: AuthStep, contact?: string) => {
    setCurrentStep(step);
    if (contact) {
      setContactForOtp(contact);
    }
  };

  switch (currentStep) {
    case 'login':
      return (
        <LoginForm
          onForgotPassword={() => handleStepChange('forgot-password')}
          onSignUp={() => handleStepChange('signup')}
        />
      );
    
    case 'signup':
      return (
        <SignUpForm
          onLogin={() => handleStepChange('login')}
        />
      );
    
    case 'forgot-password':
      return (
        <ForgotPasswordForm
          onBack={() => handleStepChange('login')}
          onOtpSent={(contact) => handleStepChange('otp-verification', contact)}
        />
      );
    
    case 'otp-verification':
      return (
        <OtpVerificationForm
          contact={contactForOtp}
          onBack={() => handleStepChange('forgot-password')}
          onVerified={() => handleStepChange('reset-password')}
        />
      );
    
    case 'reset-password':
      return (
        <ResetPasswordForm
          onComplete={() => handleStepChange('login')}
        />
      );
    
    default:
      return (
        <LoginForm
          onForgotPassword={() => handleStepChange('forgot-password')}
          onSignUp={() => handleStepChange('signup')}
        />
      );
  }
};