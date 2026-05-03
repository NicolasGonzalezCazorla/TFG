import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionHeader = ({ title, subtitle, align = 'center' }: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { textAlign: align }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333333',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#777777',
    lineHeight: 19,
  },
});

export default SectionHeader;
