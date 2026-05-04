import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import NavBar from '../../components/NavBar';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../constants';

const BREAKPOINT = 768;
const BURGUNDY   = '#63202C';
const CREAM      = '#F5F0E8';
const BORDER     = '#C4B89A';
const MUTED      = '#9A8E7A';

const CATEGORIAS = ['Facial', 'Corporal', 'Cabello', 'Suplementos'];
const ESTADOS    = ['disponible', 'sin_stock', 'reservado'];

type Tab = 'citas' | 'reservas' | 'productos';

export default function AdminPanel() {
  const { width }  = useWindowDimensions();
  const isDesktop  = width >= BREAKPOINT;
  const router     = useRouter();
  const { usuario, token, isAdmin } = useAuth();

  const [tab,             setTab]             = useState<Tab>('citas');
  const [citas,           setCitas]           = useState<any[]>([]);
  const [reservas,        setReservas]        = useState<any[]>([]);
  const [productos,       setProductos]       = useState<any[]>([]);
  const [loadingCitas,    setLoadingCitas]    = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [loadingProductos,setLoadingProductos]= useState(true);

  // Nuevo producto
  const [showNuevo,      setShowNuevo]      = useState(false);
  const [nuevoNombre,    setNuevoNombre]    = useState('');
  const [nuevoDesc,      setNuevoDesc]      = useState('');
  const [nuevoPrecio,    setNuevoPrecio]    = useState('');
  const [nuevoStock,     setNuevoStock]     = useState('');
  const [nuevoCat,       setNuevoCat]       = useState('Facial');
  const [nuevoMarca,     setNuevoMarca]     = useState('');
  const [nuevoEstado,    setNuevoEstado]    = useState('disponible');
  const [guardando,      setGuardando]      = useState(false);

  useEffect(() => {
    if (!token) return;
    if (!isAdmin) { router.replace('/'); return; }
    cargarCitas();
    cargarReservas();
    cargarProductos();
  }, [token, isAdmin]);

  useFocusEffect(
    React.useCallback(() => {
      if (!token || !isAdmin) return;
      cargarProductos();
      cargarCitas();
      cargarReservas();
    }, [token, isAdmin])
  );

  const cargarCitas = async () => {
    try {
      setLoadingCitas(true);
      const res  = await fetch(`${API_URL}/citas`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setCitas(data.citas ?? []);
    } finally { setLoadingCitas(false); }
  };

  const cargarReservas = async () => {
    try {
      setLoadingReservas(true);
      const res  = await fetch(`${API_URL}/reservas`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setReservas(data.reservas ?? []);
    } finally { setLoadingReservas(false); }
  };

  const cargarProductos = async () => {
    try {
      setLoadingProductos(true);
      const res  = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      if (res.ok) setProductos(data.productos ?? []);
    } finally { setLoadingProductos(false); }
  };

  const actualizarEstadoCita = async (id: string, estado: string) => {
    try {
      const res = await fetch(`${API_URL}/citas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id, estado }),
      });
      if (res.ok) setCitas(prev => prev.map(c => c.id === id ? { ...c, estado } : c));
    } catch { window.alert('No se pudo actualizar la cita'); }
  };

  const eliminarCitaAdmin = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta cita?')) return;
    try {
      const res = await fetch(`${API_URL}/citas/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: 'cancelada' } : c));
      } else {
        const data = await res.json();
        window.alert(data.error || 'No se pudo eliminar');
      }
    } catch { window.alert('Error de conexion'); }
  };

  const actualizarEstadoReserva = async (id: string, estado: string) => {
    try {
      const res = await fetch(`${API_URL}/reservas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id, estado }),
      });
      if (res.ok) setReservas(prev => prev.map(r => r.id === id ? { ...r, estado } : r));
    } catch { window.alert('No se pudo actualizar la reserva'); }
  };

  const eliminarProducto = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    const res = await fetch(`${API_URL}/productos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setProductos(prev => prev.filter(p => p.id !== id));
  };

  const crearProducto = async () => {
    if (!nuevoNombre || !nuevoPrecio) {
      window.alert('Nombre y precio son obligatorios');
      return;
    }
    try {
      setGuardando(true);
      const res = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          nombre:      nuevoNombre,
          descripcion: nuevoDesc,
          precio:      parseFloat(nuevoPrecio),
          stock:       parseInt(nuevoStock) || 0,
          categoria:   nuevoCat,
          marca:       nuevoMarca,
          estado:      nuevoEstado,
        }),
      });
      const data = await res.json();
      if (!res.ok) { window.alert(data.error || 'Error al crear'); return; }
      setProductos(prev => [data.producto, ...prev]);
      setShowNuevo(false);
      setNuevoNombre(''); setNuevoDesc(''); setNuevoPrecio('');
      setNuevoStock(''); setNuevoCat('Facial'); setNuevoMarca('');
      setNuevoEstado('disponible');
      window.alert('Producto creado correctamente');
    } catch { window.alert('Error de conexion'); }
    finally { setGuardando(false); }
  };

  const estadoCitaColor = (estado: string) => {
    switch (estado) {
      case 'confirmada': return '#E8F5E9';
      case 'completada': return '#E3F2FD';
      case 'cancelada':  return '#FBF5F6';
      default:           return '#FFF9E6';
    }
  };

  const estadoReservaColor = (estado: string) => {
    switch (estado) {
      case 'lista':    return '#E8F5E9';
      case 'recogida': return '#E3F2FD';
      case 'cancelada':return '#FBF5F6';
      default:         return '#FFF9E6';
    }
  };

  if (!usuario || !isAdmin) {
    return (
      <View style={s.screen}>
        <NavBar />
        <View style={s.centrado}>
          <Text style={s.noAccesoText}>{'Acceso restringido a administradores'}</Text>
        </View>
      </View>
    );
  }

  const renderCitas = () => (
    loadingCitas ? (
      <ActivityIndicator color={BURGUNDY} style={{ marginTop: 40 }} />
    ) : citas.length === 0 ? (
      <View style={s.emptyBox}><Text style={s.emptyText}>{'No hay citas'}</Text></View>
    ) : (
      citas.map((cita) => (
        <View key={cita.id} style={[s.itemCard, { backgroundColor: estadoCitaColor(cita.estado) }]}>
          <View style={s.itemHeader}>
            <Text style={s.itemTitle}>{cita.servicios?.nombre ?? 'Servicio'}</Text>
            <Text style={s.itemEstado}>{cita.estado}</Text>
          </View>
          <Text style={s.itemMeta}>
            {'Fecha: '}{cita.fecha}{' · '}{cita.hora.substring(0, 5)}{'h'}
          </Text>
          {cita.perfiles && (
            <View style={s.clienteBox}>
              <Text style={s.clienteLabel}>{'Cliente:'}</Text>
              <Text style={s.clienteNombre}>{cita.perfiles.nombre}{' '}{cita.perfiles.apellidos}</Text>
            </View>
          )}
          {cita.estado === 'cancelada' && cita.cancelador && (
            <View style={s.canceladoBox}>
              <Text style={s.canceladoLabel}>{'Cancelado por:'}</Text>
              <Text style={s.canceladoNombre}>{cita.cancelador.nombre}{' '}{cita.cancelador.apellidos}</Text>
            </View>
          )}
          {cita.aclaracion ? <Text style={s.itemNota}>{'Nota: '}{cita.aclaracion}</Text> : null}
          <View style={s.accionesRow}>
            {['pendiente','confirmada','completada','cancelada'].map((est) => (
              <TouchableOpacity
                key={est}
                style={[s.estadoBtn, cita.estado === est && s.estadoBtnActive]}
                onPress={() => actualizarEstadoCita(cita.id, est)}
              >
                <Text style={[s.estadoBtnText, cita.estado === est && s.estadoBtnTextActive]}>{est}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={s.eliminarBtn} onPress={() => eliminarCitaAdmin(cita.id)}>
              <Text style={s.eliminarBtnText}>{'Eliminar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))
    )
  );

  const renderReservas = () => (
    loadingReservas ? (
      <ActivityIndicator color={BURGUNDY} style={{ marginTop: 40 }} />
    ) : reservas.length === 0 ? (
      <View style={s.emptyBox}><Text style={s.emptyText}>{'No hay reservas'}</Text></View>
    ) : (
      reservas.map((reserva) => (
        <View key={reserva.id} style={[s.itemCard, { backgroundColor: estadoReservaColor(reserva.estado) }]}>
          <View style={s.itemHeader}>
            <Text style={s.itemTitle}>{reserva.productos?.nombre ?? 'Producto'}</Text>
            <Text style={s.itemEstado}>{reserva.estado}</Text>
          </View>
          <Text style={s.itemMeta}>
            {'Recogida: '}{reserva.dia_recogida}{' · '}{reserva.hora_recogida}{'h'}
          </Text>
          {reserva.perfiles && (
            <View style={s.clienteBox}>
              <Text style={s.clienteLabel}>{'Cliente:'}</Text>
              <Text style={s.clienteNombre}>{reserva.perfiles.nombre}{' '}{reserva.perfiles.apellidos}</Text>
            </View>
          )}
          {reserva.nota ? <Text style={s.itemNota}>{'Nota: '}{reserva.nota}</Text> : null}
          <View style={s.accionesRow}>
            {['pendiente','lista','recogida','cancelada'].map((est) => (
              <TouchableOpacity
                key={est}
                style={[s.estadoBtn, reserva.estado === est && s.estadoBtnActive]}
                onPress={() => actualizarEstadoReserva(reserva.id, est)}
              >
                <Text style={[s.estadoBtnText, reserva.estado === est && s.estadoBtnTextActive]}>{est}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))
    )
  );

  const renderProductos = () => (
    <>
      {/* Botón nuevo producto */}
      <TouchableOpacity
        style={s.nuevoBtn}
        onPress={() => setShowNuevo(!showNuevo)}
      >
        <Text style={s.nuevoBtnText}>{showNuevo ? '✕ Cerrar' : '+ Nuevo producto'}</Text>
      </TouchableOpacity>

      {/* Formulario nuevo producto */}
      {showNuevo && (
        <View style={s.nuevoCard}>
          <Text style={s.nuevoTitle}>{'Nuevo producto'}</Text>

          <Text style={s.fieldLabel}>{'Nombre *'}</Text>
          <TextInput style={s.fieldInput} value={nuevoNombre} onChangeText={setNuevoNombre}
            placeholder={'Nombre'} placeholderTextColor={MUTED} />

          <Text style={s.fieldLabel}>{'Descripcion'}</Text>
          <TextInput style={[s.fieldInput, { minHeight: 60, textAlignVertical: 'top' }]}
            value={nuevoDesc} onChangeText={setNuevoDesc}
            placeholder={'Descripcion'} placeholderTextColor={MUTED} multiline />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.fieldLabel}>{'Precio (€) *'}</Text>
              <TextInput style={s.fieldInput} value={nuevoPrecio} onChangeText={setNuevoPrecio}
                placeholder={'0.00'} placeholderTextColor={MUTED} keyboardType="decimal-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.fieldLabel}>{'Stock'}</Text>
              <TextInput style={s.fieldInput} value={nuevoStock} onChangeText={setNuevoStock}
                placeholder={'0'} placeholderTextColor={MUTED} keyboardType="number-pad" />
            </View>
          </View>

          <Text style={s.fieldLabel}>{'Marca'}</Text>
          <TextInput style={s.fieldInput} value={nuevoMarca} onChangeText={setNuevoMarca}
            placeholder={'Marca'} placeholderTextColor={MUTED} />

          <Text style={s.fieldLabel}>{'Categoria'}</Text>
          <View style={s.opcionesRow}>
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[s.opcionBtn, nuevoCat === cat && s.opcionBtnActive]}
                onPress={() => setNuevoCat(cat)}
              >
                <Text style={[s.opcionBtnText, nuevoCat === cat && s.opcionBtnTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.fieldLabel}>{'Estado'}</Text>
          <View style={s.opcionesRow}>
            {ESTADOS.map((est) => (
              <TouchableOpacity
                key={est}
                style={[s.opcionBtn, nuevoEstado === est && s.opcionBtnActive]}
                onPress={() => setNuevoEstado(est)}
              >
                <Text style={[s.opcionBtnText, nuevoEstado === est && s.opcionBtnTextActive]}>{est}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[s.guardarBtn, guardando && s.guardarBtnDisabled]}
            onPress={crearProducto}
            disabled={guardando}
          >
            {guardando
              ? <ActivityIndicator color="#FFFFFF" />
              : <Text style={s.guardarBtnText}>{'CREAR PRODUCTO'}</Text>
            }
          </TouchableOpacity>
        </View>
      )}

      {/* Lista productos */}
      {loadingProductos ? (
        <ActivityIndicator color={BURGUNDY} style={{ marginTop: 40 }} />
      ) : productos.length === 0 ? (
        <View style={s.emptyBox}><Text style={s.emptyText}>{'No hay productos'}</Text></View>
      ) : (
        productos.map((producto) => (
          <View key={producto.id} style={s.itemCard}>
            <View style={s.itemHeader}>
              <Text style={s.itemTitle}>{producto.nombre}</Text>
              <Text style={s.itemPrecio}>{producto.precio}{'€'}</Text>
            </View>
            <Text style={s.itemMeta}>
              {producto.categoria}{' · Stock: '}{producto.stock}{' · '}{producto.estado}
            </Text>
            {producto.descripcion ? <Text style={s.itemNota}>{producto.descripcion}</Text> : null}
            <View style={s.accionesRow}>
              <TouchableOpacity style={s.eliminarBtn} onPress={() => eliminarProducto(producto.id)}>
                <Text style={s.eliminarBtnText}>{'Eliminar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.estadoBtn}
                onPress={() => router.push({
                  pathname: '/admin/editar-producto',
                  params: {
                    id:          producto.id,
                    nombre:      producto.nombre,
                    descripcion: producto.descripcion ?? '',
                    precio:      String(producto.precio),
                    stock:       String(producto.stock),
                    categoria:   producto.categoria ?? 'Facial',
                    marca:       producto.marca ?? '',
                    estado:      producto.estado ?? 'disponible',
                  },
                })}
              >
                <Text style={s.estadoBtnText}>{'Editar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </>
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

          <Text style={s.pageTitle}>{'Panel de Administracion'}</Text>

          <View style={s.tabsRow}>
            {(['citas', 'reservas', 'productos'] as Tab[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[s.tabBtn, tab === t && s.tabBtnActive]}
                onPress={() => setTab(t)}
              >
                <Text style={[s.tabBtnText, tab === t && s.tabBtnTextActive]}>
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tab === 'citas'     && renderCitas()}
          {tab === 'reservas'  && renderReservas()}
          {tab === 'productos' && renderProductos()}

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
  container:        { paddingHorizontal: 16, paddingTop: 24 },
  containerDesktop: { maxWidth: 1000, alignSelf: 'center', paddingHorizontal: 40 },

  centrado:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  noAccesoText: { fontSize: 16, color: MUTED, textAlign: 'center' },

  pageTitle: { fontSize: 24, fontWeight: '700', color: '#2C2A22', marginBottom: 20 },

  tabsRow:      { flexDirection: 'row', gap: 8, marginBottom: 24 },
  tabBtn:       { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 0.5, borderColor: BORDER, alignItems: 'center', backgroundColor: '#FFFFFF' },
  tabBtnActive: { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  tabBtnText:   { fontSize: 12, color: '#555555', fontWeight: '600', letterSpacing: 0.5 },
  tabBtnTextActive: { color: '#FFFFFF' },

  itemCard: { borderRadius: 10, borderWidth: 0.5, borderColor: BORDER, padding: 14, marginBottom: 12, gap: 6, backgroundColor: '#FFFFFF' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle:  { fontSize: 14, fontWeight: '700', color: '#2C2A22', flex: 1 },
  itemEstado: { fontSize: 11, color: MUTED, fontWeight: '600', textTransform: 'uppercase' },
  itemPrecio: { fontSize: 14, fontWeight: '700', color: BURGUNDY },
  itemMeta:   { fontSize: 12, color: MUTED },
  itemNota:   { fontSize: 12, color: '#555555', fontStyle: 'italic' },

  clienteBox:    { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(99,32,44,0.06)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  clienteLabel:  { fontSize: 11, color: MUTED, fontWeight: '600' },
  clienteNombre: { fontSize: 12, color: BURGUNDY, fontWeight: '600' },

  canceladoBox:    { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FBF5F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 0.5, borderColor: '#E8C4C8' },
  canceladoLabel:  { fontSize: 11, color: MUTED, fontWeight: '600' },
  canceladoNombre: { fontSize: 12, color: BURGUNDY, fontWeight: '700' },

  accionesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  estadoBtn:   { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderWidth: 0.5, borderColor: BORDER, backgroundColor: '#FFFFFF' },
  estadoBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  estadoBtnText:       { fontSize: 11, color: '#555555' },
  estadoBtnTextActive: { color: '#FFFFFF', fontWeight: '600' },

  eliminarBtn:     { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderWidth: 0.5, borderColor: BURGUNDY, backgroundColor: '#FBF5F6' },
  eliminarBtnText: { fontSize: 11, color: BURGUNDY, fontWeight: '600' },

  emptyBox:  { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: MUTED },

  // ── Nuevo producto ──
  nuevoBtn:     { backgroundColor: BURGUNDY, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 16 },
  nuevoBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  nuevoCard: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: BORDER, padding: 16, marginBottom: 20, gap: 8 },
  nuevoTitle:{ fontSize: 16, fontWeight: '700', color: '#2C2A22', marginBottom: 4 },

  fieldLabel: { fontSize: 11, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '600' },
  fieldInput: { borderWidth: 0.5, borderColor: BORDER, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#2C2A22', backgroundColor: '#FAFAF7' },

  opcionesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcionBtn:   { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5, borderColor: BORDER, backgroundColor: '#FAFAF7' },
  opcionBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  opcionBtnText:       { fontSize: 12, color: '#555555' },
  opcionBtnTextActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },

  guardarBtn:         { backgroundColor: BURGUNDY, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  guardarBtnDisabled: { backgroundColor: BORDER },
  guardarBtnText:     { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.8 },
});