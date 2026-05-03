import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';

const BREAKPOINT = 768;
const BURGUNDY   = '#63202C';
const CREAM      = '#F5F0E8';
const BORDER     = '#C4B89A';
const MUTED      = '#9A8E7A';
const GOLD       = '#C6A75E';

const BANNER_IMAGE = { uri: 'https://picsum.photos/seed/ohlalaconcept/900/280' };

export default function Contacto() {
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

          {/* Tarjeta principal */}
          <View style={s.mainCard}>
            <View style={s.topRow}>

              <View style={s.leftCol}>
                <View style={s.brandRow}>
                  <View style={s.logoCircle} />
                  <Text style={s.brandName}>{'Estetica Alicia'}</Text>
                </View>
                <Text style={s.filosofia}>
                  {'Una filosofia basada en el detalle, la calma y la excelencia.'}
                </Text>
                {[
                  'Atencion 100% personalizada.',
                  'Productos seleccionados y protocolos premium.',
                  'Ambiente intimo y idoneo para tu bienestar.',
                ].map((item, idx) => (
                  <View key={idx} style={s.bulletRow}>
                    <Text style={s.bullet}>{'*'}</Text>
                    <Text style={s.bulletText}>{item}</Text>
                  </View>
                ))}
                <Text style={s.mision}>
                  {'Nuestra mision es elevar tu rutina de cuidado con experiencias elegantes, limpias y efectivas.'}
                </Text>
              </View>

              {isDesktop && (
                <View style={s.rightCol}>
                  <View style={s.imagePlaceholder} />
                </View>
              )}

            </View>

            <View style={s.btnRow}>
              <TouchableOpacity
                style={s.reservaBtn}
                onPress={() => router.push('/reserva')}
              >
                <Text style={s.reservaBtnText}>{'RESERVAR TU CITA'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Banner salon */}
          <View style={s.bannerCard}>
            <Image
              source={BANNER_IMAGE}
              style={s.bannerImage}
              resizeMode="cover"
            />
            <Text style={s.bannerCaption}>{'Tu imagen, en otras expertas'}</Text>
          </View>

        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen:           { flex: 1, backgroundColor: CREAM },
  scroll:           { flex: 1 },
  scrollContent:    { flexGrow: 1, paddingBottom: 0 },
  container:        { paddingHorizontal: 16, paddingTop: 20 },
  containerDesktop: { maxWidth: 860, alignSelf: 'center', paddingHorizontal: 24 },

  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 24,
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  leftCol:  { flex: 1, gap: 8 },
  rightCol: { width: 180 },
  imagePlaceholder: {
    flex: 1,
    minHeight: 160,
    backgroundColor: CREAM,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: BORDER,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GOLD,
  },
  brandName: { fontSize: 19, fontWeight: '700', color: '#2C2A22' },
  filosofia: { fontSize: 13, color: '#4A4035', lineHeight: 20 },
  bulletRow: { flexDirection: 'row', gap: 6 },
  bullet:    { fontSize: 13, color: '#555', lineHeight: 20 },
  bulletText:{ fontSize: 13, color: '#555', flex: 1, lineHeight: 20 },
  mision:    { fontSize: 12, color: MUTED, lineHeight: 18, marginTop: 4 },

  btnRow: {
    alignItems: 'flex-end',
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingTop: 16,
  },
  reservaBtn: {
    backgroundColor: BURGUNDY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  reservaBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  bannerCard: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 20,
  },
  bannerImage:   { width: '100%', height: 200 },
  bannerCaption: {
    textAlign: 'center',
    fontSize: 11,
    color: MUTED,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
  },
});