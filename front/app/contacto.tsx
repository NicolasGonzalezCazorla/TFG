import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
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

// --- IMÁGENES ---
// Logo local corregido según tu VS Code
const LOGO_ALICIA = require('../assets/images/Logo.png'); 

// Imagen de la recepción (Sustituye a la cara en la tarjeta derecha)
const RECEPCION_IMAGE = { uri: 'https://media.istockphoto.com/id/1396686399/es/foto/%C3%A1rea-de-recepci%C3%B3n-del-moderno-spa-con-mostrador-de-recepci%C3%B3n-plantas-en-macetas-objetos.jpg?b=1&s=170667a&w=0&k=20&c=xMkqJvM5Ho52Da_8kzz9gIQZTjqoVgMrtU-w_Ahk7Jo=' };

// Imagen del salón para el banner inferior
const BANNER_IMAGE = { uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop' };

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
                  <Image 
                    source={LOGO_ALICIA} 
                    style={s.logoImage} 
                    resizeMode="contain" 
                  />
                  <Text style={s.brandName}>{'Estética Alicia'}</Text>
                </View>
                
                <Text style={s.filosofia}>
                  {'Una filosofía basada en el detalle, la calma y la excelencia.'}
                </Text>

                {[
                  'Atención 100% personalizada.',
                  'Productos seleccionados y protocolos premium.',
                  'Ambiente íntimo e idóneo para tu bienestar.',
                ].map((item, idx) => (
                  <View key={idx} style={s.bulletRow}>
                    <Text style={s.bullet}>{'•'}</Text>
                    <Text style={s.bulletText}>{item}</Text>
                  </View>
                ))}
                
                <Text style={s.mision}>
                  {'Nuestra misión es elevar tu rutina de cuidado con experiencias elegantes, limpias y efectivas.'}
                </Text>
              </View>

              {isDesktop && (
                <View style={s.rightCol}>
                  <Image 
                    source={RECEPCION_IMAGE} 
                    style={s.sideImage} 
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>

            {/* Información de Contacto */}
            <View style={s.infoGrid}>
                <View style={s.infoItem}>
                    <Text style={s.infoLabel}>Contacto</Text>
                    <Text style={s.infoValue}>Tel: +34 698 63 39 18</Text>
                    <Text style={s.infoValue}>hola@esteticaalicia.com</Text>
                </View>
                <View style={s.infoItem}>
                    <Text style={s.infoLabel}>Horario</Text>
                    <Text style={s.infoValue}>L-V 09:30 - 20:30</Text>
                </View>
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

          {/* Banner visual del centro */}
          <View style={s.bannerCard}>
            <Image
              source={BANNER_IMAGE}
              style={s.bannerImage}
              resizeMode="cover"
            />
            <Text style={s.bannerCaption}>{'Tu bienestar en las mejores manos'}</Text>
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
  scrollContent:    { flexGrow: 1, justifyContent: 'space-between', paddingBottom: 40 },
  container:        { paddingHorizontal: 16, paddingTop: 20 },
  containerDesktop: { maxWidth: 860, alignSelf: 'center', paddingHorizontal: 24 },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 24,
    marginBottom: 20,
    elevation: 3,
  },
  topRow: { flexDirection: 'row', gap: 24, marginBottom: 10 },
  leftCol:  { flex: 1, gap: 8 },
  rightCol: { width: 240 },
  sideImage: { width: '100%', height: '100%', minHeight: 180, borderRadius: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  logoImage: { width: 50, height: 50 },
  brandName: { fontSize: 22, fontWeight: '700', color: '#2C2A22' },
  filosofia: { fontSize: 14, color: '#4A4035', lineHeight: 22, fontWeight: '500' },
  bulletRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  bullet:    { fontSize: 16, color: GOLD, fontWeight: '700' },
  bulletText:{ fontSize: 13, color: '#555', flex: 1, lineHeight: 20 },
  mision:    { fontSize: 12, color: MUTED, lineHeight: 18, marginTop: 10, fontStyle: 'italic' },
  infoGrid: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 20,
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
  },
  infoItem: { minWidth: 150 },
  infoLabel: { fontSize: 13, fontWeight: '700', color: GOLD, marginBottom: 4, textTransform: 'uppercase' },
  infoValue: { fontSize: 13, color: '#4A4035' },
  btnRow: { alignItems: 'flex-end', marginTop: 10 },
  reservaBtn: { backgroundColor: BURGUNDY, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 8 },
  reservaBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  bannerCard: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: BORDER, marginBottom: 20 },
  bannerImage:   { width: '100%', height: 280 },
  bannerCaption: { textAlign: 'center', fontSize: 12, fontWeight: '600', color: MUTED, paddingVertical: 10, backgroundColor: '#FFFFFF' },
});