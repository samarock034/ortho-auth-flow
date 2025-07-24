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
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  
  const { control, handleSubmit, getValues, formState: { errors } } = useForm<ForgotPasswordFormData>();

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
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <ArrowLeft size={20} color="white" />
              <Text style={styles.backButtonText}>Back to Sign In</Text>
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <View style={styles.logoInner} />
              </View>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>No worries, we'll help you reset it</Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Reset Password</Text>
              
              {!isSubmitted ? (
                <>
                  {/* Email/Phone Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email or Phone Number</Text>
                    <View style={styles.inputWrapper}>
                      <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                      <Controller
                        control={control}
                        name="emailOrPhone"
                        rules={{
                          required: 'Email or phone is required',
                          pattern: {
                            value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[\+]?[1-9][\d]{10,14})$/,
                            message: 'Enter a valid email or phone number'
                          }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            style={styles.textInput}
                            placeholder="Enter your email or phone"
                            placeholderTextColor="#9CA3AF"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                          />
                        )}
                      />
                    </View>
                    {errors.emailOrPhone && (
                      <Text style={styles.errorText}>{errors.emailOrPhone.message}</Text>
                    )}
                  </View>

                  {/* Info Box */}
                  <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                      We'll send you a verification code to reset your password. 
                      Make sure the contact information is correct.
                    </Text>
                  </View>

                  {/* Send Code Button */}
                  <TouchableOpacity
                    style={styles.sendButton}
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
                        <Text style={styles.buttonText}>Send Verification Code</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <View style={styles.successIcon}>
                    <CheckCircle size={32} color="#10B981" />
                  </View>
                  <Text style={styles.successTitle}>Code Sent!</Text>
                  <Text style={styles.successText}>
                    We've sent a verification code to
                  </Text>
                  <Text style={styles.contactText}>
                    {getValues('emailOrPhone')}
                  </Text>
                  <TouchableOpacity
                    style={styles.tryAgainButton}
                    onPress={handleTryAgain}
                  >
                    <Text style={styles.tryAgainText}>Send to Different Contact</Text>
                  </TouchableOpacity>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
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
  logoInner: {
    width: 32,
    height: 32,
    backgroundColor: '#4F8EF7',
    borderRadius: 16,
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
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  sendButton: {
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
    color: '#1F2937',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F8EF7',
    marginBottom: 24,
  },
  tryAgainButton: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tryAgainText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});