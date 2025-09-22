import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../lib/theme';

interface Props {
  size?: number; // overall container size
  iconSize?: number; // icon size
  variant?: 'darkOnLight' | 'lightOnDark';
  rounded?: boolean;
}

export const BusLogo: React.FC<Props> = ({
  size = 96,
  iconSize = 56,
  variant = 'darkOnLight',
  rounded = true,
}) => {
  const bg = variant === 'darkOnLight' ? theme.colors.muted : theme.colors.navy;
  const fg = variant === 'darkOnLight' ? theme.colors.navy : theme.colors.navyTextOn;
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        borderRadius: rounded ? size / 2 : theme.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="bus" size={iconSize} color={fg} />
    </View>
  );
};

export default BusLogo;
