// /app/components/DriverInfo.tsx

import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../app/constants/theme';

interface DriverInfoProps {
  /* avatarSource: ImageSourcePropType; */   // require('../assets/driver-avatar.png') или { uri: string }
  name: string;                        // «Тимофей»
  rating: string;                      // «5.00»
  carModel: string;                    // «Белый Vesta»
  /* carImageSource: ImageSourcePropType; */ // require('../assets/car-white-vesta.png')
  plateNumber: string;                 // «Р 434 СС»
  plateCode: string;                   // «159»
}

const DriverInfo: React.FC<DriverInfoProps> = ({
  /* avatarSource, */
  name,
  rating,
  carModel,
  /* carImageSource, */
  plateNumber,
  plateCode,
}) => {
  return (
    <View
      style={styles.root}
      accessibilityRole="summary"
      accessibilityLabel="Информация о водителе и машине"
    >
      {/* <Image
        source={avatarSource}
        style={styles.avatar}
        defaultSource={require('../assets/driver-avatar.png')}
        accessibilityRole="image"
        accessibilityLabel="Аватар водителя"
      /> */}

      <View style={styles.infoText}>
        <Text style={styles.name}>
          {name}{' '}
          <Text style={styles.rating}>
            ★ {rating}
          </Text>
        </Text>
        <Text style={styles.carModel}>{carModel}</Text>
      </View>

      <View style={styles.carBlock}>
        {/* <Image
          source={carImageSource}
          style={styles.carImage}
          resizeMode="contain"
          defaultSource={require('../assets/car-white-vesta.png')}
          accessibilityRole="image"
          accessibilityLabel="Изображение машины"
        /> */}
        <View style={styles.plateWrapper}>
          <Text style={styles.plateNumber}>{plateNumber}</Text>
          <View style={styles.plateCodeContainer}>
            <Text style={styles.plateCodeText}>{plateCode}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(DriverInfo);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,               // 16px
    marginBottom: SPACING.sm * 1.5,            // ~12px
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.grayLighter,
  },
  infoText: {
    marginLeft: SPACING.sm * 1.5,              // 12px
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.subheading,            // 18
    fontWeight: '600',
    color: COLORS.black,
  },
  rating: {
    fontSize: FONT_SIZE.subheading,            // 18
    fontWeight: '600',
    color: COLORS.star,                        // '#F5C518'
  },
  carModel: {
    fontSize: FONT_SIZE.small,                 // 14
    color: COLORS.grayText,
    marginTop: SPACING.xs,                     // 4px
  },
  carBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carImage: {
    width: 80,
    height: 50,
  },
  plateWrapper: {
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm * 1.3,       // ~10px
    paddingVertical: SPACING.xs * 1.7,         // ~6px
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.md,                    // 16px
  },
  plateNumber: {
    fontSize: FONT_SIZE.subheading,            // 18
    fontWeight: '600',
    color: COLORS.black,
  },
  plateCodeContainer: {
    backgroundColor: COLORS.grayLighter,
    borderRadius: 4,
    paddingHorizontal: SPACING.xs,             // 4px
    marginLeft: SPACING.sm / 2,                // 4px
  },
  plateCodeText: {
    fontSize: FONT_SIZE.tiny,                  // 12
    color: COLORS.black,
  },
});