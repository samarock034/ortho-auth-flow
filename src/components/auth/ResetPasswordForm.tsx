import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  
  const { control, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>();
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
    
    if (strength < 2) return { strength, text: 'Weak', color: '#EF4444' };
    if (strength < 4) return { strength, text: 'Medium', color: '#F59E0B' };
    return { strength, text: 'Strong', color: '#10B981' };
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
    <LinearGradient
      colors={['#4F8EF7', '#7DD3C0']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Lock size={32} color="#4F8EF7" />
              </View>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>Create a new secure password</Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>New Password</Text>
              
              {!isComplete ? (
                <>
                  {/* New Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={styles.inputWrapper}>
                      <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                      <Controller
                        control={control}
                        name="newPassword"
                        rules={{
                          required: 'New password is required',
                          minLength: { value: 8, message: 'Password must be at least 8 characters' },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: 'Password must contain uppercase, lowercase, and number'
                          }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            style={[styles.textInput, { paddingRight: 50 }]}
                            placeholder="Enter new password"
                            placeholderTextColor="#9CA3AF"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={!showNewPassword}
                          />
                        )}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff size={20} color="#6B7280" />
                        ) : (
                          <Eye size={20} color="#6B7280" />
                        )}
                      </TouchableOpacity>
                    </View>
                    
                    {/* Password strength indicator */}
                    {newPassword && (
                      <View style={styles.strengthContainer}>
                        <View style={styles.strengthHeader}>
                          <Text style={styles.strengthLabel}>Password strength:</Text>
                          <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                            {passwordStrength.text}
                          </Text>
                        </View>
                        <View style={styles.strengthBar}>
                          <View 
                            style={[
                              styles.strengthFill,
                              { 
                                width: `${(passwordStrength.strength / 5) * 100}%`,
                                backgroundColor: passwordStrength.color
                              }
                            ]}
                          />
                        </View>
                      </View>
                    )}
                    
                    {errors.newPassword && (
                      <Text style={styles.errorText}>{errors.newPassword.message}</Text>
                    )}
                  </View>

                  {/* Confirm Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <View style={styles.inputWrapper}>
                      <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                      <Controller
                        control={control}
                        name="confirmNewPassword"
                        rules={{
                          required: 'Please confirm your new password',
                          validate: value => value === newPassword || 'Passwords do not match'
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            style={[styles.textInput, { paddingRight: 50 }]}
                            placeholder="Confirm new password"
                            placeholderTextColor="#9CA3AF"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={!showConfirmPassword}
                          />
                        )}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} color="#6B7280" />
                        ) : (
                          <Eye size={20} color="#6B7280" />
                        )}
                      </TouchableOpacity>
                    </View>
                    {errors.confirmNewPassword && (
                      <Text style={styles.errorText}>{errors.confirmNewPassword.message}</Text>
                    )}
                  </View>

                  {/* Requirements Box */}
                  <View style={styles.requirementsBox}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    <View style={styles.requirementsList}>
                      <View style={styles.requirement}>
                        <View style={[
                          styles.requirementDot,
                          { backgroundColor: (newPassword?.length >= 8) ? '#10B981' : '#D1D5DB' }
                        ]} />
                        <Text style={styles.requirementText}>At least 8 characters</Text>
                      </View>
                      <View style={styles.requirement}>
                        <View style={[
                          styles.requirementDot,
                          { backgroundColor: /[A-Z]/.test(newPassword || '') ? '#10B981' : '#D1D5DB' }
                        ]} />
                        <Text style={styles.requirementText}>One uppercase letter</Text>
                      </View>
                      <View style={styles.requirement}>
                        <View style={[
                          styles.requirementDot,
                          { backgroundColor: /[a-z]/.test(newPassword || '') ? '#10B981' : '#D1D5DB' }
                        ]} />
                        <Text style={styles.requirementText}>One lowercase letter</Text>
                      </View>
                      <View style={styles.requirement}>
                        <View style={[
                          styles.requirementDot,
                          { backgroundColor: /\d/.test(newPassword || '') ? '#10B981' : '#D1D5DB' }
                        ]} />
                        <Text style={styles.requirementText}>One number</Text>
                      </View>
                    </View>
                  </View>

                  {/* Reset Button */}
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={['#4F8EF7', '#7DD3C0']}
                      style={styles.buttonGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text style={styles.buttonText}>Reset Password</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <View style={styles.successIcon}>
                    <CheckCircle size={32} color="#10B981" />
                  </View>
                  <Text style={styles.successTitle}>Password Reset Successfully!</Text>
                  <Text style={styles.successText}>
                    Your password has been updated. You can now sign in with your new password.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1F2937',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  strengthLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  strengthBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  requirementsBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  requirementsList: {
    gap: 4,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  requirementText: {
    fontSize: 12,
    color: '#374151',
  },
  resetButton: {
    marginBottom: 16,
  },
  buttonGradient: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});