import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

interface SignUpFormData {
  name: string;
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface SignUpFormProps {
  onLogin: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>();
  const password = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Sign up data:', data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-auth-gradient-start to-auth-gradient-end p-4 flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        {/* Logo placeholder */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Join us today!</h1>
          <p className="text-white/80">Create your account to get started</p>
        </div>

        <Card className="border-0 shadow-xl bg-auth-surface backdrop-blur-sm">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-center">Sign Up</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                    {...register('name', { 
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                  />
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailOrPhone" className="text-sm font-medium">
                  Email or Phone
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

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="pl-10 pr-10 h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain uppercase, lowercase, and number'
                      }
                    })}
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10 p-0 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="acceptTerms"
                  className="mt-1"
                  {...register('acceptTerms', { 
                    required: 'You must accept the terms and conditions' 
                  })}
                />
                <div className="space-y-1">
                  <Label htmlFor="acceptTerms" className="text-sm leading-none cursor-pointer">
                    I agree to the{' '}
                    <Button variant="link" className="p-0 h-auto text-primary underline">
                      Terms & Conditions
                    </Button>{' '}
                    and{' '}
                    <Button variant="link" className="p-0 h-auto text-primary underline">
                      Privacy Policy
                    </Button>
                  </Label>
                  {errors.acceptTerms && (
                    <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-auth-gradient-end hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="text-center pt-2">
              <span className="text-sm text-muted-foreground">Already have an account? </span>
              <Button
                variant="link"
                className="p-0 h-auto text-primary hover:text-primary/80 font-medium"
                onClick={onLogin}
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};