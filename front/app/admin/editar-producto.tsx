import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NavBar from '../../components/NavBar';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';

const BREAKPOINT = 768;
const BURGUNDY   = '#63202C';
const CREAM      = '#F5F0E8';
const BORDER     = '#C4B89A';
const MUTED      = '#9A8E7A';
const API_URL    = 'http://localhost:3000/api';

const CATEGORIAS = ['Facial', 'Corporal', 'Cabello', 'Suplementos'];
const ESTADOS    = ['disponible', 'sin_stock', 'reservado'];

export default function EditarProducto() {
  const router    = useRouter();
  const { token } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const raw       = useLocalSearchParams();

  const str = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v ?? '';

  const [nombre,      setNombre]      = useState(str(raw.nombre)      ?? '');
  const [descripcion, setDescripcion] = useState(str(raw.descripcion) ?? '');
  const [precio,      setPrecio]      = useState(str(raw.precio)      ?? '');
  const [stock,       setStock]       = useState(str(raw.stock)       ?? '');
  const [categoria,   setCategoria]   = useState(str(raw.categoria)   ?? 'Facial');
  const [marca,       setMarca]       = useState(str(raw.marca)       ?? '');
  const [estado,      setEstado]      = useState(str(raw.estado)      ?? 'disponible');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [exito,       setExito]       = useState(false);

  const id = str(raw.id);

  const handleGuardar = async () => {
    if (!nombre || !precio) {
      setError('Nombre y precio son obligatorios');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setExito(false);

      const res = await fetch(`${API_URL}/productos`, {
        method: 'PUT',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          nombre,
          descripcion,
          precio:    parseFloat(precio),
          stock:     parseInt(stock) || 0,
          categoria,
          marca,
          estado,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al actualizar el producto');
        return;
      }

      setExito(true);
      window.alert('Producto actualizado correctamente');
      router.back();

    } catch (e) {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.container, isDesktop && s.containerDesktop]}>

          <TouchableOpacity onPress={() => router.back()} style={s.backRow}>
            <Text style={s.backRowText}>{'← Volver'}</Text>
          </TouchableOpacity>

          <Text style={s.pageTitle}>{'Editar Producto'}</Text>

          <View style={s.card}>

            <Text style={s.label}>{'Nombre'}</Text>
            <TextInput
              style={s.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder={'Nombre del producto'}
              placeholderTextColor={MUTED}
            />

            <Text style={s.label}>{'Descripcion'}</Text>
            <TextInput
              style={[s.input, s.inputMultiline]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder={'Descripcion del producto'}
              placeholderTextColor={MUTED}
              multiline
              numberOfLines={3}
            />

            <View style={[s.rowFields, isDesktop && s.rowFieldsDesktop]}>
              <View style={s.fieldHalf}>
                <Text style={s.label}>{'Precio (€)'}</Text>
                <TextInput
                  style={s.input}
                  value={precio}
                  onChangeText={setPrecio}
                  placeholder={'0.00'}
                  placeholderTextColor={MUTED}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={s.fieldHalf}>
                <Text style={s.label}>{'Stock'}</Text>
                <TextInput
                  style={s.input}
                  value={stock}
                  onChangeText={setStock}
                  placeholder={'0'}
                  placeholderTextColor={MUTED}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <Text style={s.label}>{'Marca'}</Text>
            <TextInput
              style={s.input}
              value={marca}
              onChangeText={setMarca}
              placeholder={'Marca del producto'}
              placeholderTextColor={MUTED}
            />

            <Text style={s.label}>{'Categoria'}</Text>
            <View style={s.opcionesRow}>
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[s.opcionBtn, categoria === cat && s.opcionBtnActive]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text style={[s.opcionBtnText, categoria === cat && s.opcionBtnTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.label}>{'Estado'}</Text>
            <View style={s.opcionesRow}>
              {ESTADOS.map((est) => (
                <TouchableOpacity
                  key={est}
                  style={[s.opcionBtn, estado === est && s.opcionBtnActive]}
                  onPress={() => setEstado(est)}
                >
                  <Text style={[s.opcionBtnText, estado === est && s.opcionBtnTextActive]}>
                    {est}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {error ? <Text style={s.errorText}>{error}</Text> : null}

            {exito ? (
              <Text style={s.exitoText}>{'Producto actualizado correctamente'}</Text>
            ) : null}

            <TouchableOpacity
              style={[s.guardarBtn, loading && s.guardarBtnDisabled]}
              onPress={handleGuardar}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#FFFFFF" />
                : <Text style={s.guardarBtnText}>{'GUARDAR CAMBIOS'}</Text>
              }
            </TouchableOpacity>

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
  scrollContent:    { flexGrow: 1, paddingBottom: 40 },
  container:        { paddingHorizontal: 16, paddingTop: 20 },
  containerDesktop: { maxWidth: 700, alignSelf: 'center', paddingHorizontal: 40 },

  backRow:     { paddingVertical: 12 },
  backRowText: { color: BURGUNDY, fontSize: 14, fontWeight: '600' },
  pageTitle:   { fontSize: 24, fontWeight: '700', color: '#2C2A22', marginBottom: 20 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 24,
    gap: 12,
  },

  label: {
    fontSize: 11,
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  input: {
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#2C2A22',
    backgroundColor: '#FAFAF7',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  rowFields:        { gap: 12 },
  rowFieldsDesktop: { flexDirection: 'row' },
  fieldHalf:        { flex: 1, gap: 8 },

  opcionesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: BORDER,
    backgroundColor: '#FAFAF7',
  },
  opcionBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  opcionBtnText:       { fontSize: 12, color: '#555555' },
  opcionBtnTextActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },

  errorText: {
    fontSize: 13,
    color: BURGUNDY,
    backgroundColor: '#FBF5F6',
    padding: 10,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#E8C4C8',
  },
  exitoText: {
    fontSize: 13,
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#A5D6A7',
  },

  guardarBtn:         { backgroundColor: BURGUNDY, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  guardarBtnDisabled: { backgroundColor: BORDER },
  guardarBtnText:     { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.8 },
});