// /app/components/ListItem.tsx

import React, { ReactElement } from 'react';
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONT_SIZE, SPACING } from '../app/constants/theme';

interface ListItemProps {
  leftIconName?: string;                    // например, 'directions-car'
  leftIconComponent?: ReactElement;          // если нужен <Image> вместо <MaterialIcons>
  title: string;                             // основной текст
  subtitle?: string;                         // дополнительный (если есть)
  onPress?: (event: GestureResponderEvent) => void;
  showChevron?: boolean;                     // по умолчанию true
  accessibilityHint?: string;
}

const ListItem: React.FC<ListItemProps> = ({
  leftIconName,
  leftIconComponent,
  title,
  subtitle = '',
  onPress = () => {},
  showChevron = true,
  accessibilityHint = '',
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
    >
      {leftIconComponent ? (
        <View style={styles.leftIconWrapper}>{leftIconComponent}</View>
      ) : (
        <MaterialIcons
          name={leftIconName || 'info'}
          size={24}
          color={COLORS.icon}
          style={styles.leftIconWrapper}
        />
      )}

      <View style={styles.textContainer}>
        {subtitle ? (
          <>
            <Text style={styles.secondaryText}>{title}</Text>
            <Text style={styles.primaryText}>{subtitle}</Text>
          </>
        ) : (
          <Text style={styles.primaryText}>{title}</Text>
        )}
      </View>

      {showChevron && <MaterialIcons name="chevron-right" size={24} color="#888" />}
    </TouchableOpacity>
  );
};

export default React.memo(ListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,                         // 16px
    paddingVertical: SPACING.sm * 1.3,                   // ~10px
    borderBottomWidth: 1,
    borderColor: COLORS.grayBorder,
  },
  leftIconWrapper: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
    marginLeft: SPACING.sm * 1.5,                        // 12px
  },
  primaryText: {
    fontSize: FONT_SIZE.body,                            // 16
    color: COLORS.black,
  },
  secondaryText: {
    fontSize: FONT_SIZE.small,                           // 14
    color: COLORS.grayText,
  },
});