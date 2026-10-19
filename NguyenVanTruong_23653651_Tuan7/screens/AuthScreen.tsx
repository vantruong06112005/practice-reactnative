
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import type {
  RouteProp,
} from '@react-navigation/native';

import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from '../navigation/types';

type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  'Auth'
>;

type AuthRoute = RouteProp<RootStackParamList, 'Auth'>;

type FormErrors = {
  email?: string;
  password?: string;
};

export default function AuthScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<AuthRoute>();

  const loginSuccess = useAuthStore(
    (state) => state.loginSuccess
  );

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      nextErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = 'Email không đúng định dạng';
    }

    if (!password) {
      nextErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      nextErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (loading || !validate()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const data = await authService.login(
          email.trim(),
          password
        );

        await loginSuccess(data.token, data.user);

        const redirectTo = route.params?.redirectTo;
        const bookId = route.params?.bookId;

        if (redirectTo === 'BookDetail' && bookId) {
          navigation.reset({
            index: 1,
            routes: [
              { name: 'Home' },
              {
                name: 'BookDetail',
                params: { bookId },
              },
            ],
          });
        } else if (redirectTo === 'Checkout') {
          navigation.reset({
            index: 1,
            routes: [
              { name: 'Home' },
              { name: 'Checkout' },
            ],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      } else {
        await authService.register(email.trim(), password);

        Alert.alert(
          'Thành công',
          'Đăng ký thành công. Vui lòng đăng nhập.'
        );

        setIsLogin(true);
        setPassword('');
      }
    } catch (error: unknown) {
      Alert.alert(
        'Thông báo',
        error instanceof Error ? error.message : 'Đã xảy ra lỗi'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, isLogin && styles.activeTab]}
            onPress={() => {
              setIsLogin(true);
              setErrors({});
            }}
          >
            <Text style={isLogin ? styles.activeText : styles.tabText}>
              Đăng nhập
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, !isLogin && styles.activeTab]}
            onPress={() => {
              setIsLogin(false);
              setErrors({});
            }}
          >
            <Text style={!isLogin ? styles.activeText : styles.tabText}>
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Nhập email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          secureTextEntry
        />
        {errors.password ? (
          <Text style={styles.error}>{errors.password}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={() => void handleSubmit()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
    marginBottom: 24,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 4,
    borderRadius: 10,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    color: '#475569',
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
