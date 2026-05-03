import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';
import Button from '../components/Button';
import { detalleStyles as s } from './Detalle.styles';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
};

type RootStackParamList = {
  Home: undefined;
  DetalleProducto: { producto: Product };
};

type DetalleRouteProps = RouteProp<RootStackParamList, 'DetalleProducto'>;

const BREAKPOINT = 768;

// ─────────────────────────────────────────────
// DETALLE SCREEN
// ─────────────────────────────────────────────
export default function DetalleProducto() {
  const route = useRoute<DetalleRouteProps>();
  const navigation = useNavigation();
  const { producto } = route.params;
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;

  const PRODUCT_IMAGE = { uri: 'https://picsum.photos/seed/lipstick/500/500' };

  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.container, isDesktop && s.containerDesktop]}>

          {/* ── Botón volver (móvil) ── */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingVertical: 12, paddingHorizontal: 4 }}
          >
            <Text style={{ color: '#63202C', fontSize: 14, fontWeight: '600' }}>
              ← Volver
            </Text>
          </TouchableOpacity>

          {/* ── Título ── */}
          <Text style={s.pageTitle}>{producto.name}</Text>

          {/* ── Layout principal ── */}
          <View style={[s.mainLayout, isDesktop && s.mainLayoutDesktop]}>

            {/* Columna izquierda: imagen */}
            <View style={[s.leftCol, isDesktop && s.leftColDesktop]}>
              <Image
                source={PRODUCT_IMAGE}
                style={s.productImage}
                resizeMode="contain"
              />
            </View>

            {/* Columna derecha: info + botón */}
            <View style={[s.rightCol, isDesktop && s.rightColDesktop]}>
              <Text style={s.sectionLabel}>Descripción</Text>
              <Text style={s.bodyText}>{producto.description}</Text>

              <Text style={[s.sectionLabel, { marginTop: 20 }]}>Beneficios</Text>
              {['Hidratación profunda y confort inmediato.',
                'Luminosidad y suavidad desde la primera aplicación.',
                'Recomendado para rutinas premium.',
              ].map((item, idx) => (
                <View key={idx} style={s.bulletRow}>
                  <Text style={s.bullet}>•</Text>
                  <Text style={s.bulletText}>{item}</Text>
                </View>
              ))}

              <View style={s.productActions}>
                <Button label="RESERVAR PRODUCTO" variant="primary" />
                <View style={s.priceTag}>
                  <Text style={s.priceText}>{producto.price}€</Text>
                </View>
              </View>
            </View>

          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}