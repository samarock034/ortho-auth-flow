import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';

interface OtpVerificationFormProps {
  contact: string;
  onBack: () => void;
  onVerified: () => void;
}

export const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ 
  contact, 
  onBack, 
  onVerified 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate validation (in real app, this would be server-side)
    if (otpCode === '123456') {
      onVerified();
    } else {
      setError('Invalid verification code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    
    setIsLoading(false);
  };

  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(60);
    setError('');
    
    // Simulate resend API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('OTP resent to:', contact);
    
    // Restart timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatContact = (contact: string) => {
    if (contact.includes('@')) {
      const [username, domain] = contact.split('@');
      return `${username.slice(0, 2)}***@${domain}`;
    } else {
      return `***${contact.slice(-4)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-auth-gradient-start to-auth-gradient-end p-4 flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white hover:bg-white/10 p-2 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>

        {/* Logo placeholder */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verify Code</h1>
          <p className="text-white/80">
            We sent a code to {formatContact(contact)}
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-auth-surface backdrop-blur-sm">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-center">Enter Verification Code</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-14 text-center text-lg font-semibold rounded-xl border-2 focus:border-primary transition-all duration-300"
                    placeholder="0"
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                {canResend ? (
                  <Button
                    variant="link"
                    onClick={handleResend}
                    className="p-0 h-auto text-primary hover:text-primary/80 font-medium"
                  >
                    Resend Code
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Resend in {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleVerify}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-auth-gradient-end hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isLoading || otp.join('').length !== 6}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Verify Code'
              )}
            </Button>

            <div className="bg-auth-accent-lavender/20 p-4 rounded-xl border border-auth-accent-lavender/30">
              <p className="text-xs text-center text-foreground/70">
                For demo purposes, use code: <span className="font-mono font-semibold">123456</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};