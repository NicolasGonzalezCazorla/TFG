import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';
import Button from '../components/Button';
import { detalleStyles as s } from './Detalle.styles';

const EXPERIENCIA = {
  title: 'Facial Glow',
  image: { uri: 'https://picsum.photos/seed/facial1/700/500' },
  caracteristicas: [
    'Diagnostico personalizado y ritual de limpieza.',
    'Activos premium para hidratacion y luminosidad.',
    'Masaje facial relajante y acabado satinado.',
  ],
};

const BREAKPOINT = 768;

export default function DetalleExperiencia() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const router    = useRouter();

  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.container, isDesktop && s.containerDesktop]}>

          <Text style={s.pageTitle}>{EXPERIENCIA.title}</Text>

          <View style={[s.mainLayout, isDesktop && s.mainLayoutDesktop]}>

            <View style={[s.leftCol, isDesktop && s.leftColDesktop]}>
              <Text style={s.sectionLabel}>{'Caracteristicas'}</Text>
              {EXPERIENCIA.caracteristicas.map((item, idx) => (
                <View key={idx} style={s.bulletRow}>
                  <Text style={s.bullet}>{'*'}</Text>
                  <Text style={s.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={[s.rightCol, isDesktop && s.rightColDesktop]}>
              <Image
                source={EXPERIENCIA.image}
                style={s.mainImage}
                resizeMode="cover"
              />
              <View style={s.buttonWrapper}>
                <Button
              label="RESERVA TU CITA"
              variant="primary"
              onPress={() => router.push('/reserva')}
            />
              </View>
            </View>

          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}