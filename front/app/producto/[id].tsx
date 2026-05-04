import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NavBar from '../../components/NavBar';
import Footer from '../../components/footer';
import Button from '../../components/Button';
import { detalleStyles as s } from '../Detalle.styles';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../constants';

const BREAKPOINT    = 768;
const BURGUNDY      = '#63202C';
const CREAM         = '#F5F0E8';
const BORDER        = '#C4B89A';
const MUTED         = '#9A8E7A';
const PRODUCT_IMAGE = { uri: 'https://picsum.photos/seed/lipstick/500/500' };

const DIAS_RECOGIDA = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
const HORARIOS_RECOGIDA = [
  '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '16:00', '16:30', '17:00', '17:30', '18:00',
];

export default function DetalleProducto() {
  const router = useRouter();
  const raw    = useLocalSearchParams();
  const { usuario, token } = useAuth();

  const str = (v: string | string[] | undefined): string =>
    Array.isArray(v) ? v[0] : v ?? '';

  const productId   = str(raw.id);
  const name        = str(raw.name);
  const price       = str(raw.price);
  const description = str(raw.description);

  const { width } = useWindowDimensions();
  const isDesktop  = width >= BREAKPOINT;

  const [showModal,  setShowModal]  = useState(false);
  const [selDia,     setSelDia]     = useState<string | null>(null);
  const [selHorario, setSelHorario] = useState<string | null>(null);
  const [nota,       setNota]       = useState('');
  const [confirmed,  setConfirmed]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const canConfirm = selDia !== null && selHorario !== null;

  const resetModal = () => {
    setShowModal(false);
    setSelDia(null);
    setSelHorario(null);
    setNota('');
    setConfirmed(false);
    setError('');
  };

  const handleReservar = async () => {
    if (!canConfirm) return;

    // Si no hay sesión, redirige al login
    if (!usuario || !token) {
      setShowModal(false);
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          producto_id:   productId,
          dia_recogida:  selDia,
          hora_recogida: selHorario,
          nota:          nota,
          estado:        'pendiente',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al realizar la reserva');
        return;
      }

      setConfirmed(true);

    } catch (e: any) {
      setError('Error de conexion. Intentalo de nuevo.');
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

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingVertical: 12, paddingHorizontal: 4 }}
          >
            <Text style={{ color: BURGUNDY, fontSize: 14, fontWeight: '600' }}>
              {'← Volver'}
            </Text>
          </TouchableOpacity>

          <Text style={s.pageTitle}>{name}</Text>

          <View style={[s.mainLayout, isDesktop && s.mainLayoutDesktop]}>

            <View style={[s.leftCol, isDesktop && s.leftColDesktop]}>
              <Image
                source={PRODUCT_IMAGE}
                style={s.productImage}
                resizeMode="contain"
              />
            </View>

            <View style={[s.rightCol, isDesktop && s.rightColDesktop]}>
              <Text style={s.sectionLabel}>{'Descripcion'}</Text>
              <Text style={s.bodyText}>{description}</Text>

              <Text style={[s.sectionLabel, { marginTop: 20 }]}>{'Beneficios'}</Text>
              {[
                'Hidratacion profunda y confort inmediato.',
                'Luminosidad y suavidad desde la primera aplicacion.',
                'Recomendado para rutinas premium.',
              ].map((item, idx) => (
                <View key={idx} style={s.bulletRow}>
                  <Text style={s.bullet}>{'•'}</Text>
                  <Text style={s.bulletText}>{item}</Text>
                </View>
              ))}

              <View style={s.productActions}>
                <Button
                  label="RESERVAR PRODUCTO"
                  variant="primary"
                  onPress={() => setShowModal(true)}
                />
                <View style={s.priceTag}>
                  <Text style={s.priceText}>{price}{'€'}</Text>
                </View>
              </View>

              {/* Aviso si no hay sesión */}
              {!usuario && (
                <Text style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>
                  {'Debes iniciar sesion para reservar'}
                </Text>
              )}
            </View>

          </View>
        </View>
        <Footer />
      </ScrollView>

      {/* ── Modal reserva producto ── */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={resetModal}
      >
        <View style={m.backdrop}>
          <View style={m.sheet}>
            <View style={m.handle} />

            {confirmed ? (
              <View style={m.successBox}>
                <Text style={m.successIcon}>{'✓'}</Text>
                <Text style={m.successTitle}>{'Reserva confirmada'}</Text>
                <Text style={m.successSub}>{name}</Text>
                <Text style={m.successDetail}>
                  {'Recogida el '}{selDia}{' a las '}{selHorario}{'h'}
                </Text>
                <Text style={m.successNote}>
                  {'Te esperamos en tienda. Trae este mensaje como justificante.'}
                </Text>
                <TouchableOpacity style={m.closeBtn} onPress={resetModal}>
                  <Text style={m.closeBtnText}>{'Cerrar'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>

                <View style={m.header}>
                  <View>
                    <Text style={m.title}>{'Reservar para recoger'}</Text>
                    <Text style={m.subtitle}>{name}{' · '}{price}{'€'}</Text>
                  </View>
                  <TouchableOpacity onPress={resetModal}>
                    <Text style={m.closeX}>{'✕'}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={m.note}>
                  {'Reserva el producto y recogelo en tienda en el horario que prefieras.'}
                </Text>

                <Text style={m.label}>{'Dia de recogida'}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={m.diaRow}
                >
                  {DIAS_RECOGIDA.map((dia) => (
                    <TouchableOpacity
                      key={dia}
                      style={[m.diaBtn, selDia === dia && m.diaBtnActive]}
                      onPress={() => setSelDia(dia)}
                    >
                      <Text style={[m.diaBtnText, selDia === dia && m.diaBtnTextActive]}>
                        {dia}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={[m.label, { marginTop: 16 }]}>{'Horario de recogida'}</Text>
                <View style={m.horariosGrid}>
                  {HORARIOS_RECOGIDA.map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[m.horarioBtn, selHorario === h && m.horarioBtnActive]}
                      onPress={() => setSelHorario(h)}
                    >
                      <Text style={[m.horarioBtnText, selHorario === h && m.horarioBtnTextActive]}>
                        {h}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[m.label, { marginTop: 16 }]}>{'Nota (opcional)'}</Text>
                <TextInput
                  style={m.notaInput}
                  placeholder={'Ej: Pago en efectivo, necesito factura...'}
                  placeholderTextColor={MUTED}
                  value={nota}
                  onChangeText={setNota}
                  multiline
                  numberOfLines={3}
                />

                {selDia && selHorario && (
                  <View style={m.resumen}>
                    <Text style={m.resumenText}>
                      {'Recogida: '}{selDia}{' a las '}{selHorario}{'h'}
                    </Text>
                  </View>
                )}

                {error ? (
                  <Text style={m.errorText}>{error}</Text>
                ) : null}

                <TouchableOpacity
                  style={[m.confirmBtn, (!canConfirm || loading) && m.confirmBtnDisabled]}
                  onPress={handleReservar}
                  disabled={!canConfirm || loading}
                >
                  {loading
                    ? <ActivityIndicator color="#FFFFFF" />
                    : <Text style={m.confirmBtnText}>{'CONFIRMAR RESERVA'}</Text>
                  }
                </TouchableOpacity>

              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const m = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 48,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title:    { fontSize: 17, fontWeight: '700', color: '#2C2A22' },
  subtitle: { fontSize: 13, color: MUTED, marginTop: 2 },
  closeX:   { fontSize: 18, color: MUTED, padding: 4 },
  note: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 19,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  label: {
    fontSize: 10,
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    fontWeight: '600',
  },
  diaRow:           { gap: 8, paddingBottom: 4 },
  diaBtn:           { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, borderWidth: 0.5, borderColor: BORDER, backgroundColor: '#FAFAF7' },
  diaBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  diaBtnText:       { fontSize: 13, color: '#555555' },
  diaBtnTextActive: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  horariosGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  horarioBtn:           { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8, borderWidth: 0.5, borderColor: BORDER, backgroundColor: '#FAFAF7', minWidth: 70, alignItems: 'center' },
  horarioBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  horarioBtnText:       { fontSize: 13, color: '#4A4035' },
  horarioBtnTextActive: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  notaInput: {
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: '#2C2A22',
    backgroundColor: '#FAFAF7',
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  resumen:     { backgroundColor: CREAM, borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 0.5, borderColor: BORDER },
  resumenText: { fontSize: 13, color: BURGUNDY, fontWeight: '600' },
  errorText:   { fontSize: 13, color: BURGUNDY, marginBottom: 12, textAlign: 'center' },
  confirmBtn:         { backgroundColor: BURGUNDY, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  confirmBtnDisabled: { backgroundColor: BORDER },
  confirmBtnText:     { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.8 },
  successBox:    { alignItems: 'center', paddingVertical: 32 },
  successIcon:   { fontSize: 48, color: BURGUNDY, marginBottom: 16 },
  successTitle:  { fontSize: 20, fontWeight: '700', color: BURGUNDY, marginBottom: 8 },
  successSub:    { fontSize: 15, color: '#2C2A22', fontWeight: '600', marginBottom: 4 },
  successDetail: { fontSize: 14, color: '#4A4035', marginBottom: 8 },
  successNote:   { fontSize: 12, color: MUTED, textAlign: 'center', lineHeight: 18, marginBottom: 28, paddingHorizontal: 16 },
  closeBtn:      { borderWidth: 0.5, borderColor: BORDER, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 8 },
  closeBtnText:  { fontSize: 14, color: BURGUNDY, fontWeight: '600' },
});