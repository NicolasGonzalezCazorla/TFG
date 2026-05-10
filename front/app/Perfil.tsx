import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  useWindowDimensions, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Pagination from '../components/Pagination';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';
import ConfirmModal from '../components/ConfirmModal';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants';

const BREAKPOINT = 768;
const BURGUNDY   = '#63202C';
const CREAM      = '#F5F0E8';
const BORDER     = '#C4B89A';
const MUTED      = '#9A8E7A';
const GOLD       = '#C6A75E';

type Reserva = {
  id: string; dia_recogida: string; hora_recogida: string;
  estado: string; nota: string;
  productos: { nombre: string; precio: number; imagen_url: string | null };
};
type Cita = {
  id: string; fecha: string; hora: string;
  estado: string; aclaracion: string;
  servicios: { nombre: string; precio: number };
};

const PRODUCT_IMAGE = { uri: 'https://picsum.photos/seed/lipstick/300/300' };

export default function Perfil() {
  const { width }  = useWindowDimensions();
  const isDesktop  = width >= BREAKPOINT;
  const router     = useRouter();
  const { usuario, token, logout } = useAuth();

  const [reservas,         setReservas]         = useState<Reserva[]>([]);
  const [loadingReservas,  setLoadingReservas]  = useState(true);
  const [citas,            setCitas]            = useState<Cita[]>([]);
  const [loadingCitas,     setLoadingCitas]     = useState(true);
  const [cancelando,       setCancelando]       = useState<string | null>(null);
  const [reservaPage,      setReservaPage]      = useState(1);
  const [citaPage,         setCitaPage]         = useState(1);

  // Modales
  const [showModalLogout,  setShowModalLogout]  = useState(false);
  const [showModalCita,    setShowModalCita]    = useState(false);
  const [showModalReserva, setShowModalReserva] = useState(false);
  const [itemToCancel,     setItemToCancel]     = useState<{ id: string; nombre: string } | null>(null);

  const PAGE_SIZE = 4;

  useEffect(() => {
    if (!token) return;
    cargarReservas();
    cargarCitas();
  }, [token]);

  useEffect(() => { setReservaPage(1); }, [reservas]);
  useEffect(() => { setCitaPage(1); }, [citas]);

  const cargarReservas = async () => {
    try {
      setLoadingReservas(true);
      const res  = await fetch(`${API_URL}/reservas`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setReservas(data.reservas ?? []);
    } catch (e) { console.error(e); }
    finally { setLoadingReservas(false); }
  };

  const cargarCitas = async () => {
    try {
      setLoadingCitas(true);
      const res  = await fetch(`${API_URL}/citas`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setCitas((data.citas ?? []).filter((c: Cita) => c.estado !== 'cancelada'));
    } catch (e) { console.error(e); }
    finally { setLoadingCitas(false); }
  };

  const puedesCancelar = (cita: Cita): boolean => {
    if (cita.estado === 'cancelada' || cita.estado === 'completada') return false;
    const diff = (new Date(`${cita.fecha}T${cita.hora}`).getTime() - Date.now()) / 3600000;
    return diff >= 24;
  };

  const reservasPagina = reservas.slice((reservaPage - 1) * PAGE_SIZE, reservaPage * PAGE_SIZE);
  const citasPagina    = citas.slice((citaPage - 1) * PAGE_SIZE, citaPage * PAGE_SIZE);

  // ── Logout ────────────────────────────────────────────────────────────────
  const confirmLogout = async () => {
    setShowModalLogout(false);
    await logout();
    router.replace('/');
  };

  // ── Citas ─────────────────────────────────────────────────────────────────
  const handleCancelarCita = (cita: Cita) => {
    setItemToCancel({ id: cita.id, nombre: cita.servicios?.nombre || 'cita' });
    setShowModalCita(true);
  };

  const confirmCancelarCita = async () => {
    if (!itemToCancel) return;
    setShowModalCita(false);
    try {
      setCancelando(itemToCancel.id);
      const res  = await fetch(`${API_URL}/citas/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: itemToCancel.id }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'No se pudo cancelar la cita'); return; }
      setCitas(prev => prev.filter(c => c.id !== itemToCancel.id));
    } catch { alert('Error de conexión'); }
    finally { setCancelando(null); setItemToCancel(null); }
  };

  // ── Reservas ──────────────────────────────────────────────────────────────
  const handleCancelarReserva = (reserva: Reserva) => {
    setItemToCancel({ id: reserva.id, nombre: reserva.productos?.nombre || 'producto' });
    setShowModalReserva(true);
  };

  const confirmCancelarReserva = async () => {
    if (!itemToCancel) return;
    setShowModalReserva(false);
    try {
      const res  = await fetch(`${API_URL}/reservas/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: itemToCancel.id }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'No se pudo cancelar la reserva'); return; }
      setReservas(prev => prev.filter(r => r.id !== itemToCancel.id));
    } catch { alert('Error de conexión'); }
    finally { setItemToCancel(null); }
  };

  // ── Sin sesión ────────────────────────────────────────────────────────────
  if (!usuario) {
    return (
      <View style={s.screen}>
        <NavBar />
        <View style={s.centrado}>
          <Text style={s.noSesionText}>Debes iniciar sesión para ver tu perfil</Text>
          <TouchableOpacity style={s.loginBtn} onPress={() => router.push('/login')}>
            <Text style={s.loginBtnText}>IR AL LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[s.container, isDesktop && s.containerDesktop]}>

          {/* Perfil */}
          <View style={[s.profileCard, isDesktop && s.profileCardDesktop]}>
            <View style={s.avatarWrapper}>
              <Image source={require('../assets/images/Logo.png')} style={s.avatar} />
              <View style={s.avatarRing} />
            </View>
            <View style={s.profileInfo}>
              <View style={s.infoRow}><Text style={s.infoLabel}>Nombre:</Text><Text style={s.infoValue}>{usuario.nombre ?? '-'}</Text></View>
              <View style={s.infoRow}><Text style={s.infoLabel}>Apellidos:</Text><Text style={s.infoValue}>{usuario.apellidos ?? '-'}</Text></View>
              <View style={s.infoRow}><Text style={s.infoLabel}>Email:</Text><Text style={s.infoValue}>{usuario.email}</Text></View>
              <View style={s.infoRow}><Text style={s.infoLabel}>Rol:</Text><Text style={[s.infoValue, { color: BURGUNDY }]}>{usuario.rol}</Text></View>
            </View>
            <View style={s.profileActions}>
              <TouchableOpacity style={s.serviciosBtn} onPress={() => router.push('/servicio')}>
                <Text style={s.serviciosBtnText}>SERVICIOS</Text>
              </TouchableOpacity>
              {/* Logout → abre modal de confirmación */}
              <TouchableOpacity style={s.logoutBtn} onPress={() => setShowModalLogout(true)}>
                <Text style={s.logoutBtnText}>CERRAR SESIÓN</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Productos reservados */}
          <Text style={s.sectionTitle}>Productos reservados</Text>
          {loadingReservas ? (
            <ActivityIndicator color={BURGUNDY} style={{ marginTop: 20 }} />
          ) : reservas.length === 0 ? (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>No tienes productos reservados</Text>
              <TouchableOpacity style={s.serviciosBtn} onPress={() => router.push('/productos')}>
                <Text style={s.serviciosBtnText}>VER PRODUCTOS</Text>
              </TouchableOpacity>
            </View>
          ) : (
            reservasPagina.map(reserva => (
              <View key={reserva.id} style={s.reservaCard}>
                <Image
                  source={reserva.productos?.imagen_url ? { uri: reserva.productos.imagen_url } : PRODUCT_IMAGE}
                  style={s.reservaImage} resizeMode="cover"
                />
                <View style={s.reservaInfo}>
                  <Text style={s.reservaNombre}>{reserva.productos?.nombre ?? 'Producto'}</Text>
                  <Text style={s.reservaMeta}>Recogida: {reserva.dia_recogida} · {reserva.hora_recogida}h</Text>
                  <Text style={s.reservaMeta}>Estado: {reserva.estado}</Text>
                  {reserva.nota ? <Text style={s.reservaDesc}>{reserva.nota}</Text> : null}
                  {reserva.estado !== 'recogida' && reserva.estado !== 'cancelada' && (
                    <TouchableOpacity style={s.cancelarBtn} onPress={() => handleCancelarReserva(reserva)}>
                      <Text style={s.cancelarBtnText}>Cancelar reserva</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={[s.estadoBadge, reserva.estado === 'recogida' && s.estadoBadgeOk]}>
                  <MaterialIcons name={reserva.estado === 'recogida' ? 'check' : 'access-time'} size={18} color="#2C2A22" />
                </View>
              </View>
            ))
          )}
          <Pagination totalItems={reservas.length} pageSize={PAGE_SIZE} currentPage={reservaPage} onPageChange={setReservaPage} />

          {/* Citas */}
          <Text style={[s.sectionTitle, { marginTop: 32 }]}>Mis citas</Text>
          {loadingCitas ? (
            <ActivityIndicator color={BURGUNDY} style={{ marginTop: 20 }} />
          ) : citas.length === 0 ? (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>No tienes citas reservadas</Text>
              <TouchableOpacity style={s.serviciosBtn} onPress={() => router.push('/reserva')}>
                <Text style={s.serviciosBtnText}>RESERVAR CITA</Text>
              </TouchableOpacity>
            </View>
          ) : (
            citasPagina.map(cita => {
              const cancelable  = puedesCancelar(cita);
              const isCancelada = cita.estado === 'cancelada';
              return (
                <View key={cita.id} style={[s.reservaCard, isCancelada && s.reservaCardCancelada]}>
                  <View style={s.citaIconBox}>
                    <MaterialIcons name="event" size={32} color={BURGUNDY} />
                  </View>
                  <View style={s.reservaInfo}>
                    <Text style={s.reservaNombre}>{cita.servicios?.nombre ?? 'Servicio'}</Text>
                    <Text style={s.reservaMeta}>Fecha: {cita.fecha} · {cita.hora.substring(0, 5)}h</Text>
                    <Text style={[s.reservaMeta, isCancelada && { color: BURGUNDY }]}>Estado: {cita.estado}</Text>
                    {cita.aclaracion ? <Text style={s.reservaDesc}>{cita.aclaracion}</Text> : null}
                    {cancelable && (
                      <TouchableOpacity style={s.cancelarBtn} onPress={() => handleCancelarCita(cita)} disabled={cancelando === cita.id}>
                        {cancelando === cita.id
                          ? <ActivityIndicator color={BURGUNDY} size="small" />
                          : <Text style={s.cancelarBtnText}>Cancelar cita</Text>
                        }
                      </TouchableOpacity>
                    )}
                    {!cancelable && !isCancelada && cita.estado !== 'completada' && (
                      <Text style={s.noCancelarText}>No cancelable — menos de 24h</Text>
                    )}
                  </View>
                  <View style={[s.estadoBadge, cita.estado === 'completada' && s.estadoBadgeOk, isCancelada && s.estadoBadgeCancelada]}>
                    <MaterialIcons
                      name={cita.estado === 'completada' ? 'check' : isCancelada ? 'close' : 'access-time'}
                      size={18} color="#2C2A22"
                    />
                  </View>
                </View>
              );
            })
          )}
          <Pagination totalItems={citas.length} pageSize={PAGE_SIZE} currentPage={citaPage} onPageChange={setCitaPage} />

        </View>
        <Footer />
      </ScrollView>

      {/* Modal: cerrar sesión */}
      <ConfirmModal
        visible={showModalLogout}
        title="Cerrar sesión"
        message={`¿Seguro que quieres cerrar la sesión, ${usuario.nombre ?? 'usuario'}?`}
        confirmText="Sí, salir"
        cancelText="Quedarme"
        isDangerous={false}
        onConfirm={confirmLogout}
        onCancel={() => setShowModalLogout(false)}
      />

      {/* Modal: cancelar cita */}
      <ConfirmModal
        visible={showModalCita}
        title="Cancelar cita"
        message={`¿Seguro que quieres cancelar la cita de "${itemToCancel?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, cancelar"
        cancelText="Volver"
        isDangerous
        onConfirm={confirmCancelarCita}
        onCancel={() => { setShowModalCita(false); setItemToCancel(null); }}
      />

      {/* Modal: cancelar reserva */}
      <ConfirmModal
        visible={showModalReserva}
        title="Cancelar reserva"
        message={`¿Seguro que quieres cancelar la reserva de "${itemToCancel?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, cancelar"
        cancelText="Volver"
        isDangerous
        onConfirm={confirmCancelarReserva}
        onCancel={() => { setShowModalReserva(false); setItemToCancel(null); }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen:           { flex: 1, backgroundColor: CREAM },
  scroll:           { flex: 1 },
  scrollContent:    { flexGrow: 1, justifyContent: 'space-between', paddingBottom: 40 },
  container:        { paddingHorizontal: 16, paddingTop: 24 },
  containerDesktop: { maxWidth: 900, alignSelf: 'center', paddingHorizontal: 40 },

  centrado:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  noSesionText: { fontSize: 16, color: MUTED, textAlign: 'center' },

  profileCard:        { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: BORDER, padding: 20, marginBottom: 32, flexDirection: 'column', gap: 16 },
  profileCardDesktop: { flexDirection: 'row', alignItems: 'center', gap: 24 },

  avatarWrapper: { alignSelf: 'center', position: 'relative', width: 90, height: 90 },
  avatar:        { width: 90, height: 90, borderRadius: 45, resizeMode: 'contain' },
  avatarRing:    { position: 'absolute', top: -4, left: -4, width: 98, height: 98, borderRadius: 49, borderWidth: 1.5, borderColor: GOLD },

  profileInfo:      { flex: 1, gap: 6 },
  infoRow:          { flexDirection: 'row', gap: 8, alignItems: 'center' },
  infoLabel:        { fontSize: 13, color: MUTED, minWidth: 72 },
  infoValue:        { fontSize: 13, color: '#2C2A22', fontWeight: '500' },

  profileActions:   { flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  serviciosBtn:     { borderWidth: 0.5, borderColor: BORDER, borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 },
  serviciosBtnText: { fontSize: 12, color: BURGUNDY, fontWeight: '600', letterSpacing: 0.8 },
  logoutBtn:        { borderWidth: 0.5, borderColor: BURGUNDY, borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 },
  logoutBtnText:    { fontSize: 12, color: BURGUNDY, fontWeight: '600', letterSpacing: 0.8 },
  loginBtn:         { backgroundColor: BURGUNDY, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 6 },
  loginBtnText:     { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#2C2A22', textAlign: 'center', marginBottom: 20 },
  emptyBox:     { alignItems: 'center', paddingVertical: 40, gap: 16 },
  emptyText:    { fontSize: 14, color: MUTED },

  reservaCard:          { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: BORDER, flexDirection: 'row', overflow: 'hidden', marginBottom: 16, alignItems: 'center' },
  reservaCardCancelada: { opacity: 0.6, borderColor: '#E0D8C8' },
  reservaImage:         { width: 100, height: 100 },
  reservaInfo:          { flex: 1, padding: 12, gap: 4 },
  reservaNombre:        { fontSize: 13, fontWeight: '700', color: '#2C2A22' },
  reservaDesc:          { fontSize: 12, color: MUTED, lineHeight: 17 },
  reservaMeta:          { fontSize: 11, color: MUTED },

  cancelarBtn:     { marginTop: 8, borderWidth: 0.5, borderColor: BURGUNDY, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  cancelarBtnText: { fontSize: 11, color: BURGUNDY, fontWeight: '600' },
  noCancelarText:  { fontSize: 10, color: MUTED, marginTop: 4, fontStyle: 'italic' },

  citaIconBox:          { width: 100, height: 100, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' },
  estadoBadge:          { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0EBE1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  estadoBadgeOk:        { backgroundColor: '#E8F5E9' },
  estadoBadgeCancelada: { backgroundColor: '#FBF5F6' },
});
