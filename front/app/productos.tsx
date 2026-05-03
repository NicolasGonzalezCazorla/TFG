import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  TextInput,
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

const CATEGORIAS = ['Todos', 'Facial', 'Corporal', 'Cabello', 'Suplementos'];

const PRODUCTOS = [
  { id: '1',  name: 'Serum Vitamina C',     price: '45', category: 'Facial',      description: 'Ilumina y unifica el tono de la piel.' },
  { id: '2',  name: 'Crema Hidratante',      price: '32', category: 'Facial',      description: 'Hidratación profunda para todo tipo de piel.' },
  { id: '3',  name: 'Aceite Corporal',       price: '28', category: 'Corporal',    description: 'Nutre y suaviza la piel del cuerpo.' },
  { id: '4',  name: 'Mascarilla Detox',      price: '22', category: 'Facial',      description: 'Purifica los poros en profundidad.' },
  { id: '5',  name: 'Champú Reparador',      price: '18', category: 'Cabello',     description: 'Restaura el cabello dañado y seco.' },
  { id: '6',  name: 'Mascarilla Capilar',    price: '24', category: 'Cabello',     description: 'Nutrición intensiva para el cabello.' },
  { id: '7',  name: 'Colageno Premium',      price: '55', category: 'Suplementos', description: 'Mejora la elasticidad y firmeza de la piel.' },
  { id: '8',  name: 'Vitamina C Complex',    price: '38', category: 'Suplementos', description: 'Refuerza el sistema inmune y la piel.' },
  { id: '9',  name: 'Exfoliante Corporal',   price: '26', category: 'Corporal',    description: 'Elimina celulas muertas y suaviza la piel.' },
  { id: '10', name: 'Contorno de Ojos',      price: '42', category: 'Facial',      description: 'Reduce ojeras y bolsas visiblemente.' },
  { id: '11', name: 'Aceite Capilar',        price: '20', category: 'Cabello',     description: 'Brillo y nutricion para el cabello seco.' },
  { id: '12', name: 'Omega 3 Premium',       price: '35', category: 'Suplementos', description: 'Cuida la piel desde el interior.' },
];

const PRODUCT_IMAGE = { uri: 'https://picsum.photos/seed/lipstick/300/300' };

export default function Productos() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const router    = useRouter();

  const [search,    setSearch]    = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [orden,     setOrden]     = useState<'asc' | 'desc' | null>(null);

  const productosFiltrados = PRODUCTOS
    .filter((p) => {
      const matchCat    = categoria === 'Todos' || p.category === categoria;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (orden === 'asc')  return Number(a.price) - Number(b.price);
      if (orden === 'desc') return Number(b.price) - Number(a.price);
      return 0;
    });

  const numColumns = isDesktop ? 3 : 2;
  const rows: typeof PRODUCTOS[] = [];
  for (let i = 0; i < productosFiltrados.length; i += numColumns) {
    rows.push(productosFiltrados.slice(i, i + numColumns));
  }

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
              {'Nuestros Productos'}
            </Text>
            <Text style={s.pageSubtitle}>
              {'Seleccionados para tu bienestar y cuidado personal'}
            </Text>
          </View>

          {/* ── Filtros ── */}
          <View style={[s.filtersCard, isDesktop && s.filtersCardDesktop]}>

            {/* Buscador */}
            <View style={s.searchWrapper}>
              <Text style={s.searchIcon}>{'🔍'}</Text>
              <TextInput
                style={s.searchInput}
                placeholder={'Buscar producto...'}
                placeholderTextColor={MUTED}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Text style={s.clearBtn}>{'✕'}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Categorías */}
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

            {/* Orden precio */}
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
            {productosFiltrados.length} {'productos encontrados'}
          </Text>

          {/* ── Grid productos ── */}
          {rows.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>{'No se encontraron productos'}</Text>
            </View>
          ) : (
            rows.map((row, rowIdx) => (
              <View key={rowIdx} style={s.productRow}>
                {row.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={s.productCard}
                    onPress={() =>
                      router.push({
                        pathname: '/producto/[id]',
                        params: {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          description: product.description,
                        },
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <Image
                      source={PRODUCT_IMAGE}
                      style={s.productImage}
                      resizeMode="contain"
                    />
                    <View style={s.productInfo}>
                      <View style={s.productNameRow}>
                        <Text style={s.productName} numberOfLines={1}>
                          {product.name}
                        </Text>
                        <Text style={s.productPrice}>{product.price}{'€'}</Text>
                      </View>
                      <Text style={s.productCategory}>{product.category}</Text>
                      <Text style={s.productDesc} numberOfLines={2}>
                        {product.description}
                      </Text>
                    </View>
                    <View style={s.detalleBtn}>
                      <Text style={s.detalleBtnText}>{'DETALLE'}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {row.length < numColumns &&
                  Array(numColumns - row.length)
                    .fill(null)
                    .map((_, i) => (
                      <View key={`empty-${i}`} style={[s.productCard, { opacity: 0 }]} />
                    ))}
              </View>
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

  // ── Cabecera ──
  pageHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontWeight: '700',
    color: '#2C2A22',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: MUTED,
  },

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
    flexWrap: 'wrap',
    gap: 16,
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAF7',
    height: 40,
    flex: 1,
    minWidth: 200,
  },
  searchIcon:  { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 13, color: '#2C2A22' },
  clearBtn:    { fontSize: 14, color: MUTED, paddingLeft: 6 },

  categoriasRow: {
    gap: 8,
    paddingVertical: 2,
  },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: BORDER,
    backgroundColor: '#FAFAF7',
  },
  catBtnActive: {
    backgroundColor: BURGUNDY,
    borderColor: BURGUNDY,
  },
  catBtnText:       { fontSize: 12, color: '#555555' },
  catBtnTextActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },

  ordenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ordenLabel: { fontSize: 12, color: MUTED },
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

  // ── Resultado ──
  resultCount: {
    fontSize: 12,
    color: MUTED,
    marginBottom: 12,
  },

  // ── Grid ──
  productRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F9F8F4',
  },
  productInfo: {
    padding: 10,
  },
  productNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  productName:     { fontSize: 13, fontWeight: '700', color: '#333333', flex: 1, marginRight: 6 },
  productPrice:    { fontSize: 13, fontWeight: '700', color: BURGUNDY },
  productCategory: { fontSize: 11, color: GOLD, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  productDesc:     { fontSize: 11, color: '#888888', lineHeight: 16 },

  detalleBtn: {
    backgroundColor: BURGUNDY,
    paddingVertical: 9,
    alignItems: 'center',
  },
  detalleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // ── Empty ──
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: MUTED,
  },
});