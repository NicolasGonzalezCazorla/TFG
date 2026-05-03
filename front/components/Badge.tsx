import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

const Badge = ({ label, active = false, onPress }: BadgeProps) => {
  return (
    <TouchableOpacity
      style={[styles.badge, active && styles.badgeActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderColor: '#D4C2AD',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  badgeActive: {
    backgroundColor: '#63202C',
    borderColor: '#63202C',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#333333',
  },
  labelActive: {
    color: '#FFFFFF',
  },
});

export default Badge;
