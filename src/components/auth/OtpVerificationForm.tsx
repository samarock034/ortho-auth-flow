import React, { useState, useRef, useEffect } from 'react';
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
import { ArrowLeft, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

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

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Shield size={32} color="#4F8EF7" />
              </View>
              <Text style={styles.title}>Verify Code</Text>
              <Text style={styles.subtitle}>
                We sent a code to {formatContact(contact)}
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Enter Verification Code</Text>
              
              {/* OTP Input */}
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    textAlign="center"
                  />
                ))}
              </View>

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              {/* Resend Section */}
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the code?</Text>
                {canResend ? (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendLink}>Resend Code</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.timerText}>
                    Resend in {formatTime(resendTimer)}
                  </Text>
                )}
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                style={[styles.verifyButton, (isLoading || otp.join('').length !== 6) && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={isLoading || otp.join('').length !== 6}
              >
                <LinearGradient
                  colors={isLoading || otp.join('').length !== 6 ? ['#9CA3AF', '#9CA3AF'] : ['#4F8EF7', '#7DD3C0']}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Verify Code</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Demo Info */}
              <View style={styles.demoBox}>
                <Text style={styles.demoText}>
                  For demo purposes, use code: <Text style={styles.demoCode}>123456</Text>
                </Text>
              </View>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  resendLink: {
    fontSize: 14,
    color: '#4F8EF7',
    fontWeight: '500',
  },
  timerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  verifyButton: {
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
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
  demoBox: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  demoText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  demoCode: {
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});