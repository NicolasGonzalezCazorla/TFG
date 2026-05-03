import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';

const MONTHS    = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const WEEKDAYS  = ['Lu','Ma','Mi','Ju','Vi','Sa','Do'];

const ALL_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','16:00','16:30','17:00','17:30','18:00','18:30',
];

const BREAKPOINT = 768;
const BURGUNDY   = '#63202C';
const CREAM      = '#F5F0E8';
const BORDER     = '#C4B89A';
const MUTED      = '#9A8E7A';
const API_URL    = 'http://localhost:3000/api';

type Servicio = {
  id: string;
  nombre: string;
  duracion: number;
};

export default function Reserva() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const router    = useRouter();
  const { usuario, token } = useAuth();

  const today = new Date(); today.setHours(0,0,0,0);
  const [curYear,          setCurYear]          = useState(today.getFullYear());
  const [curMonth,         setCurMonth]         = useState(today.getMonth());
  const [selDate,          setSelDate]          = useState<number | null>(null);
  const [selSlot,          setSelSlot]          = useState<string | null>(null);
  const [selServicio,      setSelServicio]      = useState<Servicio | null>(null);
  const [aclaracion,       setAclaracion]       = useState('');
  const [confirmed,        setConfirmed]        = useState(false);
  const [showOverlay,      setShowOverlay]      = useState(false);
  const [showPanel,        setShowPanel]        = useState(false);
  const [servicios,        setServicios]        = useState<Servicio[]>([]);
  const [loading,          setLoading]          = useState(false);
  const [error,            setError]            = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetch(`${API_URL}/servicios`)
      .then(res => res.json())
      .then(data => { if (data.servicios) setServicios(data.servicios); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    cargarHorariosOcupados();
  }, [curMonth, curYear]);

  const cargarHorariosOcupados = async () => {
    try {
      const res  = await fetch(
        `${API_URL}/citas/disponibilidad?mes=${curMonth + 1}&anio=${curYear}`
      );
      const data = await res.json();
      if (res.ok) setHorariosOcupados(data.ocupados ?? {});
    } catch (e) {
      console.error('Error cargando horarios:', e);
    }
  };

  const changeMonth = (d: number) => {
    let m = curMonth + d;
    let y = curYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setCurMonth(m);
    setCurYear(y);
  };

  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
  let firstDay = new Date(curYear, curMonth, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const calWidth = isDesktop
    ? Math.min(width * 0.55, 720) - 64
    : width - 48 - 32;
  const cellSize = Math.floor(calWidth / 7);

  const openDay = (d: number) => {
    setSelDate(d);
    setSelSlot(null);
    setConfirmed(false);
    setShowOverlay(true);
    setShowPanel(false);
    setError('');
  };

  const selectSlot = (slot: string) => {
    setSelSlot(slot);
    setShowPanel(true);
    setError('');
  };

  const resetAll = () => {
    setShowOverlay(false);
    setShowPanel(false);
    setSelDate(null);
    setSelSlot(null);
    setSelServicio(null);
    setAclaracion('');
    setConfirmed(false);
    setError('');
    cargarHorariosOcupados();
  };

  const handleConfirmar = async () => {
    if (!selSlot || !selServicio) return;
    if (!usuario || !token) {
      router.push('/login');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const fechaStr = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(selDate).padStart(2, '0')}`;
      const res = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          servicio_id: selServicio.id,
          fecha:       fechaStr,
          hora:        selSlot,
          aclaracion:  aclaracion,
          estado:      'pendiente',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al crear la cita');
        return;
      }
      setConfirmed(true);
      cargarHorariosOcupados();
    } catch (e) {
      setError('Error de conexion. Intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const canConfirm = selSlot !== null && selServicio !== null;

  const renderCalendar = () => {
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <View key={`e-${i}`} style={[s.dayCell, { width: cellSize, height: cellSize }]} />
      );
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt           = new Date(curYear, curMonth, d);
      const isToday      = dt.toDateString() === today.toDateString();
      const isPast       = dt < today;
      const isWeekend    = dt.getDay() === 0 || dt.getDay() === 6;
      const isSelected   = selDate === d && showOverlay;
      const disabled     = isPast || isWeekend;
      const diaOcupado   = horariosOcupados[String(d).padStart(2, '0')] ?? horariosOcupados[String(d)] ?? [];
      const todoOcupado  = diaOcupado.length >= ALL_SLOTS.length;

      cells.push(
        <TouchableOpacity
          key={d}
          style={[
            s.dayCell,
            { width: cellSize, height: cellSize },
            isToday     && s.dayCellToday,
            isSelected  && s.dayCellSelected,
            disabled    && s.dayCellDisabled,
            todoOcupado && !disabled && s.dayCellFull,
          ]}
          onPress={() => !disabled && !todoOcupado && openDay(d)}
          activeOpacity={disabled || todoOcupado ? 1 : 0.7}
        >
          <Text style={[
            s.dayText,
            { fontSize: isDesktop ? 16 : 13 },
            isToday    && s.dayTextToday,
            isSelected && s.dayTextSelected,
            disabled   && s.dayTextDisabled,
          ]}>
            {d}
          </Text>
          {!disabled && !todoOcupado && (
            <View style={[s.dot, isSelected && s.dotSelected]} />
          )}
          {todoOcupado && !disabled && (
            <Text style={s.fullText}>{'lleno'}</Text>
          )}
        </TouchableOpacity>
      );
    }
    return cells;
  };

  const renderSlotsContent = () => {
    if (selDate === null) return null;
    const diaKey = String(selDate).padStart(2, '0');
    const booked = horariosOcupados[diaKey] ?? horariosOcupados[String(selDate)] ?? [];

    return (
      <View style={{ flex: 1 }}>
        <View style={s.slotsPanelHeader}>
          <Text style={s.slotsPanelDate}>
            {selDate}{' de '}{MONTHS_ES[curMonth]}
          </Text>
          <TouchableOpacity onPress={() => { setShowOverlay(false); setShowPanel(false); }}>
            <Text style={s.closePanelBtn}>{'✕'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.slotsLabel}>{'Horarios disponibles'}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {ALL_SLOTS.map((slot) => {
            const isBooked  = booked.includes(slot);
            const isSelSlot = selSlot === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[
                  s.slotRow,
                  isBooked  && s.slotRowBooked,
                  isSelSlot && s.slotRowSelected,
                ]}
                onPress={() => !isBooked && selectSlot(slot)}
                activeOpacity={isBooked ? 1 : 0.7}
                disabled={isBooked}
              >
                <Text style={[
                  s.slotText,
                  isBooked  && s.slotTextBooked,
                  isSelSlot && s.slotTextSelected,
                ]}>
                  {slot}
                </Text>
                {isBooked  && <Text style={s.slotOcupado}>{'No disponible'}</Text>}
                {isSelSlot && <Text style={s.slotSelIcon}>{'✓'}</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderConfirmContent = () => {
    if (!selSlot) return null;
    if (confirmed) {
      return (
        <View style={s.successBox}>
          <Text style={s.successCheck}>{'✓'}</Text>
          <Text style={s.successTitle}>{'Cita confirmada'}</Text>
          <Text style={s.successSub}>
            {selDate}{' de '}{MONTHS_ES[curMonth]}{' · '}{selSlot}{'h'}
          </Text>
          <Text style={s.successService}>{selServicio?.nombre}</Text>
          <TouchableOpacity style={s.resetBtn} onPress={resetAll}>
            <Text style={s.resetBtnText}>{'Reservar otra cita'}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <Text style={s.confirmPanelTitle}>{'Confirmar reserva'}</Text>
        <Text style={s.confirmPanelDate}>
          {selDate}{' de '}{MONTHS_ES[curMonth]}{' · '}{selSlot}{'h'}
        </Text>

        <Text style={s.confirmLabel}>{'Servicio'}</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200 }}>
          {servicios.map((serv) => (
            <TouchableOpacity
              key={serv.id}
              style={[s.servicioRow, selServicio?.id === serv.id && s.servicioRowSelected]}
              onPress={() => setSelServicio(serv)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[s.servicioName, selServicio?.id === serv.id && s.servicioNameSelected]}>
                  {serv.nombre}
                </Text>
                <Text style={s.servicioDuration}>{serv.duracion}{' min'}</Text>
              </View>
              {selServicio?.id === serv.id && (
                <Text style={s.servicioCheck}>{'✓'}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[s.confirmLabel, { marginTop: 12 }]}>{'Aclaracion'}</Text>
        <TextInput
          style={s.aclaracionInput}
          placeholder={'Escribe aqui cualquier detalle o preferencia...'}
          placeholderTextColor={MUTED}
          value={aclaracion}
          onChangeText={setAclaracion}
          multiline
          numberOfLines={3}
        />

        {!usuario && (
          <Text style={{ fontSize: 12, color: MUTED, marginBottom: 8, textAlign: 'center' }}>
            {'Debes iniciar sesion para reservar'}
          </Text>
        )}

        <TouchableOpacity
          style={[s.confirmBtn, (!canConfirm || loading) && s.confirmBtnDisabled]}
          onPress={handleConfirmar}
          disabled={!canConfirm || loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={s.confirmBtnText}>{'RESERVAR CITA'}</Text>
          }
        </TouchableOpacity>
      </View>
    );
  };

  // ── Calendario compartido ──
  const renderCalCard = () => (
    <View style={[s.calCard, isDesktop && s.calCardDesktop]}>
      <View style={s.calHeader}>
        <TouchableOpacity style={s.navBtn} onPress={() => changeMonth(-1)}>
          <Text style={s.navBtnText}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={[s.monthLabel, { fontSize: isDesktop ? 16 : 14 }]}>
          {MONTHS[curMonth]}{' '}{curYear}
        </Text>
        <TouchableOpacity style={s.navBtn} onPress={() => changeMonth(1)}>
          <Text style={s.navBtnText}>{'›'}</Text>
        </TouchableOpacity>
      </View>
      <View style={[s.weekdaysRow, { paddingHorizontal: isDesktop ? 32 : 8 }]}>
        {WEEKDAYS.map((wd) => (
          <Text key={wd} style={[s.weekdayText, { width: cellSize, fontSize: isDesktop ? 12 : 10 }]}>
            {wd}
          </Text>
        ))}
      </View>
      <View style={[s.daysGrid, { paddingHorizontal: isDesktop ? 32 : 8 }]}>
        {renderCalendar()}
      </View>
    </View>
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

          <TouchableOpacity onPress={() => router.back()} style={s.backRow}>
            <Text style={s.backRowText}>{'<- Volver'}</Text>
          </TouchableOpacity>

          <Text style={[s.pageTitle, { fontSize: isDesktop ? 28 : 20 }]}>
            {'RESERVA DE CITAS'}
          </Text>
          <Text style={s.pageSubtitle}>
            {'Selecciona un dia disponible para ver los horarios'}
          </Text>

          {isDesktop ? (
            // ── Desktop: 3 columnas ──
            <View style={s.mainLayoutDesktop}>
              {renderCalCard()}
              {showOverlay && (
                <View style={s.slotsPanel}>
                  {renderSlotsContent()}
                </View>
              )}
              {showPanel && (
                <View style={s.confirmPanel}>
                  {renderConfirmContent()}
                </View>
              )}
            </View>
          ) : (
            // ── Móvil: calendario + Modal ──
            <>
              {renderCalCard()}
              <Modal
                visible={showOverlay}
                animationType="slide"
                transparent
                onRequestClose={() => { setShowOverlay(false); setShowPanel(false); }}
              >
                <View style={s.modalBackdrop}>
                  <View style={s.modalSheet}>
                    <View style={s.modalHandle} />
                    {!showPanel ? (
                      <View style={{ flex: 1 }}>
                        {renderSlotsContent()}
                      </View>
                    ) : (
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <TouchableOpacity
                          onPress={() => setShowPanel(false)}
                          style={{ marginBottom: 12 }}
                        >
                          <Text style={{ color: BURGUNDY, fontSize: 13, fontWeight: '600' }}>
                            {'← Horarios'}
                          </Text>
                        </TouchableOpacity>
                        {renderConfirmContent()}
                      </ScrollView>
                    )}
                  </View>
                </View>
              </Modal>
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
  scrollContent:    { flexGrow: 1, paddingBottom: 60 },
  container:        { paddingHorizontal: 16, paddingTop: 20 },
  containerDesktop: { maxWidth: 900, alignSelf: 'center', paddingHorizontal: 60 },

  backRow:      { paddingVertical: 12 },
  backRowText:  { color: BURGUNDY, fontSize: 14, fontWeight: '600' },
  pageTitle:    { fontWeight: '700', color: '#2C2A22', marginBottom: 4, letterSpacing: 0.5 },
  pageSubtitle: { fontSize: 12, color: MUTED, marginBottom: 20 },

  mainLayoutDesktop: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },

  calCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    marginBottom: 48,
  },
  calCardDesktop: { flex: 1 },

  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    backgroundColor: CREAM,
  },
  navBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 6, borderWidth: 0.5, borderColor: BORDER },
  navBtnText: { color: BURGUNDY, fontSize: 22 },
  monthLabel: { color: '#2C2A22', letterSpacing: 0.5 },

  weekdaysRow: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 6,
  },
  weekdayText: {
    textAlign: 'center',
    color: MUTED,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 16,
    gap: 2,
  },

  dayCell:         { alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  dayCellToday:    { borderWidth: 0.5, borderColor: BURGUNDY },
  dayCellSelected: { backgroundColor: BURGUNDY },
  dayCellDisabled: { opacity: 0.3 },
  dayCellFull:     { backgroundColor: '#F0EBE1' },

  dayText:         { color: '#4A4035' },
  dayTextToday:    { color: BURGUNDY, fontWeight: '600' },
  dayTextSelected: { color: '#FFFFFF' },
  dayTextDisabled: { color: MUTED },

  fullText: { fontSize: 8, color: MUTED, marginTop: 1 },

  dot:         { width: 3, height: 3, borderRadius: 2, backgroundColor: BURGUNDY, position: 'absolute', bottom: 5 },
  dotSelected: { backgroundColor: '#FFFFFF' },

  // ── Slots panel (desktop) ──
  slotsPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    width: 190,
    maxHeight: 560,
  },
  slotsPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  slotsPanelDate: { fontSize: 13, fontWeight: '600', color: '#2C2A22' },
  closePanelBtn:  { fontSize: 14, color: MUTED, padding: 4 },
  slotsLabel:     { fontSize: 10, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },

  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: BORDER,
    marginBottom: 5,
    backgroundColor: '#FAFAF7',
  },
  slotRowBooked:    { backgroundColor: '#F0EBE1', borderColor: '#E0D8C8' },
  slotRowSelected:  { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  slotText:         { fontSize: 12, color: '#4A4035' },
  slotTextBooked:   { color: '#C4B89A', textDecorationLine: 'line-through' },
  slotTextSelected: { color: '#FFFFFF' },
  slotOcupado:      { fontSize: 9, color: '#C4B89A', fontStyle: 'italic' },
  slotSelIcon:      { fontSize: 11, color: '#FFFFFF' },

  // ── Confirm panel (desktop) ──
  confirmPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    width: 240,
  },
  confirmPanelTitle: { fontSize: 14, fontWeight: '700', color: '#2C2A22', marginBottom: 4 },
  confirmPanelDate:  { fontSize: 11, color: MUTED, marginBottom: 14 },
  confirmLabel:      { fontSize: 10, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },

  servicioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: BORDER,
    marginBottom: 5,
    backgroundColor: '#FAFAF7',
  },
  servicioRowSelected:  { borderColor: BURGUNDY, backgroundColor: '#FBF5F6' },
  servicioName:         { fontSize: 12, color: '#2C2A22', fontWeight: '500' },
  servicioNameSelected: { color: BURGUNDY, fontWeight: '700' },
  servicioDuration:     { fontSize: 10, color: MUTED },
  servicioCheck:        { fontSize: 13, color: BURGUNDY, fontWeight: '700' },

  aclaracionInput: {
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: '#2C2A22',
    backgroundColor: '#FAFAF7',
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 14,
  },

  confirmBtn:         { backgroundColor: BURGUNDY, paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: BORDER },
  confirmBtnText:     { color: '#FFFFFF', fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },

  // ── Modal móvil ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 48,
    maxHeight: '88%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: 'center',
    marginBottom: 16,
  },

  successBox:     { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  successCheck:   { fontSize: 40, color: BURGUNDY, marginBottom: 12 },
  successTitle:   { fontSize: 18, fontWeight: '700', color: BURGUNDY, marginBottom: 6 },
  successSub:     { fontSize: 14, color: '#4A4035', marginBottom: 4 },
  successService: { fontSize: 13, color: MUTED, marginBottom: 20 },
  resetBtn:       { borderWidth: 0.5, borderColor: BORDER, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  resetBtnText:   { fontSize: 13, color: BURGUNDY },
});