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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NavBar from '../../components/NavBar';
import Footer from '../../components/footer';
import Button from '../../components/Button';
import { detalleStyles as s } from '../Detalle.styles';

const BREAKPOINT   = 768;
const BURGUNDY     = '#63202C';
const CREAM        = '#F5F0E8';
const BORDER       = '#C4B89A';
const MUTED        = '#9A8E7A';
const PRODUCT_IMAGE = { uri: 'https://picsum.photos/seed/lipstick/500/500' };

const DIAS_RECOGIDA = [
  'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes',
];
const HORARIOS_RECOGIDA = [
  '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '16:00', '16:30', '17:00', '17:30', '18:00',
];

export default function DetalleProducto() {
  const router = useRouter();
  const raw    = useLocalSearchParams();

  const str = (v: string | string[] | undefined): string =>
    Array.isArray(v) ? v[0] : v ?? '';

  const name        = str(raw.name);
  const price       = str(raw.price);
  const description = str(raw.description);

  const { width } = useWindowDimensions();
  const isDesktop  = width >= BREAKPOINT;

  const [showModal,   setShowModal]   = useState(false);
  const [selDia,      setSelDia]      = useState<string | null>(null);
  const [selHorario,  setSelHorario]  = useState<string | null>(null);
  const [nota,        setNota]        = useState('');
  const [confirmed,   setConfirmed]   = useState(false);

  const canConfirm = selDia !== null && selHorario !== null;

  const resetModal = () => {
    setShowModal(false);
    setSelDia(null);
    setSelHorario(null);
    setNota('');
    setConfirmed(false);
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
              // ── Confirmacion ──
              <View style={m.successBox}>
                <Text style={m.successIcon}>{'✓'}</Text>
                <Text style={m.successTitle}>{'Reserva confirmada'}</Text>
                <Text style={m.successSub}>{name}</Text>
                <Text style={m.successDetail}>
                  {'Recogida el '}{selDia}{' a las '}{selHorario}{'h'}
                </Text>
                <Text style={m.successNote}>
                  {'Te esperamos en tienda. Traera este mensaje como justificante.'}
                </Text>
                <TouchableOpacity style={m.closeBtn} onPress={resetModal}>
                  <Text style={m.closeBtnText}>{'Cerrar'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>

                {/* Cabecera */}
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

                {/* Dia de recogida */}
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

                {/* Horario */}
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

                {/* Nota */}
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

                {/* Resumen */}
                {selDia && selHorario && (
                  <View style={m.resumen}>
                    <Text style={m.resumenText}>
                      {'Recogida: '}{selDia}{' a las '}{selHorario}{'h'}
                    </Text>
                  </View>
                )}

                {/* Botón confirmar */}
                <TouchableOpacity
                  style={[m.confirmBtn, !canConfirm && m.confirmBtnDisabled]}
                  onPress={() => canConfirm && setConfirmed(true)}
                  disabled={!canConfirm}
                >
                  <Text style={m.confirmBtnText}>{'CONFIRMAR RESERVA'}</Text>
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

  // Dias
  diaRow: { gap: 8, paddingBottom: 4 },
  diaBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: BORDER,
    backgroundColor: '#FAFAF7',
  },
  diaBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  diaBtnText:       { fontSize: 13, color: '#555555' },
  diaBtnTextActive: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },

  // Horarios
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  horarioBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: BORDER,
    backgroundColor: '#FAFAF7',
    minWidth: 70,
    alignItems: 'center',
  },
  horarioBtnActive:     { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  horarioBtnText:       { fontSize: 13, color: '#4A4035' },
  horarioBtnTextActive: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },

  // Nota
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

  // Resumen
  resumen: {
    backgroundColor: CREAM,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: BORDER,
  },
  resumenText: { fontSize: 13, color: BURGUNDY, fontWeight: '600' },

  // Confirmar
  confirmBtn: {
    backgroundColor: BURGUNDY,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmBtnDisabled: { backgroundColor: BORDER },
  confirmBtnText:     { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.8 },

  // Exito
  successBox:    { alignItems: 'center', paddingVertical: 32 },
  successIcon:   { fontSize: 48, color: BURGUNDY, marginBottom: 16 },
  successTitle:  { fontSize: 20, fontWeight: '700', color: BURGUNDY, marginBottom: 8 },
  successSub:    { fontSize: 15, color: '#2C2A22', fontWeight: '600', marginBottom: 4 },
  successDetail: { fontSize: 14, color: '#4A4035', marginBottom: 8 },
  successNote:   { fontSize: 12, color: MUTED, textAlign: 'center', lineHeight: 18, marginBottom: 28, paddingHorizontal: 16 },
  closeBtn:      { borderWidth: 0.5, borderColor: BORDER, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 8 },
  closeBtnText:  { fontSize: 14, color: BURGUNDY, fontWeight: '600' },
});