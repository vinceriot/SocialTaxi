import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface AboutCardProps {
  title: string;
  icon: any;
  onPress: () => void;
}

export const AboutCard = ({ title, icon, onPress }: AboutCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    width: '48%',
    marginRight: '4%',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});