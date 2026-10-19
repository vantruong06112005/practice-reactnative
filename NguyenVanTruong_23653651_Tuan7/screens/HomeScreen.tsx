
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import RatingStars from '../components/RatingStars';
import { reviewService } from '../services/reviewService';
import type { RootStackParamList } from '../navigation/types';

const API_URL = 'http://localhost:3000';

interface Book {
  id: string;
  title: string;
  author?: string;
}

type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<Navigation>();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [averages, setAverages] = useState<
    Record<string, { average: number; count: number }>
  >({});

  useEffect(() => {
    let active = true;

    const loadBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`);

        if (!response.ok) {
          throw new Error('Không thể tải danh sách sách');
        }

        const data = (await response.json()) as Book[];

        if (!active) return;

        setBooks(data);

        const results = await Promise.all(
          data.map(async (book) => {
            try {
              const reviews = await reviewService.getReviews(
                String(book.id)
              );

              const total = reviews.reduce(
                (sum, review) => sum + review.rating,
                0
              );

              return {
                id: String(book.id),
                average:
                  reviews.length > 0 ? total / reviews.length : 0,
                count: reviews.length,
              };
            } catch {
              return {
                id: String(book.id),
                average: 0,
                count: 0,
              };
            }
          })
        );

        if (!active) return;

        const next: Record<
          string,
          { average: number; count: number }
        > = {};

        results.forEach((item) => {
          next[item.id] = {
            average: item.average,
            count: item.count,
          };
        });

        setAverages(next);
      } catch (error: unknown) {
        Alert.alert(
          'Lỗi',
          error instanceof Error
            ? error.message
            : 'Không thể tải sách'
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadBooks();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch {
      Alert.alert('Lỗi', 'Không thể đăng xuất');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách sách</Text>

      <Text style={styles.greeting}>
        Xin chào {user?.name || user?.email || 'bạn'}!
      </Text>

      <View style={styles.logoutButton}>
        <Button
          title={loggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
          onPress={() => void handleLogout()}
          disabled={loggingOut}
          color="#DC2626"
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text>Chưa có sách trong JSON Server.</Text>
          }
          renderItem={({ item }) => {
            const summary = averages[String(item.id)];

            return (
              <TouchableOpacity
                style={styles.bookCard}
                onPress={() =>
                  navigation.navigate('BookDetail', {
                    bookId: String(item.id),
                    bookTitle: item.title,
                  })
                }
              >
                <Text style={styles.bookTitle}>{item.title}</Text>

                <Text style={styles.author}>
                  Tác giả: {item.author || 'Chưa cập nhật'}
                </Text>

                <View style={styles.ratingRow}>
                  <RatingStars
                    value={summary?.average ?? 0}
                    size={18}
                  />

                  <Text style={styles.ratingText}>
                    {(summary?.average ?? 0).toFixed(1)} (
                    {summary?.count ?? 0} đánh giá)
                  </Text>
                </View>

                <Text style={styles.detailLink}>
                  Xem chi tiết và đánh giá →
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  greeting: {
    color: '#64748B',
    marginTop: 8,
    marginBottom: 12,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  loader: {
    marginTop: 40,
  },
  list: {
    paddingBottom: 30,
  },
  bookCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  author: {
    color: '#64748B',
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  ratingText: {
    color: '#475569',
    marginLeft: 8,
  },
  detailLink: {
    color: '#2563EB',
    marginTop: 12,
    fontWeight: '600',
  },
});
