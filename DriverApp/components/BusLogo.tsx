import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../lib/theme';

interface Props {
  size?: number; // overall container size
  iconSize?: number; // icon size
  variant?: 'darkOnLight' | 'lightOnDark';
  rounded?: boolean;
  accentColor?: string; // optional ring color
}

export const BusLogo: React.FC<Props> = ({
  size = 96,
  iconSize = 56,
  variant = 'darkOnLight',
  rounded = true,
  accentColor,
}) => {
  const bg = variant === 'darkOnLight' ? theme.colors.muted : theme.colors.navy;
  const fg = variant === 'darkOnLight' ? theme.colors.navy : theme.colors.navyTextOn;
  const ring = accentColor || theme.colors.sky;
  const innerSize = size - 10;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: rounded ? size / 2 : theme.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: rounded ? size / 2 : theme.radius.lg,
          backgroundColor: ring,
          opacity: 0.2,
        }}
      />
      <View
        style={{
          width: innerSize,
          height: innerSize,
          backgroundColor: bg,
          borderRadius: rounded ? innerSize / 2 : theme.radius.lg,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 2,
        }}
      >
        <Ionicons name="bus" size={iconSize} color={fg} />
      </View>
    </View>
  );
};

export default BusLogo;
