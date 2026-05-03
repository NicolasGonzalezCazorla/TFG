import React, { useState } from 'react';
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

const CATEGORIAS = ['Todos', 'Facial', 'Corporal', 'Cabello', 'Bienestar'];

const SERVICIOS = [
  {
    id: '1',
    name: 'Facial Glow',
    category: 'Facial',
    duration: '60 min',
    price: '65',
    description: 'Luz, hidratacion y tontura activa. Ritual completo de limpieza y luminosidad.',
    image: { uri: 'https://picsum.photos/seed/facial1/400/300' },
  },
  {
    id: '2',
    name: 'Masaje Relajante',
    category: 'Corporal',
    duration: '75 min',
    price: '80',
    description: 'Descanso profundo con aceites esenciales premium. Libera tension muscular.',
    image: { uri: 'https://picsum.photos/seed/massage2/400/300' },
  },
  {
    id: '3',
    name: 'Ritual Imperial',
    category: 'Bienestar',
    duration: '90 min',
    price: '110',
    description: 'Equilibrio y vitalidad integral. Experiencia holistica completa.',
    image: { uri: 'https://picsum.photos/seed/ritual3/400/300' },
  },
  {
    id: '4',
    name: 'Hidratacion Profunda',
    category: 'Facial',
    duration: '45 min',
    price: '50',
    description: 'Tratamiento intensivo para pieles deshidratadas y apagadas.',
    image: { uri: 'https://picsum.photos/seed/hydration/400/300' },
  },
  {
    id: '5',
    name: 'Tratamiento Capilar',
    category: 'Cabello',
    duration: '60 min',
    price: '55',
    description: 'Nutricion y brillo para todo tipo de cabello. Activos premium.',
    image: { uri: 'https://picsum.photos/seed/hair/400/300' },
  },
  {
    id: '6',
    name: 'Exfoliacion Corporal',
    category: 'Corporal',
    duration: '50 min',
    price: '60',
    description: 'Elimina celulas muertas y deja la piel suave y renovada.',
    image: { uri: 'https://picsum.photos/seed/exfoliation/400/300' },
  },
  {
    id: '7',
    name: 'Masaje Piedras Calientes',
    category: 'Bienestar',
    duration: '80 min',
    price: '95',
    description: 'Terapia con piedras volcanicas para una relajacion profunda.',
    image: { uri: 'https://picsum.photos/seed/stones/400/300' },
  },
  {
    id: '8',
    name: 'Lifting Facial',
    category: 'Facial',
    duration: '70 min',
    price: '85',
    description: 'Tensor y reafirmante natural. Efecto lifting sin cirugia.',
    image: { uri: 'https://picsum.photos/seed/lifting/400/300' },
  },
  {
    id: '9',
    name: 'Keratina Express',
    category: 'Cabello',
    duration: '90 min',
    price: '75',
    description: 'Alisa y nutre el cabello con resultados visibles desde la primera sesion.',
    image: { uri: 'https://picsum.photos/seed/keratin/400/300' },
  },
];

export default function Servicio() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const router    = useRouter();

  const [categoria, setCategoria] = useState('Todos');
  const [orden,     setOrden]     = useState<'asc' | 'desc' | null>(null);

  const serviciosFiltrados = SERVICIOS
    .filter((s) => categoria === 'Todos' || s.category === categoria)
    .sort((a, b) => {
      if (orden === 'asc')  return Number(a.price) - Number(b.price);
      if (orden === 'desc') return Number(b.price) - Number(a.price);
      return 0;
    });

  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.container, isDesktop && s.containerDesktop]}>

          {/* ── Cabecera ── */}
          <View style={s.pageHeader}>
            <Text style={[s.pageTitle, { fontSize: isDesktop ? 28 : 22 }]}>
              {'Nuestros Servicios'}
            </Text>
            <Text style={s.pageSubtitle}>
              {'Rituales y tratamientos diseñados para tu bienestar'}
            </Text>
          </View>

          {/* ── Filtros ── */}
          <View style={[s.filtersCard, isDesktop && s.filtersCardDesktop]}>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.categoriasRow}
            >
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[s.catBtn, categoria === cat && s.catBtnActive]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text style={[s.catBtnText, categoria === cat && s.catBtnTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={s.ordenRow}>
              <Text style={s.ordenLabel}>{'Precio:'}</Text>
              <TouchableOpacity
                style={[s.ordenBtn, orden === 'asc' && s.ordenBtnActive]}
                onPress={() => setOrden(orden === 'asc' ? null : 'asc')}
              >
                <Text style={[s.ordenBtnText, orden === 'asc' && s.ordenBtnTextActive]}>
                  {'↑ Menor'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.ordenBtn, orden === 'desc' && s.ordenBtnActive]}
                onPress={() => setOrden(orden === 'desc' ? null : 'desc')}
              >
                <Text style={[s.ordenBtnText, orden === 'desc' && s.ordenBtnTextActive]}>
                  {'↓ Mayor'}
                </Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* ── Resultado ── */}
          <Text style={s.resultCount}>
            {serviciosFiltrados.length}{' servicios disponibles'}
          </Text>

          {/* ── Lista servicios ── */}
          {isDesktop ? (
            // Desktop: grid 3 columnas
            (() => {
              const rows: typeof SERVICIOS[] = [];
              for (let i = 0; i < serviciosFiltrados.length; i += 3) {
                rows.push(serviciosFiltrados.slice(i, i + 3));
              }
              return rows.map((row, rowIdx) => (
                <View key={rowIdx} style={s.desktopRow}>
                  {row.map((servicio) => (
                    <TouchableOpacity
                      key={servicio.id}
                      style={s.desktopCard}
                      onPress={() => router.push('/reserva')}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={servicio.image}
                        style={s.desktopCardImage}
                        resizeMode="cover"
                      />
                      <View style={s.desktopCardContent}>
                        <View style={s.cardTopRow}>
                          <Text style={s.cardCategory}>{servicio.category}</Text>
                          <Text style={s.cardDuration}>{'⏱ '}{servicio.duration}</Text>
                        </View>
                        <Text style={s.cardName}>{servicio.name}</Text>
                        <Text style={s.cardDesc} numberOfLines={2}>
                          {servicio.description}
                        </Text>
                        <View style={s.cardBottom}>
                          <Text style={s.cardPrice}>{servicio.price}{'€'}</Text>
                          <View style={s.reservarBtn}>
                            <Text style={s.reservarBtnText}>{'RESERVAR'}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {row.length < 3 &&
                    Array(3 - row.length).fill(null).map((_, i) => (
                      <View key={`empty-${i}`} style={[s.desktopCard, { opacity: 0 }]} />
                    ))}
                </View>
              ));
            })()
          ) : (
            // Móvil: lista vertical
            serviciosFiltrados.map((servicio) => (
              <TouchableOpacity
                key={servicio.id}
                style={s.mobileCard}
                onPress={() => router.push('/reserva')}
                activeOpacity={0.85}
              >
                <Image
                  source={servicio.image}
                  style={s.mobileCardImage}
                  resizeMode="cover"
                />
                <View style={s.mobileCardContent}>
                  <View style={s.cardTopRow}>
                    <Text style={s.cardCategory}>{servicio.category}</Text>
                    <Text style={s.cardDuration}>{'⏱ '}{servicio.duration}</Text>
                  </View>
                  <Text style={s.cardName}>{servicio.name}</Text>
                  <Text style={s.cardDesc} numberOfLines={2}>
                    {servicio.description}
                  </Text>
                  <View style={s.cardBottom}>
                    <Text style={s.cardPrice}>{servicio.price}{'€'}</Text>
                    <View style={s.reservarBtn}>
                      <Text style={s.reservarBtnText}>{'RESERVAR'}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}

        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen:           { flex: 1, backgroundColor: CREAM },
  scroll:           { flex: 1 },
  scrollContent:    { flexGrow: 1, paddingBottom: 40 },
  container:        { paddingHorizontal: 16, paddingTop: 20 },
  containerDesktop: { maxWidth: 1100, alignSelf: 'center', paddingHorizontal: 40 },

  pageHeader:   { marginBottom: 20 },
  pageTitle:    { fontWeight: '700', color: '#2C2A22', marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: MUTED },

  // ── Filtros ──
  filtersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  filtersCardDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  categoriasRow: { gap: 8, paddingVertical: 2 },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: BORDER,
    backgroundColor: '#FAFAF7',
  },
  catBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  catBtnText:       { fontSize: 12, color: '#555555' },
  catBtnTextActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },

  ordenRow:           { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ordenLabel:         { fontSize: 12, color: MUTED },
  ordenBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: BORDER,
    backgroundColor: '#FAFAF7',
  },
  ordenBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  ordenBtnText:       { fontSize: 12, color: '#555555' },
  ordenBtnTextActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },

  resultCount: { fontSize: 12, color: MUTED, marginBottom: 12 },

  // ── Desktop grid ──
  desktopRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  desktopCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  desktopCardImage:    { width: '100%', height: 160 },
  desktopCardContent:  { padding: 14, gap: 6 },

  // ── Mobile lista ──
  mobileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    marginBottom: 12,
  },
  mobileCardImage:   { width: '100%', height: 160 },
  mobileCardContent: { padding: 14, gap: 6 },

  // ── Shared card styles ──
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCategory: {
    fontSize: 11,
    color: GOLD,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDuration: { fontSize: 11, color: MUTED },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C2A22',
  },
  cardDesc: {
    fontSize: 12,
    color: '#777777',
    lineHeight: 17,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: BURGUNDY,
  },
  reservarBtn: {
    backgroundColor: BURGUNDY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  reservarBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});