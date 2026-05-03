import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NavBar from '../../components/NavBar';
import Footer from '../../components/footer';
import Button from '../../components/Button';
import { detalleStyles as s } from '../Detalle.styles';

const BREAKPOINT = 768;

const CARACTERISTICAS = [
  'Diagnóstico personalizado y ritual de limpieza.',
  'Activos premium para hidratación y luminosidad.',
  'Masaje facial relajante y acabado satinado.',
];

export default function DetalleExperiencia() {
  const router = useRouter();
  const raw = useLocalSearchParams();

  const str = (v: string | string[] | undefined): string =>
    Array.isArray(v) ? v[0] : v ?? '';

  const title       = str(raw.title);
  const description = str(raw.description);
  const imageUri    = str(raw.image);

  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;

  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.container, isDesktop && s.containerDesktop]}>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingVertical: 12, paddingHorizontal: 4 }}
          >
            <Text style={{ color: '#63202C', fontSize: 14, fontWeight: '600' }}>
              ← Volver
            </Text>
          </TouchableOpacity>

          <Text style={s.pageTitle}>{title}</Text>

          <View style={[s.mainLayout, isDesktop && s.mainLayoutDesktop]}>

            <View style={[s.leftCol, isDesktop && s.leftColDesktop]}>
              <Text style={s.sectionLabel}>Descripción</Text>
              <Text style={s.bodyText}>{description}</Text>

              <Text style={[s.sectionLabel, { marginTop: 20 }]}>Características</Text>
              {CARACTERISTICAS.map((item, idx) => (
                <View key={idx} style={s.bulletRow}>
                  <Text style={s.bullet}>•</Text>
                  <Text style={s.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={[s.rightCol, isDesktop && s.rightColDesktop]}>
              <Image
                source={{ uri: imageUri }}
                style={s.mainImage}
                resizeMode="cover"
              />
              <View style={s.buttonWrapper}>
                <Button label="RESERVAR CITA"
  variant="primary"
  onPress={() => router.push('/reserva')} />
              </View>
            </View>

          </View>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}