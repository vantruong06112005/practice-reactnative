import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingStarsProps {
  value: number;
  size: number;
}

export default function RatingStars({
  value,
  size,
}: RatingStarsProps) {
  const safeValue = Math.max(0, Math.min(5, value));

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          style={{
            fontSize: size,
            color: star <= safeValue ? '#F59E0B' : '#CBD5E1',
            marginRight: 2,
          }}
        >
          {star <= safeValue ? '★' : '☆'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});