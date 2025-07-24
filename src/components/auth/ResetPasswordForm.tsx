import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

interface ResetPasswordFormData {
  newPassword: string;
  confirmNewPassword: string;
}

interface ResetPasswordFormProps {
  onComplete: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onComplete }) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>();
  const newPassword = watch('newPassword');

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    const checks = [
      /.{8,}/, // At least 8 characters
      /[a-z]/, // Lowercase
      /[A-Z]/, // Uppercase
      /\d/, // Number
      /[^a-zA-Z\d]/ // Special character
    ];
    
    checks.forEach(check => {
      if (check.test(password)) strength++;
    });
    
    if (strength < 2) return { strength, text: 'Weak', color: 'text-red-500' };
    if (strength < 4) return { strength, text: 'Medium', color: 'text-yellow-500' };
    return { strength, text: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword || '');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Reset password data:', data);
    setIsComplete(true);
    setIsLoading(false);
    
    // After showing success message, navigate back to login
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-auth-gradient-start to-auth-gradient-end p-4 flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        {/* Logo placeholder */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-white/80">Create a new secure password</p>
        </div>

        <Card className="border-0 shadow-xl bg-auth-surface backdrop-blur-sm">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-center">New Password</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isComplete ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="pl-10 pr-10 h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                      {...register('newPassword', { 
                        required: 'New password is required',
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
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Password strength indicator */}
                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Password strength:</span>
                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.strength < 2 ? 'bg-red-500' :
                            passwordStrength.strength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword" className="text-sm font-medium">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmNewPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      className="pl-10 pr-10 h-12 rounded-xl border-2 focus:border-primary transition-all duration-300"
                      {...register('confirmNewPassword', { 
                        required: 'Please confirm your new password',
                        validate: value => value === newPassword || 'Passwords do not match'
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
                  {errors.confirmNewPassword && (
                    <p className="text-sm text-destructive">{errors.confirmNewPassword.message}</p>
                  )}
                </div>

                <div className="bg-auth-accent-mint/20 p-4 rounded-xl border border-auth-accent-mint/30">
                  <h4 className="text-sm font-medium mb-2">Password Requirements:</h4>
                  <ul className="text-xs space-y-1 text-foreground/80">
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${newPassword?.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>At least 8 characters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(newPassword || '') ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>One uppercase letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(newPassword || '') ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>One lowercase letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${/\d/.test(newPassword || '') ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>One number</span>
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-auth-gradient-end hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-600">Password Reset Successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your password has been updated. You can now sign in with your new password.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};