// /app/components/ActionButton.tsx

import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONT_SIZE, SPACING } from '../app/constants/theme';

interface ActionButtonProps {
  iconName: string;
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  accessibilityHint?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  iconName,
  label,
  onPress,
  accessibilityHint = '',
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
    >
      <MaterialIcons name={iconName} size={20} color={COLORS.iconDark} />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(ActionButton);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.grayLighter,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm / 2, // 4 пикселя с каждой стороны
  },
  text: {
    marginLeft: SPACING.sm / 1.3, // примерно 6 пикселей
    fontSize: FONT_SIZE.small,      // 14
    color: COLORS.iconDark,
  },
});