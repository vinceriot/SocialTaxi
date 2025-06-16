// /app/components/SectionSeparator.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '../app/constants/theme';

const SectionSeparator: React.FC = () => <View style={styles.separator} />;

export default React.memo(SectionSeparator);

const styles = StyleSheet.create({
  separator: {
    height: SPACING.sm * 2,   // 16px → 8px (SPACING.sm = 8, умножаем на 2 для наглядности)
    backgroundColor: COLORS.grayLight, // '#F5F5F5'
    width: '100%',
  },
});