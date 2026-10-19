
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from '../navigation/types';

type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  'Checkout'
>;

export default function CheckoutScreen() {
  const navigation = useNavigation<Navigation>();

  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (hydrated && !token) {
      navigation.replace('Auth', {
        redirectTo: 'Checkout',
      });
    }
  }, [hydrated, token, navigation]);

  if (!hydrated || !token) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Đang kiểm tra đăng nhập...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>
      <Text>Bạn đã đăng nhập và có thể tiếp tục.</Text>

      <Button
        title="Quay lại trang chủ"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});
