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
      <Image source={image} style={styles.image} resizeMode="contain" />
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.price}>{price}€</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      </View>
      <View style={styles.detalleButton}>
        <Text style={styles.detalleText}>DETALLE</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4C2AD',
    overflow: 'hidden',
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#F9F8F4',
  },
  content: {
    padding: 10,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
    marginRight: 6,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#63202C',
  },
  description: {
    fontSize: 11,
    color: '#888888',
    lineHeight: 16,
  },
  detalleButton: {
    backgroundColor: '#63202C',
    paddingVertical: 9,
    alignItems: 'center',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  detalleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

export default ProductCard;