import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  useWindowDimensions, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NavBar from '../../components/NavBar';
import Footer from '../../components/footer';
import ConfirmModal from '../../components/ConfirmModal';
import AlertModal from '../../components/Alertmodal';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../constants';

const BREAKPOINT = 768;
const BURGUNDY   = '#63202C';
const CREAM      = '#F5F0E8';
const BORDER     = '#C4B89A';
const MUTED      = '#9A8E7A';

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

  const [nombre,      setNombre]      = useState(str(raw.nombre));
  const [descripcion, setDescripcion] = useState(str(raw.descripcion));
  const [precio,      setPrecio]      = useState(str(raw.precio));
  const [stock,       setStock]       = useState(str(raw.stock));
  const [categoria,   setCategoria]   = useState(str(raw.categoria) || 'Facial');
  const [marca,       setMarca]       = useState(str(raw.marca));
  const [estado,      setEstado]      = useState(str(raw.estado) || 'disponible');
  const [loading,     setLoading]     = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState<{
    visible: boolean; type: 'error' | 'success' | 'info'; title: string; message: string; onClose?: () => void;
  }>({ visible: false, type: 'info', title: '', message: '' });

  const showAlert = (
    type: 'error' | 'success' | 'info',
    title: string,
    message: string,
    onClose?: () => void,
  ) => setAlert({ visible: true, type, title, message, onClose });

  const closeAlert = () => {
    const cb = alert.onClose;
    setAlert(a => ({ ...a, visible: false }));
    cb?.();
  };

  const id = str(raw.id);

  // Validar antes de abrir el confirm
  const handleGuardarPress = () => {
    if (!nombre.trim()) {
      showAlert('error', 'Campo requerido', 'El nombre del producto es obligatorio.');
      return;
    }
    if (!precio.trim() || isNaN(parseFloat(precio))) {
      showAlert('error', 'Campo requerido', 'Introduce un precio válido.');
      return;
    }
    setShowConfirm(true);
  };

  // Ejecutar guardado tras confirmar
  const handleConfirmarGuardar = async () => {
    setShowConfirm(false);
    try {
      setLoading(true);
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
        showAlert('error', 'Error al guardar', data.error || 'No se pudo actualizar el producto.');
        return;
      }
      // Éxito → mostrar modal y volver al cerrar
      showAlert('success', '¡Guardado!', 'El producto se ha actualizado correctamente.', () => router.back());
    } catch {
      showAlert('error', 'Error de conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={s.screen}>
        <NavBar />
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[s.container, isDesktop && s.containerDesktop]}>

            <TouchableOpacity onPress={() => router.back()} style={s.backRow}>
              <Text style={s.backRowText}>← Volver</Text>
            </TouchableOpacity>

            <Text style={s.pageTitle}>Editar Producto</Text>

            <View style={s.card}>

              <Text style={s.label}>Nombre</Text>
              <TextInput style={s.input} value={nombre} onChangeText={setNombre}
                placeholder="Nombre del producto" placeholderTextColor={MUTED} />

              <Text style={s.label}>Descripción</Text>
              <TextInput style={[s.input, s.inputMultiline]} value={descripcion} onChangeText={setDescripcion}
                placeholder="Descripción del producto" placeholderTextColor={MUTED} multiline numberOfLines={3} />

              <View style={[s.rowFields, isDesktop && s.rowFieldsDesktop]}>
                <View style={s.fieldHalf}>
                  <Text style={s.label}>Precio (€)</Text>
                  <TextInput style={s.input} value={precio} onChangeText={setPrecio}
                    placeholder="0.00" placeholderTextColor={MUTED} keyboardType="decimal-pad" />
                </View>
                <View style={s.fieldHalf}>
                  <Text style={s.label}>Stock</Text>
                  <TextInput style={s.input} value={stock} onChangeText={setStock}
                    placeholder="0" placeholderTextColor={MUTED} keyboardType="number-pad" />
                </View>
              </View>

              <Text style={s.label}>Marca</Text>
              <TextInput style={s.input} value={marca} onChangeText={setMarca}
                placeholder="Marca del producto" placeholderTextColor={MUTED} />

              <Text style={s.label}>Categoría</Text>
              <View style={s.opcionesRow}>
                {CATEGORIAS.map(cat => (
                  <TouchableOpacity key={cat}
                    style={[s.opcionBtn, categoria === cat && s.opcionBtnActive]}
                    onPress={() => setCategoria(cat)}>
                    <Text style={[s.opcionBtnText, categoria === cat && s.opcionBtnTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.label}>Estado</Text>
              <View style={s.opcionesRow}>
                {ESTADOS.map(est => (
                  <TouchableOpacity key={est}
                    style={[s.opcionBtn, estado === est && s.opcionBtnActive]}
                    onPress={() => setEstado(est)}>
                    <Text style={[s.opcionBtnText, estado === est && s.opcionBtnTextActive]}>{est}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[s.guardarBtn, loading && s.guardarBtnDisabled]}
                onPress={handleGuardarPress}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#FFF" />
                  : <Text style={s.guardarBtnText}>GUARDAR CAMBIOS</Text>
                }
              </TouchableOpacity>

            </View>
          </View>
          <Footer />
        </ScrollView>
      </View>

      {/* Confirm antes de guardar */}
      <ConfirmModal
        visible={showConfirm}
        title="Guardar cambios"
        message={`¿Confirmas los cambios en "${nombre}"?`}
        confirmText="Sí, guardar"
        cancelText="Revisar"
        isDangerous={false}
        onConfirm={handleConfirmarGuardar}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Alert resultado */}
      <AlertModal
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
    </>
  );
}

const s = StyleSheet.create({
  screen:           { flex: 1, backgroundColor: CREAM },
  scroll:           { flex: 1 },
  scrollContent:    { flexGrow: 1, justifyContent: 'space-between', paddingBottom: 40 },
  container:        { paddingHorizontal: 16, paddingTop: 20 },
  containerDesktop: { maxWidth: 700, alignSelf: 'center', paddingHorizontal: 40 },

  backRow:     { paddingVertical: 12 },
  backRowText: { color: BURGUNDY, fontSize: 14, fontWeight: '600' },
  pageTitle:   { fontSize: 24, fontWeight: '700', color: '#2C2A22', marginBottom: 20 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 24,
    gap: 12,
  },

  label: { fontSize: 11, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '600' },
  input: {
    borderWidth: 0.5, borderColor: BORDER, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#2C2A22', backgroundColor: '#FAFAF7',
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },

  rowFields:        { gap: 12 },
  rowFieldsDesktop: { flexDirection: 'row' },
  fieldHalf:        { flex: 1, gap: 8 },

  opcionesRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcionBtn:           { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 0.5, borderColor: BORDER, backgroundColor: '#FAFAF7' },
  opcionBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  opcionBtnText:       { fontSize: 12, color: '#555' },
  opcionBtnTextActive: { fontSize: 12, color: '#FFF', fontWeight: '600' },

  guardarBtn:         { backgroundColor: BURGUNDY, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  guardarBtnDisabled: { backgroundColor: BORDER },
  guardarBtnText:     { color: '#FFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.8 },
});
