
import React from 'react';

import {
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from '../App';

type CartNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'Cart'
>;

export default function CartScreen() {
  const navigation = useNavigation<CartNavigation>();

  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);

  const handleCheckout = () => {
    if (!hydrated) {
      return;
    }

    if (!token) {
      navigation.navigate('Auth', {
        redirectTo: 'Checkout',
      });
      return;
    }

    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>

      <Text style={styles.description}>
        Kiểm tra sản phẩm trước khi thanh toán.
      </Text>

      <Button
        title="Thanh toán"
        onPress={handleCheckout}
        disabled={!hydrated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    color: '#475569',
  },
});
