import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const Button = ({ label, onPress, variant = 'primary', fullWidth = false, style }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.baseText, styles[`${variant}Text`]]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 5,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },

  // Variants
  primary: {
    backgroundColor: '#63202C',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#63202C',
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Text variants
  baseText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#63202C',
  },
  ghostText: {
    color: '#63202C',
  },
});

export default Button;
