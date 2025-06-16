// components/EmptyState.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  message: string;
};

export default function EmptyState({ message }: Props) {
  return (
    <View style={styles.container} accessible={true} accessibilityLabel={message}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});