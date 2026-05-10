import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Image,
  useWindowDimensions, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import NavBar from '../../components/NavBar';
import Footer from '../../components/footer';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';
import AlertModal from '../../components/Alertmodal';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../constants';

const BREAKPOINT = 768;
const BURGUNDY   = '#63202C';
const CREAM      = '#F5F0E8';
const BORDER     = '#C4B89A';
const MUTED      = '#9A8E7A';

const CATEGORIAS_P    = ['Facial', 'Corporal', 'Cabello', 'Suplementos'];
const ESTADOS_P       = ['disponible', 'sin_stock', 'reservado'];
const ESTADOS_CITA    = ['pendiente', 'confirmada', 'completada', 'cancelada'];
const ESTADOS_RESERVA = ['pendiente', 'lista', 'recogida', 'cancelada'];
const PAGE_SIZE       = 6;

type Tab = 'citas' | 'reservas' | 'productos';

export default function AdminPanel() {
  const { width }  = useWindowDimensions();
  const isDesktop  = width >= BREAKPOINT;
  const router     = useRouter();
  const { usuario, token, isAdmin } = useAuth();

  const [tab,              setTab]              = useState<Tab>('citas');
  const [citas,            setCitas]            = useState<any[]>([]);
  const [reservas,         setReservas]         = useState<any[]>([]);
  const [productos,        setProductos]        = useState<any[]>([]);
  const [loadingCitas,     setLoadingCitas]     = useState(true);
  const [loadingReservas,  setLoadingReservas]  = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);

  // ── Filtros ───────────────────────────────────────────────────────────────
  const [filtroCita,        setFiltroCita]        = useState('todos');
  const [filtroReserva,     setFiltroReserva]     = useState('todos');
  const [filtroProductoCat, setFiltroProductoCat] = useState('todos');
  const [filtroProductoEst, setFiltroProductoEst] = useState('todos');
  const [busquedaCita,      setBusquedaCita]      = useState('');
  const [busquedaReserva,   setBusquedaReserva]   = useState('');
  const [busquedaProducto,  setBusquedaProducto]  = useState('');

  // ── Paginación ────────────────────────────────────────────────────────────
  const [citaPage,     setCitaPage]     = useState(1);
  const [reservaPage,  setReservaPage]  = useState(1);
  const [productoPage, setProductoPage] = useState(1);

  // ── Nuevo producto ────────────────────────────────────────────────────────
  const [showNuevo,    setShowNuevo]    = useState(false);
  const [nuevoNombre,  setNuevoNombre]  = useState('');
  const [nuevoDesc,    setNuevoDesc]    = useState('');
  const [nuevoPrecio,  setNuevoPrecio]  = useState('');
  const [nuevoStock,   setNuevoStock]   = useState('');
  const [nuevoCat,     setNuevoCat]     = useState('Facial');
  const [nuevoMarca,   setNuevoMarca]   = useState('');
  const [nuevoEstado,  setNuevoEstado]  = useState('disponible');
  const [nuevoImagen,  setNuevoImagen]  = useState<{ uri: string; name: string; type: string } | null>(null);
  const [guardando,    setGuardando]    = useState(false);

  // ── Modales ───────────────────────────────────────────────────────────────
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean; title: string; message: string; onConfirm: () => void;
  }>({ visible: false, title: '', message: '', onConfirm: () => {} });

  const [alertModal, setAlertModal] = useState<{
    visible: boolean; type: 'error' | 'success' | 'info'; title: string; message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });

  const showConfirm = (title: string, message: string, onConfirm: () => void) =>
    setConfirmModal({ visible: true, title, message, onConfirm });
  const showAlert = (type: 'error' | 'success' | 'info', title: string, message: string) =>
    setAlertModal({ visible: true, type, title, message });

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    if (!isAdmin) { router.replace('/'); return; }
    cargarCitas(); cargarReservas(); cargarProductos();
  }, [token, isAdmin]);

  useFocusEffect(React.useCallback(() => {
    if (!token || !isAdmin) return;
    cargarProductos(); cargarCitas(); cargarReservas();
  }, [token, isAdmin]));

  useEffect(() => { setCitaPage(1); },    [tab, filtroCita, busquedaCita]);
  useEffect(() => { setReservaPage(1); }, [tab, filtroReserva, busquedaReserva]);
  useEffect(() => { setProductoPage(1); },[tab, filtroProductoCat, filtroProductoEst, busquedaProducto]);

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

  // ── Seleccionar imagen ────────────────────────────────────────────────────
  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert('error', 'Sin permiso', 'Necesitamos acceso a tu galería para seleccionar una imagen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileName = asset.uri.split('/').pop() ?? 'imagen.jpg';
      const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
      setNuevoImagen({ uri: asset.uri, name: fileName, type: fileType });
    }
  };

  // ── Crear producto con imagen ─────────────────────────────────────────────
  const crearProducto = async () => {
    if (!nuevoNombre || !nuevoPrecio) {
      showAlert('error', 'Campos requeridos', 'El nombre y el precio son obligatorios.');
      return;
    }
    try {
      setGuardando(true);

      let body: FormData | string;
      let headers: Record<string, string> = { Authorization: `Bearer ${token}` };

      if (nuevoImagen) {
        // Enviar como multipart/form-data para incluir la imagen
        const form = new FormData();
        form.append('nombre',      nuevoNombre);
        form.append('descripcion', nuevoDesc);
        form.append('precio',      nuevoPrecio);
        form.append('stock',       nuevoStock || '0');
        form.append('categoria',   nuevoCat);
        form.append('marca',       nuevoMarca);
        form.append('estado',      nuevoEstado);
        form.append('imagen', {
          uri:  nuevoImagen.uri,
          name: nuevoImagen.name,
          type: nuevoImagen.type,
        } as any);
        body = form;
        // No añadir Content-Type — el navegador/RN lo pone automáticamente con el boundary
      } else {
        // Sin imagen: JSON normal
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          nombre: nuevoNombre, descripcion: nuevoDesc,
          precio: parseFloat(nuevoPrecio), stock: parseInt(nuevoStock) || 0,
          categoria: nuevoCat, marca: nuevoMarca, estado: nuevoEstado,
        });
      }

      const res  = await fetch(`${API_URL}/productos`, { method: 'POST', headers, body });
      const data = await res.json();

      if (!res.ok) { showAlert('error', 'Error', data.error || 'Error al crear'); return; }

      setProductos(prev => [data.producto, ...prev]);
      setShowNuevo(false);
      // Reset form
      setNuevoNombre(''); setNuevoDesc(''); setNuevoPrecio('');
      setNuevoStock(''); setNuevoCat('Facial'); setNuevoMarca('');
      setNuevoEstado('disponible'); setNuevoImagen(null);
      showAlert('success', '¡Creado!', 'El producto se ha creado correctamente.');
    } catch { showAlert('error', 'Error', 'Error de conexión'); }
    finally { setGuardando(false); }
  };

  // ── Acciones citas ────────────────────────────────────────────────────────
  const actualizarEstadoCita = async (id: string, estado: string) => {
    try {
      const res = await fetch(`${API_URL}/citas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, estado }),
      });
      if (res.ok) setCitas(prev => prev.map(c => c.id === id ? { ...c, estado } : c));
    } catch { showAlert('error', 'Error', 'No se pudo actualizar la cita'); }
  };

  const eliminarCitaAdmin = (id: string) => showConfirm(
    'Eliminar cita',
    '¿Seguro que quieres eliminar esta cita? Esta acción no se puede deshacer.',
    async () => {
      try {
        const res = await fetch(`${API_URL}/citas/cancelar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id }),
        });
        if (res.ok) setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: 'cancelada' } : c));
        else { const d = await res.json(); showAlert('error', 'Error', d.error || 'No se pudo eliminar'); }
      } catch { showAlert('error', 'Error', 'Error de conexión'); }
    }
  );

  // ── Acciones reservas ─────────────────────────────────────────────────────
  const actualizarEstadoReserva = async (id: string, estado: string) => {
    try {
      const res = await fetch(`${API_URL}/reservas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, estado }),
      });
      if (res.ok) setReservas(prev => prev.map(r => r.id === id ? { ...r, estado } : r));
    } catch { showAlert('error', 'Error', 'No se pudo actualizar la reserva'); }
  };

  // ── Acciones productos ────────────────────────────────────────────────────
  const actualizarEstadoProducto = async (id: string, estado: string) => {
    try {
      const res = await fetch(`${API_URL}/productos`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, estado }),
      });
      if (res.ok) setProductos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
      else showAlert('error', 'Error', 'No se pudo actualizar el estado');
    } catch { showAlert('error', 'Error', 'Error de conexión'); }
  };

  const eliminarProducto = (id: string, nombre: string) => showConfirm(
    'Eliminar producto',
    `¿Seguro que quieres eliminar "${nombre}"? Si tiene reservas asociadas no podrá eliminarse — en ese caso márcalo como sin stock.`,
    async () => {
      try {
        const res = await fetch(`${API_URL}/productos`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          setProductos(prev => prev.filter(p => p.id !== id));
          showAlert('success', 'Eliminado', 'El producto se ha eliminado correctamente.');
        } else {
          const data = await res.json();
          const tieneReservas =
            data.error?.includes('foreign key') ||
            data.error?.includes('reservas_productos') ||
            data.code === '23503';
          showAlert('error', tieneReservas ? 'No se puede eliminar' : 'Error',
            tieneReservas
              ? 'Este producto tiene reservas asociadas. Márcalo como "sin stock" para que no aparezca disponible.'
              : data.error || 'No se pudo eliminar el producto');
        }
      } catch { showAlert('error', 'Error de conexión', 'No se pudo conectar con el servidor.'); }
    }
  );

  const estadoCitaColor    = (e: string) => ({ confirmada:'#E8F5E9', completada:'#E3F2FD', cancelada:'#FBF5F6' }[e] ?? '#FFF9E6');
  const estadoReservaColor = (e: string) => ({ lista:'#E8F5E9', recogida:'#E3F2FD', cancelada:'#FBF5F6' }[e] ?? '#FFF9E6');

  if (!usuario || !isAdmin) return (
    <View style={s.screen}><NavBar />
      <View style={s.centrado}><Text style={s.noAccesoText}>Acceso restringido a administradores</Text></View>
    </View>
  );

  // ── Datos filtrados ───────────────────────────────────────────────────────
  const citasFiltradas = citas.filter(c => {
    const matchEstado = filtroCita === 'todos' || c.estado === filtroCita;
    const matchBusq   = !busquedaCita ||
      c.servicios?.nombre?.toLowerCase().includes(busquedaCita.toLowerCase()) ||
      c.perfiles?.nombre?.toLowerCase().includes(busquedaCita.toLowerCase()) ||
      c.perfiles?.apellidos?.toLowerCase().includes(busquedaCita.toLowerCase());
    return matchEstado && matchBusq;
  });

  const reservasFiltradas = reservas.filter(r => {
    const matchEstado = filtroReserva === 'todos' || r.estado === filtroReserva;
    const matchBusq   = !busquedaReserva ||
      r.productos?.nombre?.toLowerCase().includes(busquedaReserva.toLowerCase()) ||
      r.perfiles?.nombre?.toLowerCase().includes(busquedaReserva.toLowerCase()) ||
      r.perfiles?.apellidos?.toLowerCase().includes(busquedaReserva.toLowerCase());
    return matchEstado && matchBusq;
  });

  const productosFiltrados = productos.filter(p => {
    const matchCat  = filtroProductoCat === 'todos' || p.categoria === filtroProductoCat;
    const matchEst  = filtroProductoEst === 'todos' || p.estado === filtroProductoEst;
    const matchBusq = !busquedaProducto ||
      p.nombre?.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
      p.marca?.toLowerCase().includes(busquedaProducto.toLowerCase());
    return matchCat && matchEst && matchBusq;
  });

  const citasPagina     = citasFiltradas.slice((citaPage - 1) * PAGE_SIZE, citaPage * PAGE_SIZE);
  const reservasPagina  = reservasFiltradas.slice((reservaPage - 1) * PAGE_SIZE, reservaPage * PAGE_SIZE);
  const productosPagina = productosFiltrados.slice((productoPage - 1) * PAGE_SIZE, productoPage * PAGE_SIZE);

  // ── Subcomponentes inline ─────────────────────────────────────────────────
  const FiltroRow = ({ opciones, valor, onChange }: {
    opciones: string[]; valor: string; onChange: (v: string) => void;
  }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtroRow}>
      {['todos', ...opciones].map(op => (
        <TouchableOpacity key={op} style={[s.filtroPill, valor === op && s.filtroPillActive]} onPress={() => onChange(op)}>
          <Text style={[s.filtroPillText, valor === op && s.filtroPillTextActive]}>{op}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const BusquedaInput = ({ value, onChange, placeholder }: {
    value: string; onChange: (v: string) => void; placeholder: string;
  }) => (
    <View style={s.busquedaWrapper}>
      <MaterialIcons name="search" size={16} color={MUTED} />
      <TextInput style={s.busquedaInput} value={value} onChangeText={onChange}
        placeholder={placeholder} placeholderTextColor={MUTED} />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange('')}>
          <MaterialIcons name="close" size={16} color={MUTED} />
        </TouchableOpacity>
      )}
    </View>
  );

  // ── Render citas ──────────────────────────────────────────────────────────
  const renderCitas = () => (
    <>
      <BusquedaInput value={busquedaCita} onChange={setBusquedaCita} placeholder="Buscar por servicio o cliente..." />
      <FiltroRow opciones={ESTADOS_CITA} valor={filtroCita} onChange={setFiltroCita} />
      <Text style={s.resultCount}>{citasFiltradas.length} citas</Text>
      {loadingCitas ? <ActivityIndicator color={BURGUNDY} style={{ marginTop: 40 }} /> :
        citasPagina.length === 0 ? <View style={s.emptyBox}><Text style={s.emptyText}>No hay citas</Text></View> : (
        <>
          {citasPagina.map(cita => (
            <View key={cita.id} style={[s.itemCard, { backgroundColor: estadoCitaColor(cita.estado) }]}>
              <View style={s.itemHeader}>
                <Text style={s.itemTitle}>{cita.servicios?.nombre ?? 'Servicio'}</Text>
                <Text style={s.itemEstado}>{cita.estado}</Text>
              </View>
              <Text style={s.itemMeta}>Fecha: {cita.fecha} · {cita.hora.substring(0,5)}h</Text>
              {cita.perfiles && <View style={s.clienteBox}>
                <Text style={s.clienteLabel}>Cliente:</Text>
                <Text style={s.clienteNombre}>{cita.perfiles.nombre} {cita.perfiles.apellidos}</Text>
              </View>}
              {cita.estado === 'cancelada' && cita.cancelador && <View style={s.canceladoBox}>
                <Text style={s.canceladoLabel}>Cancelado por:</Text>
                <Text style={s.canceladoNombre}>{cita.cancelador.nombre} {cita.cancelador.apellidos}</Text>
              </View>}
              {cita.aclaracion ? <Text style={s.itemNota}>Nota: {cita.aclaracion}</Text> : null}
              <View style={s.accionesRow}>
                {ESTADOS_CITA.map(est => (
                  <TouchableOpacity key={est} style={[s.estadoBtn, cita.estado === est && s.estadoBtnActive]}
                    onPress={() => actualizarEstadoCita(cita.id, est)}>
                    <Text style={[s.estadoBtnText, cita.estado === est && s.estadoBtnTextActive]}>{est}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={s.eliminarBtn} onPress={() => eliminarCitaAdmin(cita.id)}>
                  <Text style={s.eliminarBtnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <Pagination totalItems={citasFiltradas.length} pageSize={PAGE_SIZE} currentPage={citaPage} onPageChange={setCitaPage} />
        </>
      )}
    </>
  );

  // ── Render reservas ───────────────────────────────────────────────────────
  const renderReservas = () => (
    <>
      <BusquedaInput value={busquedaReserva} onChange={setBusquedaReserva} placeholder="Buscar por producto o cliente..." />
      <FiltroRow opciones={ESTADOS_RESERVA} valor={filtroReserva} onChange={setFiltroReserva} />
      <Text style={s.resultCount}>{reservasFiltradas.length} reservas</Text>
      {loadingReservas ? <ActivityIndicator color={BURGUNDY} style={{ marginTop: 40 }} /> :
        reservasPagina.length === 0 ? <View style={s.emptyBox}><Text style={s.emptyText}>No hay reservas</Text></View> : (
        <>
          {reservasPagina.map(reserva => (
            <View key={reserva.id} style={[s.itemCard, { backgroundColor: estadoReservaColor(reserva.estado) }]}>
              <View style={s.itemHeader}>
                <Text style={s.itemTitle}>{reserva.productos?.nombre ?? 'Producto'}</Text>
                <Text style={s.itemEstado}>{reserva.estado}</Text>
              </View>
              <Text style={s.itemMeta}>Recogida: {reserva.dia_recogida} · {reserva.hora_recogida}h</Text>
              {reserva.perfiles && <View style={s.clienteBox}>
                <Text style={s.clienteLabel}>Cliente:</Text>
                <Text style={s.clienteNombre}>{reserva.perfiles.nombre} {reserva.perfiles.apellidos}</Text>
              </View>}
              {reserva.nota ? <Text style={s.itemNota}>Nota: {reserva.nota}</Text> : null}
              <View style={s.accionesRow}>
                {ESTADOS_RESERVA.map(est => (
                  <TouchableOpacity key={est} style={[s.estadoBtn, reserva.estado === est && s.estadoBtnActive]}
                    onPress={() => actualizarEstadoReserva(reserva.id, est)}>
                    <Text style={[s.estadoBtnText, reserva.estado === est && s.estadoBtnTextActive]}>{est}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <Pagination totalItems={reservasFiltradas.length} pageSize={PAGE_SIZE} currentPage={reservaPage} onPageChange={setReservaPage} />
        </>
      )}
    </>
  );

  // ── Render productos ──────────────────────────────────────────────────────
  const renderProductos = () => (
    <>
      <TouchableOpacity style={s.nuevoBtn} onPress={() => setShowNuevo(!showNuevo)}>
        <View style={s.nuevoBtnContent}>
          <MaterialIcons name={showNuevo ? 'close' : 'add'} size={18} color="#FFF" />
          <Text style={[s.nuevoBtnText, { marginLeft: 8 }]}>{showNuevo ? 'Cerrar' : 'Nuevo producto'}</Text>
        </View>
      </TouchableOpacity>

      {showNuevo && (
        <View style={s.nuevoCard}>
          <Text style={s.nuevoTitle}>Nuevo producto</Text>

          {/* ── Selector de imagen ── */}
          <Text style={s.fieldLabel}>Foto del producto</Text>
          <TouchableOpacity style={s.imagePicker} onPress={seleccionarImagen}>
            {nuevoImagen ? (
              <Image source={{ uri: nuevoImagen.uri }} style={s.imagePreview} resizeMode="cover" />
            ) : (
              <View style={s.imagePlaceholder}>
                <MaterialIcons name="add-photo-alternate" size={32} color={MUTED} />
                <Text style={s.imagePlaceholderText}>Toca para añadir foto</Text>
              </View>
            )}
          </TouchableOpacity>
          {nuevoImagen && (
            <TouchableOpacity style={s.imageRemoveBtn} onPress={() => setNuevoImagen(null)}>
              <Text style={s.imageRemoveText}>Quitar foto</Text>
            </TouchableOpacity>
          )}

          <Text style={s.fieldLabel}>Nombre *</Text>
          <TextInput style={s.fieldInput} value={nuevoNombre} onChangeText={setNuevoNombre} placeholder="Nombre" placeholderTextColor={MUTED} />

          <Text style={s.fieldLabel}>Descripción</Text>
          <TextInput style={[s.fieldInput, { minHeight: 60, textAlignVertical: 'top' }]}
            value={nuevoDesc} onChangeText={setNuevoDesc} placeholder="Descripción" placeholderTextColor={MUTED} multiline />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.fieldLabel}>Precio (€) *</Text>
              <TextInput style={s.fieldInput} value={nuevoPrecio} onChangeText={setNuevoPrecio}
                placeholder="0.00" placeholderTextColor={MUTED} keyboardType="decimal-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.fieldLabel}>Stock</Text>
              <TextInput style={s.fieldInput} value={nuevoStock} onChangeText={setNuevoStock}
                placeholder="0" placeholderTextColor={MUTED} keyboardType="number-pad" />
            </View>
          </View>

          <Text style={s.fieldLabel}>Marca</Text>
          <TextInput style={s.fieldInput} value={nuevoMarca} onChangeText={setNuevoMarca} placeholder="Marca" placeholderTextColor={MUTED} />

          <Text style={s.fieldLabel}>Categoría</Text>
          <View style={s.opcionesRow}>
            {CATEGORIAS_P.map(cat => (
              <TouchableOpacity key={cat} style={[s.opcionBtn, nuevoCat === cat && s.opcionBtnActive]} onPress={() => setNuevoCat(cat)}>
                <Text style={[s.opcionBtnText, nuevoCat === cat && s.opcionBtnTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.fieldLabel}>Estado</Text>
          <View style={s.opcionesRow}>
            {ESTADOS_P.map(est => (
              <TouchableOpacity key={est} style={[s.opcionBtn, nuevoEstado === est && s.opcionBtnActive]} onPress={() => setNuevoEstado(est)}>
                <Text style={[s.opcionBtnText, nuevoEstado === est && s.opcionBtnTextActive]}>{est}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[s.guardarBtn, guardando && s.guardarBtnDisabled]} onPress={crearProducto} disabled={guardando}>
            {guardando ? <ActivityIndicator color="#FFF" /> : <Text style={s.guardarBtnText}>CREAR PRODUCTO</Text>}
          </TouchableOpacity>
        </View>
      )}

      <BusquedaInput value={busquedaProducto} onChange={setBusquedaProducto} placeholder="Buscar por nombre o marca..." />
      <Text style={s.filtroSectionLabel}>Categoría</Text>
      <FiltroRow opciones={CATEGORIAS_P} valor={filtroProductoCat} onChange={setFiltroProductoCat} />
      <Text style={s.filtroSectionLabel}>Estado</Text>
      <FiltroRow opciones={ESTADOS_P} valor={filtroProductoEst} onChange={setFiltroProductoEst} />
      <Text style={s.resultCount}>{productosFiltrados.length} productos</Text>

      {loadingProductos ? <ActivityIndicator color={BURGUNDY} style={{ marginTop: 40 }} /> :
        productosPagina.length === 0 ? <View style={s.emptyBox}><Text style={s.emptyText}>No hay productos</Text></View> : (
        <>
          {productosPagina.map(producto => (
            <View key={producto.id} style={s.itemCard}>
              <View style={s.itemHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  {producto.imagen_url ? (
                    <Image source={{ uri: producto.imagen_url }} style={s.itemThumb} resizeMode="cover" />
                  ) : (
                    <View style={[s.itemThumb, s.itemThumbPlaceholder]}>
                      <MaterialIcons name="image" size={18} color={MUTED} />
                    </View>
                  )}
                  <Text style={[s.itemTitle, { flex: 1 }]}>{producto.nombre}</Text>
                </View>
                <Text style={s.itemPrecio}>{producto.precio}€</Text>
              </View>
              <Text style={s.itemMeta}>{producto.categoria} · Stock: {producto.stock} · {producto.estado}</Text>
              {producto.marca ? <Text style={s.itemMeta}>Marca: {producto.marca}</Text> : null}
              {producto.descripcion ? <Text style={s.itemNota}>{producto.descripcion}</Text> : null}
              <View style={s.accionesRow}>
                {producto.estado !== 'sin_stock' && (
                  <TouchableOpacity style={s.sinStockBtn} onPress={() => actualizarEstadoProducto(producto.id, 'sin_stock')}>
                    <Text style={s.sinStockBtnText}>Sin stock</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={s.eliminarBtn} onPress={() => eliminarProducto(producto.id, producto.nombre)}>
                  <Text style={s.eliminarBtnText}>Eliminar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.estadoBtn} onPress={() => router.push({
                  pathname: '/admin/editar-producto',
                  params: {
                    id: producto.id, nombre: producto.nombre,
                    descripcion: producto.descripcion ?? '',
                    precio: String(producto.precio), stock: String(producto.stock),
                    categoria: producto.categoria ?? 'Facial',
                    marca: producto.marca ?? '', estado: producto.estado ?? 'disponible',
                  },
                })}>
                  <Text style={s.estadoBtnText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <Pagination totalItems={productosFiltrados.length} pageSize={PAGE_SIZE} currentPage={productoPage} onPageChange={setProductoPage} />
        </>
      )}
    </>
  );

  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[s.container, isDesktop && s.containerDesktop]}>
          <Text style={s.pageTitle}>Panel de Administración</Text>
          <View style={s.tabsRow}>
            {(['citas', 'reservas', 'productos'] as Tab[]).map(t => (
              <TouchableOpacity key={t} style={[s.tabBtn, tab === t && s.tabBtnActive]} onPress={() => setTab(t)}>
                <Text style={[s.tabBtnText, tab === t && s.tabBtnTextActive]}>{t.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {tab === 'citas'     && renderCitas()}
          {tab === 'reservas'  && renderReservas()}
          {tab === 'productos' && renderProductos()}
        </View>
        <Footer />
      </ScrollView>

      <ConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Sí, continuar"
        cancelText="Cancelar"
        isDangerous
        onConfirm={async () => {
          setConfirmModal(m => ({ ...m, visible: false }));
          await confirmModal.onConfirm();
        }}
        onCancel={() => setConfirmModal(m => ({ ...m, visible: false }))}
      />
      <AlertModal
        visible={alertModal.visible}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() => setAlertModal(m => ({ ...m, visible: false }))}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen:           { flex: 1, backgroundColor: CREAM },
  scroll:           { flex: 1 },
  scrollContent:    { flexGrow: 1, justifyContent: 'space-between', paddingBottom: 40 },
  container:        { paddingHorizontal: 16, paddingTop: 24 },
  containerDesktop: { maxWidth: 1000, alignSelf: 'center', paddingHorizontal: 40 },

  centrado:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  noAccesoText: { fontSize: 16, color: MUTED, textAlign: 'center' },
  pageTitle:    { fontSize: 24, fontWeight: '700', color: '#2C2A22', marginBottom: 20 },

  tabsRow:          { flexDirection: 'row', gap: 8, marginBottom: 24 },
  tabBtn:           { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 0.5, borderColor: BORDER, alignItems: 'center', backgroundColor: '#FFF' },
  tabBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  tabBtnText:       { fontSize: 12, color: '#555', fontWeight: '600', letterSpacing: 0.5 },
  tabBtnTextActive: { color: '#FFF' },

  busquedaWrapper:  { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 0.5, borderColor: BORDER, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: '#FFF', marginBottom: 10 },
  busquedaInput:    { flex: 1, fontSize: 13, color: '#2C2A22' },

  filtroRow:            { gap: 8, paddingVertical: 2, marginBottom: 10 },
  filtroPill:           { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5, borderColor: BORDER, backgroundColor: '#FFF' },
  filtroPillActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  filtroPillText:       { fontSize: 12, color: '#555' },
  filtroPillTextActive: { color: '#FFF', fontWeight: '600' },
  filtroSectionLabel:   { fontSize: 10, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '600', marginBottom: 4, marginTop: 4 },
  resultCount:          { fontSize: 12, color: MUTED, marginBottom: 12 },

  itemCard:        { borderRadius: 10, borderWidth: 0.5, borderColor: BORDER, padding: 14, marginBottom: 12, gap: 6, backgroundColor: '#FFF' },
  itemHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle:       { fontSize: 14, fontWeight: '700', color: '#2C2A22' },
  itemEstado:      { fontSize: 11, color: MUTED, fontWeight: '600', textTransform: 'uppercase' },
  itemPrecio:      { fontSize: 14, fontWeight: '700', color: BURGUNDY },
  itemMeta:        { fontSize: 12, color: MUTED },
  itemNota:        { fontSize: 12, color: '#555', fontStyle: 'italic' },
  itemThumb:       { width: 40, height: 40, borderRadius: 6, overflow: 'hidden' },
  itemThumbPlaceholder: { backgroundColor: '#F0EBE1', alignItems: 'center', justifyContent: 'center' },

  clienteBox:      { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(99,32,44,0.06)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  clienteLabel:    { fontSize: 11, color: MUTED, fontWeight: '600' },
  clienteNombre:   { fontSize: 12, color: BURGUNDY, fontWeight: '600' },
  canceladoBox:    { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FBF5F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 0.5, borderColor: '#E8C4C8' },
  canceladoLabel:  { fontSize: 11, color: MUTED, fontWeight: '600' },
  canceladoNombre: { fontSize: 12, color: BURGUNDY, fontWeight: '700' },

  accionesRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  estadoBtn:           { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderWidth: 0.5, borderColor: BORDER, backgroundColor: '#FFF' },
  estadoBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  estadoBtnText:       { fontSize: 11, color: '#555' },
  estadoBtnTextActive: { color: '#FFF', fontWeight: '600' },
  sinStockBtn:         { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderWidth: 0.5, borderColor: MUTED, backgroundColor: '#F5F0E8' },
  sinStockBtnText:     { fontSize: 11, color: MUTED, fontWeight: '600' },
  eliminarBtn:         { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderWidth: 0.5, borderColor: BURGUNDY, backgroundColor: '#FBF5F6' },
  eliminarBtnText:     { fontSize: 11, color: BURGUNDY, fontWeight: '600' },

  emptyBox:  { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: MUTED },

  nuevoBtn:        { backgroundColor: BURGUNDY, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 16 },
  nuevoBtnContent: { flexDirection: 'row', alignItems: 'center' },
  nuevoBtnText:    { color: '#FFF', fontSize: 13, fontWeight: '700' },
  nuevoCard:       { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: BORDER, padding: 16, marginBottom: 20, gap: 8 },
  nuevoTitle:      { fontSize: 16, fontWeight: '700', color: '#2C2A22', marginBottom: 4 },

  // ── Image picker ──────────────────────────────────────────────────────────
  imagePicker: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    borderStyle: 'dashed',
    overflow: 'hidden',
    height: 140,
  },
  imagePreview: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FAFAF7',
  },
  imagePlaceholderText: { fontSize: 13, color: MUTED },
  imageRemoveBtn:  { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 2 },
  imageRemoveText: { fontSize: 12, color: BURGUNDY, fontWeight: '600' },

  fieldLabel: { fontSize: 11, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '600' },
  fieldInput: { borderWidth: 0.5, borderColor: BORDER, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#2C2A22', backgroundColor: '#FAFAF7' },

  opcionesRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcionBtn:           { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5, borderColor: BORDER, backgroundColor: '#FAFAF7' },
  opcionBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  opcionBtnText:       { fontSize: 12, color: '#555' },
  opcionBtnTextActive: { fontSize: 12, color: '#FFF', fontWeight: '600' },

  guardarBtn:         { backgroundColor: BURGUNDY, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  guardarBtnDisabled: { backgroundColor: BORDER },
  guardarBtnText:     { color: '#FFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.8 },
});
