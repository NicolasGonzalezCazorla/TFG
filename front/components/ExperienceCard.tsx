import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';

interface ExperienceCardProps {
  image: ImageSourcePropType;
  title: string;
  description: string;
  isDesktop: boolean;
  onPress?: () => void;
}

const ExperienceCard = ({ image, title, description, isDesktop, onPress }: ExperienceCardProps) => {
  if (isDesktop) {
    return (
      <View style={styles.desktopCard}>
        <Image source={image} style={styles.desktopImage} resizeMode="cover" />
        <View style={styles.desktopContent}>
          <Text style={styles.desktopTitle}>{title}</Text>
          <Text style={styles.desktopDescription}>{description}</Text>
          <TouchableOpacity style={styles.verMasButton} onPress={onPress}>
            <Text style={styles.verMasText}>VER MÁS</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.mobileCard} onPress={onPress} activeOpacity={0.85}>
      <Image source={image} style={styles.mobileImage} resizeMode="cover" />
      <View style={styles.mobileContent}>
        <Text style={styles.mobileTitle}>{title}</Text>
        <Text style={styles.mobileDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Desktop
  desktopCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  desktopImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  desktopContent: {
    padding: 16,
    alignItems: 'center',
  },
  desktopTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  desktopDescription: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  verMasButton: {
    borderWidth: 1,
    borderColor: '#63202C',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  verMasText: {
    color: '#63202C',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
  },

  // Mobile
  mobileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  mobileImage: {
    width: 100,
    height: 90,
  },
  mobileContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  mobileTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  mobileDescription: {
    fontSize: 12,
    color: '#777777',
    lineHeight: 17,
  },
});

export default ExperienceCard;
