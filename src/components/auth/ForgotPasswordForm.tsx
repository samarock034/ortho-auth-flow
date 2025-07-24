import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormData {
  emailOrPhone: string;
}

interface ForgotPasswordFormProps {
  onBack: () => void;
  onOtpSent: (contact: string) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, onOtpSent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Forgot password data:', data);
    setIsSubmitted(true);
    setIsLoading(false);
    
    // After showing success message, navigate to OTP verification
    setTimeout(() => {
      onOtpSent(data.emailOrPhone);
    }, 2000);
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
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
          Back to Sign In
        </Button>

        {/* Logo placeholder */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
          <p className="text-white/80">No worries, we'll help you reset it</p>
        </div>

        <Card className="border-0 shadow-xl bg-auth-surface backdrop-blur-sm">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-center">Reset Password</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrPhone" className="text-sm font-medium">
                    Email or Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="emailOrPhone"
                      type="text"
                      placeholder="Enter your email or phone"
                      className="pl-10 h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                      {...register('emailOrPhone', { 
                        required: 'Email or phone is required',
                        pattern: {
                          value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[\+]?[1-9][\d]{10,14})$/,
                          message: 'Enter a valid email or phone number'
                        }
                      })}
                    />
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  </div>
                  {errors.emailOrPhone && (
                    <p className="text-sm text-destructive">{errors.emailOrPhone.message}</p>
                  )}
                </div>

                <div className="bg-auth-accent-mint/20 p-4 rounded-xl border border-auth-accent-mint/30">
                  <p className="text-sm text-foreground/80">
                    We'll send you a verification code to reset your password. 
                    Make sure the contact information is correct.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-auth-gradient-end hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Code Sent!</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification code to
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {getValues('emailOrPhone')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleTryAgain}
                  className="w-full h-12 rounded-xl border-2"
                >
                  Send to Different Contact
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};