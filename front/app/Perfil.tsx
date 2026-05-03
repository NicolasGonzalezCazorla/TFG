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

const USUARIO = {
  nombre:    'Alfonsa',
  apellidos: 'Maybelline Herrera',
  usuario:   'UñasFrancesasUser',
  avatar:    { uri: 'https://picsum.photos/seed/profile/200/200' },
};

const PRODUCTOS_RESERVADOS = [
  {
    id: '1',
    nombre: 'Producto reservado 1',
    descripcion: 'Breve descripción del producto reservado.',
    fecha: '12/05',
    estado: 'Pendiente',
    image: { uri: 'https://picsum.photos/seed/lipstick/300/300' },
  },
  {
    id: '2',
    nombre: 'Producto reservado 2',
    descripcion: 'Breve descripción del producto reservado.',
    fecha: '12/05',
    estado: 'Recogido',
    image: { uri: 'https://picsum.photos/seed/lipstick2/300/300' },
  },
];

export default function Perfil() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const router    = useRouter();

  const [editando, setEditando] = useState(false);

  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.container, isDesktop && s.containerDesktop]}>

          {/* ── Tarjeta perfil ── */}
          <View style={[s.profileCard, isDesktop && s.profileCardDesktop]}>

            {/* Avatar */}
            <View style={s.avatarWrapper}>
              <Image
                source={USUARIO.avatar}
                style={s.avatar}
                resizeMode="cover"
              />
              <View style={s.avatarRing} />
            </View>

            {/* Info */}
            <View style={s.profileInfo}>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Nombre:</Text>
                <Text style={s.infoValue}>{USUARIO.nombre}</Text>
              </View>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Apellidos:</Text>
                <Text style={s.infoValue}>{USUARIO.apellidos}</Text>
              </View>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Usuario:</Text>
                <Text style={s.infoValue}>{USUARIO.usuario}</Text>
              </View>
            </View>

            {/* Acciones */}
            <View style={s.profileActions}>
              <TouchableOpacity
                style={s.editBtn}
                onPress={() => setEditando(!editando)}
              >
                <Text style={s.editBtnText}>✎ Editar perfil...</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.serviciosBtn}
                onPress={() => router.push('/servicio')}
              >
                <Text style={s.serviciosBtnText}>SERVICIOS</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* ── Productos reservados ── */}
          <Text style={s.sectionTitle}>Productos reservados</Text>

          {PRODUCTOS_RESERVADOS.map((prod) => (
            <View key={prod.id} style={s.reservaCard}>

              <Image
                source={prod.image}
                style={s.reservaImage}
                resizeMode="cover"
              />

              <View style={s.reservaInfo}>
                <Text style={s.reservaNombre}>{prod.nombre}</Text>
                <Text style={s.reservaDesc}>{prod.descripcion}</Text>
                <Text style={s.reservaMeta}>
                  Fecha {prod.fecha} · Estado: {prod.estado}
                </Text>
                <TouchableOpacity style={s.detalleBtn}>
                  <Text style={s.detalleBtnText}>DETALLES</Text>
                </TouchableOpacity>
              </View>

              {/* Indicador estado */}
              <View style={[
                s.estadoBadge,
                prod.estado === 'Recogido' && s.estadoBadgeOk,
              ]}>
                <Text style={s.estadoIcon}>
                  {prod.estado === 'Recogido' ? '✓' : '🕐'}
                </Text>
              </View>

            </View>
          ))}

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
  containerDesktop: { maxWidth: 900, alignSelf: 'center', paddingHorizontal: 40 },

  // ── Tarjeta perfil ──
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    marginBottom: 32,
    flexDirection: 'column',
    gap: 16,
  },
  profileCardDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },

  avatarWrapper: {
    alignSelf: 'center',
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarRing: {
    position: 'absolute',
    top: -4, left: -4,
    width: 98, height: 98,
    borderRadius: 49,
    borderWidth: 1.5,
    borderColor: GOLD,
  },

  profileInfo: {
    flex: 1,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: MUTED,
    minWidth: 72,
  },
  infoValue: {
    fontSize: 13,
    color: '#2C2A22',
    fontWeight: '500',
  },

  profileActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editBtnText: {
    fontSize: 12,
    color: MUTED,
  },
  serviciosBtn: {
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  serviciosBtnText: {
    fontSize: 12,
    color: BURGUNDY,
    fontWeight: '600',
    letterSpacing: 0.8,
  },

  // ── Sección productos ──
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C2A22',
    textAlign: 'center',
    marginBottom: 20,
  },

  // ── Tarjeta reserva ──
  reservaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
    alignItems: 'center',
  },
  reservaImage: {
    width: 100,
    height: 100,
  },
  reservaInfo: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  reservaNombre: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C2A22',
  },
  reservaDesc: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 17,
  },
  reservaMeta: {
    fontSize: 11,
    color: MUTED,
  },
  detalleBtn: {
    marginTop: 6,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  detalleBtnText: {
    fontSize: 11,
    color: BURGUNDY,
    fontWeight: '600',
    letterSpacing: 0.6,
  },

  estadoBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EBE1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  estadoBadgeOk: {
    backgroundColor: '#E8F5E9',
  },
  estadoIcon: {
    fontSize: 16,
  },
});