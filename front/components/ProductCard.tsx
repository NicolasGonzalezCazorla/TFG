import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';

interface ProductCardProps {
  image: ImageSourcePropType;
  name: string;
  price: string;
  description: string;
  onPress?: () => void;
}

const ProductCard = ({ image, name, price, description, onPress }: ProductCardProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.price}>{price}€</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      </View>
      <View style={styles.detalleButton}>
        <Text style={styles.detalleText}>{'DETALLE'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4C2AD',
    overflow: 'hidden',
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F9F8F4',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 10,
    gap: 4,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2C2A22',
    lineHeight: 17,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#63202C',
  },
  description: {
    fontSize: 11,
    color: '#888888',
    lineHeight: 15,
  },
  detalleButton: {
    backgroundColor: '#63202C',
    paddingVertical: 9,
    alignItems: 'center',
  },
  detalleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

export default ProductCard;