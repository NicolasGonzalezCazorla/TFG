import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  TextInput,
  ActivityIndicator,
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
const API_URL    = 'http://localhost:3000/api';

const CATEGORIAS = ['Todos', 'Facial', 'Corporal', 'Cabello', 'Suplementos'];
const PRODUCT_IMAGE = { uri: 'https://picsum.photos/seed/lipstick/300/300' };

type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  marca: string;
  stock: number;
  estado: string;
  imagen_url: string | null;
};

export default function Productos() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const router    = useRouter();

  const [productos,        setProductos]        = useState<Producto[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState('');
  const [search,           setSearch]           = useState('');
  const [categoria,        setCategoria]        = useState('Todos');
  const [orden,            setOrden]            = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      if (res.ok) {
        setProductos(data.productos ?? []);
      } else {
        setError(data.error || 'Error cargando productos');
      }
    } catch (e) {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos
    .filter((p) => {
      const matchCat    = categoria === 'Todos' || p.categoria === categoria;
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (orden === 'asc')  return a.precio - b.precio;
      if (orden === 'desc') return b.precio - a.precio;
      return 0;
    });

  const numColumns = isDesktop ? 3 : 2;
  const rows: Producto[][] = [];
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

          {/* ── Loading / Error ── */}
          {loading ? (
            <ActivityIndicator color={BURGUNDY} style={{ marginTop: 40 }} />
          ) : error ? (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
              <TouchableOpacity onPress={cargarProductos} style={s.retryBtn}>
                <Text style={s.retryBtnText}>{'Reintentar'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={s.resultCount}>
                {productosFiltrados.length}{' productos encontrados'}
              </Text>

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
                              id:          product.id,
                              name:        product.nombre,
                              price:       String(product.precio),
                              description: product.descripcion,
                            },
                          })
                        }
                        activeOpacity={0.85}
                      >
                        <Image
                          source={
                            product.imagen_url
                              ? { uri: product.imagen_url }
                              : PRODUCT_IMAGE
                          }
                          style={s.productImage}
                          resizeMode="contain"
                        />
                        <View style={s.productInfo}>
                          <View style={s.productNameRow}>
                            <Text style={s.productName} numberOfLines={1}>
                              {product.nombre}
                            </Text>
                            <Text style={s.productPrice}>{product.precio}{'€'}</Text>
                          </View>
                          <Text style={s.productCategory}>{product.categoria}</Text>
                          <Text style={s.productDesc} numberOfLines={2}>
                            {product.descripcion}
                          </Text>
                        </View>
                        <View style={[
                          s.detalleBtn,
                          product.estado === 'sin_stock' && s.detalleBtnSinStock,
                        ]}>
                          <Text style={s.detalleBtnText}>
                            {product.estado === 'sin_stock' ? 'SIN STOCK' : 'DETALLE'}
                          </Text>
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
            </>
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

  errorBox:     { alignItems: 'center', paddingVertical: 40, gap: 12 },
  errorText:    { fontSize: 14, color: BURGUNDY },
  retryBtn:     { borderWidth: 0.5, borderColor: BORDER, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  retryBtnText: { fontSize: 13, color: BURGUNDY },

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
  productInfo: { padding: 10 },
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
  detalleBtnSinStock: { backgroundColor: MUTED },
  detalleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  emptyState: { paddingVertical: 60, alignItems: 'center' },
  emptyText:  { fontSize: 14, color: MUTED },
});