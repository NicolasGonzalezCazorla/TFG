import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  StyleSheet,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';

const MONTHS    = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const WEEKDAYS  = ['Lu','Ma','Mi','Ju','Vi','Sa','Do'];

const ALL_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','16:00','16:30','17:00','17:30','18:00','18:30',
];

const BOOKED: Record<number, string[]> = {
  5:  ['09:00','10:30','17:00'],
  12: ['09:30','11:00','16:00'],
  19: ['10:00','12:00','18:00'],
};

const SERVICIOS = [
  { id: '1', name: 'Facial Glow',         duration: '60 min' },
  { id: '2', name: 'Masaje Relajante',     duration: '75 min' },
  { id: '3', name: 'Ritual Imperial',      duration: '90 min' },
  { id: '4', name: 'Hidratacion Profunda', duration: '45 min' },
  { id: '5', name: 'Tratamiento Capilar',  duration: '60 min' },
  { id: '6', name: 'Exfoliacion Corporal', duration: '50 min' },
];

const BREAKPOINT = 768;
const BURGUNDY   = '#63202C';
const CREAM      = '#F5F0E8';
const BORDER     = '#C4B89A';
const MUTED      = '#9A8E7A';

export default function Reserva() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const router    = useRouter();

  const today = new Date(); today.setHours(0,0,0,0);
  const [curYear,     setCurYear]     = useState(today.getFullYear());
  const [curMonth,    setCurMonth]    = useState(today.getMonth());
  const [selDate,     setSelDate]     = useState<number | null>(null);
  const [selSlot,     setSelSlot]     = useState<string | null>(null);
  const [selServicio, setSelServicio] = useState<string | null>(null);
  const [aclaracion,  setAclaracion]  = useState('');
  const [confirmed,   setConfirmed]   = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showPanel,   setShowPanel]   = useState(false);

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
    : width - 48 - 64;
  const cellSize = Math.floor(calWidth / 7);

  const openDay = (d: number) => {
    setSelDate(d);
    setSelSlot(null);
    setConfirmed(false);
    setShowOverlay(true);
    setShowPanel(false);
  };

  const selectSlot = (slot: string) => {
    setSelSlot(slot);
    setShowPanel(true);
  };

  const resetAll = () => {
    setShowOverlay(false);
    setShowPanel(false);
    setSelDate(null);
    setSelSlot(null);
    setSelServicio(null);
    setAclaracion('');
    setConfirmed(false);
  };

  const canConfirm = selSlot !== null && selServicio !== null;

  const renderCalendar = () => {
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <View key={`e-${i}`} style={[s.dayCell, { width: cellSize, minHeight: 80 }]} />
      );
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt         = new Date(curYear, curMonth, d);
      const isToday    = dt.toDateString() === today.toDateString();
      const isPast     = dt < today;
      const isWeekend  = dt.getDay() === 0 || dt.getDay() === 6;
      const isSelected = selDate === d && showOverlay;
      const disabled   = isPast || isWeekend;
      cells.push(
        <TouchableOpacity
          key={d}
          style={[
            s.dayCell,
            { width: cellSize, minHeight: 80 },
            isToday    && s.dayCellToday,
            isSelected && s.dayCellSelected,
            disabled   && s.dayCellDisabled,
          ]}
          onPress={() => !disabled && openDay(d)}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <Text style={[
            s.dayText,
            { fontSize: isDesktop ? 18 : 14 },
            isToday    && s.dayTextToday,
            isSelected && s.dayTextSelected,
            disabled   && s.dayTextDisabled,
          ]}>
            {d}
          </Text>
          {!disabled && <View style={[s.dot, isSelected && s.dotSelected]} />}
        </TouchableOpacity>
      );
    }
    return cells;
  };

  // En móvil usamos Modal, en desktop columnas inline
  const renderSlotsContent = () => {
    if (selDate === null) return null;
    const booked = BOOKED[selDate] || [];
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
              >
                <Text style={[
                  s.slotText,
                  isBooked  && s.slotTextBooked,
                  isSelSlot && s.slotTextSelected,
                ]}>
                  {slot}
                </Text>
                {isBooked  && <Text style={s.slotOcupado}>{'Ocupado'}</Text>}
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
          <Text style={s.successService}>{selServicio}</Text>
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
          {SERVICIOS.map((serv) => (
            <TouchableOpacity
              key={serv.id}
              style={[s.servicioRow, selServicio === serv.name && s.servicioRowSelected]}
              onPress={() => setSelServicio(serv.name)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[s.servicioName, selServicio === serv.name && s.servicioNameSelected]}>
                  {serv.name}
                </Text>
                <Text style={s.servicioDuration}>{serv.duration}</Text>
              </View>
              {selServicio === serv.name && (
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

        <TouchableOpacity
          style={[s.confirmBtn, !canConfirm && s.confirmBtnDisabled]}
          onPress={() => canConfirm && setConfirmed(true)}
          disabled={!canConfirm}
        >
          <Text style={s.confirmBtnText}>{'RESERVAR CITA'}</Text>
        </TouchableOpacity>
      </View>
    );
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
            <Text style={s.backRowText}>{'<- Volver'}</Text>
          </TouchableOpacity>

          <Text style={[s.pageTitle, { fontSize: isDesktop ? 28 : 22 }]}>
            {'RESERVA DE CITAS'}
          </Text>
          <Text style={s.pageSubtitle}>
            {'Selecciona un dia disponible para ver los horarios'}
          </Text>

          {/* ── Desktop: 3 columnas inline ── */}
          {isDesktop ? (
            <View style={s.mainLayoutDesktop}>
              <View style={s.calCard}>
                <View style={s.calHeader}>
                  <TouchableOpacity style={s.navBtn} onPress={() => changeMonth(-1)}>
                    <Text style={s.navBtnText}>{'‹'}</Text>
                  </TouchableOpacity>
                  <Text style={s.monthLabel}>{MONTHS[curMonth]}{' '}{curYear}</Text>
                  <TouchableOpacity style={s.navBtn} onPress={() => changeMonth(1)}>
                    <Text style={s.navBtnText}>{'›'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={s.weekdaysRow}>
                  {WEEKDAYS.map((wd) => (
                    <Text key={wd} style={[s.weekdayText, { width: cellSize }]}>{wd}</Text>
                  ))}
                </View>
                <View style={s.daysGrid}>
                  {renderCalendar()}
                </View>
              </View>

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
              <View style={s.calCard}>
                <View style={s.calHeader}>
                  <TouchableOpacity style={s.navBtn} onPress={() => changeMonth(-1)}>
                    <Text style={s.navBtnText}>{'‹'}</Text>
                  </TouchableOpacity>
                  <Text style={s.monthLabel}>{MONTHS[curMonth]}{' '}{curYear}</Text>
                  <TouchableOpacity style={s.navBtn} onPress={() => changeMonth(1)}>
                    <Text style={s.navBtnText}>{'›'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={s.weekdaysRow}>
                  {WEEKDAYS.map((wd) => (
                    <Text key={wd} style={[s.weekdayText, { width: cellSize }]}>{wd}</Text>
                  ))}
                </View>
                <View style={s.daysGrid}>
                  {renderCalendar()}
                </View>
              </View>

              {/* Modal móvil */}
              <Modal
                visible={showOverlay}
                animationType="slide"
                transparent
                onRequestClose={() => { setShowOverlay(false); setShowPanel(false); }}
              >
                <View style={s.modalBackdrop}>
                  <View style={s.modalSheet}>
                    <View style={s.modalHandle} />

                    {/* Slots */}
                    {!showPanel && (
                      <View style={{ flex: 1 }}>
                        {renderSlotsContent()}
                      </View>
                    )}

                    {/* Panel confirmacion */}
                    {showPanel && (
                      <View style={{ flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => setShowPanel(false)}
                          style={{ marginBottom: 12 }}
                        >
                          <Text style={{ color: BURGUNDY, fontSize: 13, fontWeight: '600' }}>
                            {'← Horarios'}
                          </Text>
                        </TouchableOpacity>
                        {renderConfirmContent()}
                      </View>
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
  container:        { paddingHorizontal: 24, paddingTop: 32 },
  containerDesktop: { maxWidth: 900, alignSelf: 'center', paddingHorizontal: 60 },

  backRow:      { paddingVertical: 12 },
  backRowText:  { color: BURGUNDY, fontSize: 14, fontWeight: '600' },
  pageTitle:    { fontWeight: '700', color: '#2C2A22', marginBottom: 4, letterSpacing: 0.5 },
  pageSubtitle: { fontSize: 13, color: MUTED, marginBottom: 24 },

  // ── Desktop layout ──
  mainLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },

  // ── Calendario ──
  calCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    flex: 1,
    marginBottom: 48,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    backgroundColor: CREAM,
  },
  navBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 6, borderWidth: 0.5, borderColor: BORDER },
  navBtnText: { color: BURGUNDY, fontSize: 22 },
  monthLabel: { fontSize: 16, color: '#2C2A22', letterSpacing: 0.5 },

  weekdaysRow: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 12,
  },
  weekdayText: {
    textAlign: 'center',
    fontSize: 12,
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 32,
    paddingBottom: 32,
    gap: 4,
  },

  dayCell:         { alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  dayCellToday:    { borderWidth: 0.5, borderColor: BURGUNDY },
  dayCellSelected: { backgroundColor: BURGUNDY },
  dayCellDisabled: { opacity: 0.3 },
  dayText:         { color: '#4A4035' },
  dayTextToday:    { color: BURGUNDY, fontWeight: '600' },
  dayTextSelected: { color: '#FFFFFF' },
  dayTextDisabled: { color: MUTED },
  dot:             { width: 4, height: 4, borderRadius: 2, backgroundColor: BURGUNDY, position: 'absolute', bottom: 8 },
  dotSelected:     { backgroundColor: '#FFFFFF' },

  // ── Panel slots (desktop) ──
  slotsPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    width: 180,
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
  slotTextBooked:   { color: MUTED, textDecorationLine: 'line-through' },
  slotTextSelected: { color: '#FFFFFF' },
  slotOcupado:      { fontSize: 9, color: MUTED },
  slotSelIcon:      { fontSize: 11, color: '#FFFFFF' },

  // ── Panel confirmacion (desktop) ──
  confirmPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    width: 260,
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
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: 'center',
    marginBottom: 20,
  },

  // ── Exito ──
  successBox:     { alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  successCheck:   { fontSize: 40, color: BURGUNDY, marginBottom: 12 },
  successTitle:   { fontSize: 18, fontWeight: '700', color: BURGUNDY, marginBottom: 6 },
  successSub:     { fontSize: 14, color: '#4A4035', marginBottom: 4 },
  successService: { fontSize: 13, color: MUTED, marginBottom: 20 },
  resetBtn:       { borderWidth: 0.5, borderColor: BORDER, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  resetBtnText:   { fontSize: 13, color: BURGUNDY },
});