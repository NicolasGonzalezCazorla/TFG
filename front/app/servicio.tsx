import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Pagination from '../components/Pagination';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';
import { API_URL } from '../constants';

const BREAKPOINT = 768;
const BURGUNDY   = '#63202C';
const CREAM      = '#F5F0E8';
const BORDER     = '#C4B89A';
const MUTED      = '#9A8E7A';
const GOLD       = '#C6A75E';

const CATEGORIAS = ['Todos', 'Facial', 'Corporal', 'Cabello', 'Bienestar'];

const IMAGENES_SERVICIOS: Record<string, string> = {
  // FACIALES
  'facial-glow': 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=500&auto=format&fit=crop',
  'hidratacion-profunda': 'https://images.unsplash.com/photo-1596755389378-7fd0c1c58731?q=80&w=500&auto=format&fit=crop',
  
  // CORPORALES
  'masaje-relajante': 'https://images.unsplash.com/photo-1544161515-4af6b1d462c2?q=80&w=500&auto=format&fit=crop',
  'exfoliacion-corporal': 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop',
  
  // CAPILAR
  'tratamiento-capilar': 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=500&auto=format&fit=crop',
  
  // BIENESTAR
  'ritual-imperial': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=500&auto=format&fit=crop',
};

// Imagen de respaldo por categoría si el servicio no tiene una específica
const IMAGENES_CATEGORIA: Record<string, string> = {
  'Facial': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500&auto=format&fit=crop',
  'Corporal': 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=500&auto=format&fit=crop',
  'Cabello': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=500&auto=format&fit=crop',
  'Bienestar': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=500&auto=format&fit=crop',
};

const getImage = (categoria: string, servicioId?: string) => {
  if (servicioId && IMAGENES_SERVICIOS[servicioId]) {
    return { uri: IMAGENES_SERVICIOS[servicioId] };
  }
  return { uri: IMAGENES_CATEGORIA[categoria] ?? 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=500&auto=format&fit=crop' };
};

type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  categoria: string;
};

export default function Servicio() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const router    = useRouter();

  const [servicios,  setServicios]  = useState<Servicio[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [categoria,  setCategoria]  = useState('Todos');
  const [orden,      setOrden]      = useState<'asc' | 'desc' | null>(null);
  const [page,       setPage]       = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    fetch(`${API_URL}/servicios`)
      .then(res => res.json())
      .then(data => { if (data.servicios) setServicios(data.servicios); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [categoria, orden]);

  const serviciosFiltrados = servicios
    .filter((s) => categoria === 'Todos' || s.categoria === categoria)
    .sort((a, b) => {
      if (orden === 'asc')  return a.precio - b.precio;
      if (orden === 'desc') return b.precio - a.precio;
      return 0;
    });

  const totalServicios = serviciosFiltrados.length;
  const pageItems = serviciosFiltrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const renderCard = (servicio: Servicio, style: any, contentStyle: any) => (
    <TouchableOpacity
      key={servicio.id}
      style={style}
      onPress={() => router.push({
        pathname: '/experiencia/[id]',
        params: {
          id:          servicio.id,
          title:       servicio.nombre,
          description: servicio.descripcion,
          image:       getImage(servicio.categoria).uri,
        },
      })}
      activeOpacity={0.85}
    >
      <Image
        source={getImage(servicio.categoria)}
        style={s.cardImage}
        resizeMode="cover"
      />
      <View style={contentStyle}>
        <View style={s.cardTopRow}>
          <Text style={s.cardCategory}>{servicio.categoria}</Text>
          <Text style={s.cardDuration}>{'⏱ '}{servicio.duracion}{' min'}</Text>
        </View>
        <Text style={s.cardName}>{servicio.nombre}</Text>
        <Text style={s.cardDesc} numberOfLines={2}>{servicio.descripcion}</Text>
        <View style={s.cardBottom}>
          <Text style={s.cardPrice}>{servicio.precio}{'€'}</Text>
          <View style={s.detalleBtn}>
            <Text style={s.detalleBtnText}>{'DETALLE'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.container, isDesktop && s.containerDesktop]}>

          <View style={s.pageHeader}>
            <Text style={[s.pageTitle, { fontSize: isDesktop ? 28 : 22 }]}>
              {'Nuestros Servicios'}
            </Text>
            <Text style={s.pageSubtitle}>
              {'Rituales y tratamientos diseñados para tu bienestar'}
            </Text>
          </View>

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

          {!loading && (
            <Text style={s.resultCount}>
              {serviciosFiltrados.length}{' servicios disponibles'}
            </Text>
          )}

          {loading ? (
            <ActivityIndicator color={BURGUNDY} style={{ marginTop: 40 }} />
          ) : isDesktop ? (
            (() => {
              const rows: Servicio[][] = [];
              for (let i = 0; i < pageItems.length; i += 3) {
                rows.push(pageItems.slice(i, i + 3));
              }
              return rows.map((row, rowIdx) => (
                <View key={rowIdx} style={s.desktopRow}>
                  {row.map((servicio) => renderCard(servicio, s.desktopCard, s.cardContent))}
                  {row.length < 3 &&
                    Array(3 - row.length).fill(null).map((_, i) => (
                      <View key={`empty-${i}`} style={[s.desktopCard, { opacity: 0 }]} />
                    ))}
                </View>
              ));
            })()
          ) : (
            pageItems.map((servicio) => renderCard(servicio, s.mobileCard, s.cardContent))
          )}

          <Pagination
            totalItems={totalServicios}
            pageSize={PAGE_SIZE}
            currentPage={page}
            onPageChange={(value) => setPage(value)}
          />

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
  containerDesktop: { maxWidth: 1100, alignSelf: 'center', paddingHorizontal: 40 },

  pageHeader:   { marginBottom: 20 },
  pageTitle:    { fontWeight: '700', color: '#2C2A22', marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: MUTED },

  filtersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  filtersCardDesktop: { flexDirection: 'row', alignItems: 'center', gap: 16 },

  categoriasRow:      { gap: 8, paddingVertical: 2 },
  catBtn:             { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 0.5, borderColor: BORDER, backgroundColor: '#FAFAF7' },
  catBtnActive:       { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  catBtnText:         { fontSize: 12, color: '#555555' },
  catBtnTextActive:   { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },

  ordenRow:           { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ordenLabel:         { fontSize: 12, color: MUTED },
  ordenBtn:           { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 0.5, borderColor: BORDER, backgroundColor: '#FAFAF7' },
  ordenBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  ordenBtnText:       { fontSize: 12, color: '#555555' },
  ordenBtnTextActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },

  resultCount: { fontSize: 12, color: MUTED, marginBottom: 12 },

  desktopRow:  { flexDirection: 'row', gap: 16, marginBottom: 16 },
  desktopCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: BORDER, overflow: 'hidden' },
  mobileCard:  { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: BORDER, overflow: 'hidden', marginBottom: 12 },

  cardImage:   { width: '100%', height: 160 },
  cardContent: { padding: 14, gap: 6 },

  cardTopRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardCategory: { fontSize: 11, color: GOLD, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardDuration: { fontSize: 11, color: MUTED },
  cardName:     { fontSize: 15, fontWeight: '700', color: '#2C2A22' },
  cardDesc:     { fontSize: 12, color: '#777777', lineHeight: 17 },
  cardBottom:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  cardPrice:    { fontSize: 18, fontWeight: '700', color: BURGUNDY },

  detalleBtn:     { backgroundColor: BURGUNDY, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  detalleBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
});