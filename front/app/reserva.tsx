import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants';

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

// Desktop layout constants
const MAX_W        = 1280;
const H_PAD        = 48;
const SLOTS_W      = 200;
const CONFIRM_W    = 230;
const GAP          = 16;
const CAL_GRID_PAD = 32;

type Servicio = { id: string; nombre: string; duracion: number };

export default function Reserva() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const router    = useRouter();
  const { usuario, token } = useAuth();

  // Stable — created once on mount, never recreated on re-render
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [curYear,          setCurYear]          = useState(today.getFullYear());
  const [curMonth,         setCurMonth]         = useState(today.getMonth());
  const [selDate,          setSelDate]          = useState<number | null>(null);
  const [selSlot,          setSelSlot]          = useState<string | null>(null);
  const [selServicio,      setSelServicio]      = useState<Servicio | null>(null);
  const [confirmed,        setConfirmed]        = useState(false);
  const [showSlots,        setShowSlots]        = useState(false);
  const [showConfirm,      setShowConfirm]      = useState(false);
  const [servicios,        setServicios]        = useState<Servicio[]>([]);
  const [loading,          setLoading]          = useState(false);
  const [error,            setError]            = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState<Record<string, string[]>>({});

  // ── Width maths — derived from useWindowDimensions, updates on resize ────
  // ── Width maths — always derived from raw `width`, never from layout events ─
  // Mobile container: paddingHorizontal 14px each side = 28px total
  // Desktop container: paddingHorizontal H_PAD each side, capped at MAX_W
  const MOBILE_CONTAINER_PAD = 28; // 14px × 2
  const screenW    = Math.min(width, MAX_W);
  const calCardW   = isDesktop
    ? screenW - H_PAD * 2 - SLOTS_W - CONFIRM_W - GAP * 2
    : width - MOBILE_CONTAINER_PAD; // full screen width minus container padding

  // gap:2 between 7 cols = 6 gaps = 12px; borderWidth 1px each side = 2px
  const gridPadH = isDesktop ? CAL_GRID_PAD : 12;
  const gridW    = calCardW - 2 - gridPadH * 2;
  const cellSize = Math.max(Math.floor((gridW - 12) / 7), 32);

  // Derived from curYear/curMonth — recomputed whenever month changes
  const firstDay = React.useMemo(() => {
    const fd = new Date(curYear, curMonth, 1).getDay();
    // Convert JS Sunday=0…Saturday=6 → ISO Monday=0…Sunday=6
    return fd === 0 ? 6 : fd - 1;
  }, [curYear, curMonth]);

  const daysInMonth = React.useMemo(
    () => new Date(curYear, curMonth + 1, 0).getDate(),
    [curYear, curMonth]
  );

  // ── Data ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/servicios`)
      .then(r => r.json())
      .then(d => { if (d.servicios) setServicios(d.servicios); })
      .catch(console.error);
  }, []);

  useEffect(() => { loadBusy(); }, [curMonth, curYear]);

  const loadBusy = async () => {
    try {
      const r = await fetch(`${API_URL}/citas/disponibilidad?mes=${curMonth + 1}&anio=${curYear}`);
      const d = await r.json();
      if (r.ok) setHorariosOcupados(d.ocupados ?? {});
    } catch (e) { console.error(e); }
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const changeMonth = (dir: number) => {
    let m = curMonth + dir, y = curYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setCurMonth(m); setCurYear(y);
    resetAll();
  };

  const openDay = (d: number) => {
    setSelDate(d); setSelSlot(null); setSelServicio(null);
    setConfirmed(false); setShowSlots(true); setShowConfirm(false); setError('');
  };

  const selectSlot = (slot: string) => {
    setSelSlot(slot); setShowConfirm(true); setError('');
  };

  const resetAll = () => {
    setShowSlots(false); setShowConfirm(false);
    setSelDate(null); setSelSlot(null); setSelServicio(null);
    setConfirmed(false); setError('');
    loadBusy();
  };

  const handleConfirmar = async () => {
    if (!selSlot || !selServicio) return;
    if (!usuario || !token) { router.push('/login'); return; }
    try {
      setLoading(true); setError('');
      const fecha = `${curYear}-${String(curMonth + 1).padStart(2,'0')}-${String(selDate).padStart(2,'0')}`;
      const res = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ servicio_id: selServicio.id, fecha, hora: selSlot, estado: 'pendiente' }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error al crear la cita'); return; }
      setConfirmed(true); loadBusy();
    } catch { setError('Error de conexión. Inténtalo de nuevo.'); }
    finally { setLoading(false); }
  };

  // ── Render: cells ─────────────────────────────────────────────────────────
  const renderCells = () => {
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<View key={`e${i}`} style={[s.cell, { width: cellSize, height: cellSize }]} />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt         = new Date(curYear, curMonth, d);
      const isToday    = dt.toDateString() === today.toDateString();
      const isPast     = dt < today;
      const isWeekend  = dt.getDay() === 0 || dt.getDay() === 6;
      const isSelected = selDate === d && showSlots;
      const disabled   = isPast || isWeekend;
      const key        = String(d).padStart(2, '0');
      const occupied   = horariosOcupados[key] ?? horariosOcupados[String(d)] ?? [];
      const isFull     = occupied.length >= ALL_SLOTS.length;

      cells.push(
        <TouchableOpacity
          key={d}
          style={[
            s.cell,
            { width: cellSize, height: cellSize },
            isToday    && s.cellToday,
            isSelected && s.cellSelected,
            disabled   && s.cellDisabled,
            isFull && !disabled && s.cellFull,
          ]}
          onPress={() => !disabled && !isFull && openDay(d)}
          activeOpacity={disabled || isFull ? 1 : 0.7}
        >
          <Text style={[
            s.cellText,
            { fontSize: cellSize > 46 ? 15 : 12 },
            isToday    && s.cellTextToday,
            isSelected && s.cellTextSel,
            disabled   && s.cellTextDisabled,
          ]}>
            {d}
          </Text>
          {!disabled && !isFull && <View style={[s.dot, isSelected && s.dotSel]} />}
          {isFull && !disabled && <Text style={s.fullLabel}>lleno</Text>}
        </TouchableOpacity>
      );
    }
    return cells;
  };

  // ── Render: slots ─────────────────────────────────────────────────────────
  const renderSlots = (scrollable = true) => {
    if (selDate === null) return null;
    const key    = String(selDate).padStart(2, '0');
    const booked = horariosOcupados[key] ?? horariosOcupados[String(selDate)] ?? [];

    const slotList = (
      <>
        {ALL_SLOTS.map(slot => {
          const isBooked = booked.includes(slot);
          const isSel    = selSlot === slot;
          return (
            <TouchableOpacity
              key={slot}
              style={[s.slotRow, isBooked && s.slotBooked, isSel && s.slotSel]}
              onPress={() => !isBooked && selectSlot(slot)}
              activeOpacity={isBooked ? 1 : 0.7}
              disabled={isBooked}
            >
              <Text style={[s.slotText, isBooked && s.slotTextBooked, isSel && s.slotTextSel]}>
                {slot}
              </Text>
              {isBooked && <Text style={s.slotUnavail}>No disponible</Text>}
              {isSel    && <MaterialIcons name="check" size={13} color="#FFF" />}
            </TouchableOpacity>
          );
        })}
      </>
    );

    return (
      <>
        <View style={s.panelHeader}>
          <Text style={s.panelDate}>{selDate} de {MONTHS_ES[curMonth]}</Text>
          <TouchableOpacity onPress={resetAll} hitSlop={{ top:8,bottom:8,left:8,right:8 }}>
            <MaterialIcons name="close" size={18} color={MUTED} />
          </TouchableOpacity>
        </View>
        <Text style={s.panelLabel}>HORARIOS DISPONIBLES</Text>
        {scrollable
          ? <ScrollView showsVerticalScrollIndicator={false}>{slotList}</ScrollView>
          : slotList
        }
      </>
    );
  };

  // ── Render: confirm ───────────────────────────────────────────────────────
  const renderConfirm = (scrollable = true) => {
    if (!selSlot) return null;
    if (confirmed) return (
      <View style={s.successBox}>
        <MaterialIcons name="check-circle" size={44} color={BURGUNDY} />
        <Text style={s.successTitle}>Cita confirmada</Text>
        <Text style={s.successSub}>{selDate} de {MONTHS_ES[curMonth]} · {selSlot}h</Text>
        <Text style={s.successServ}>{selServicio?.nombre}</Text>
        <TouchableOpacity style={s.resetBtn} onPress={resetAll}>
          <Text style={s.resetBtnText}>Reservar otra cita</Text>
        </TouchableOpacity>
      </View>
    );

    const servList = (
      <>
        {servicios.map(serv => {
          const isSel = selServicio?.id === serv.id;
          return (
            <TouchableOpacity
              key={serv.id}
              style={[s.servRow, isSel && s.servRowSel]}
              onPress={() => setSelServicio(serv)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[s.servName, isSel && s.servNameSel]}>{serv.nombre}</Text>
                <Text style={s.servDur}>{serv.duracion} min</Text>
              </View>
              {isSel && <MaterialIcons name="check" size={15} color={BURGUNDY} />}
            </TouchableOpacity>
          );
        })}
      </>
    );

    return (
      <>
        <Text style={s.confirmTitle}>Confirmar reserva</Text>
        <Text style={s.confirmSub}>{selDate} de {MONTHS_ES[curMonth]} · {selSlot}h</Text>
        <Text style={s.panelLabel}>SERVICIO</Text>
        {scrollable
          ? <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>{servList}</ScrollView>
          : servList
        }
        {!usuario && <Text style={s.loginNote}>Debes iniciar sesión para reservar</Text>}
        {!!error   && <Text style={s.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[s.confirmBtn, (!selServicio || loading) && s.confirmBtnOff]}
          onPress={handleConfirmar}
          disabled={!selServicio || loading}
        >
          {loading
            ? <ActivityIndicator color="#FFF" />
            : <Text style={s.confirmBtnText}>RESERVAR CITA</Text>
          }
        </TouchableOpacity>
      </>
    );
  };

  // ── Render: calendar card ─────────────────────────────────────────────────
  const renderCal = () => (
    <View style={[s.calCard, { width: calCardW }]}>
      <View style={s.calHeader}>
        <TouchableOpacity style={s.navBtn} onPress={() => changeMonth(-1)}>
          <Text style={s.navBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={[s.monthLabel, { fontSize: isDesktop ? 16 : 15 }]}>
          {MONTHS[curMonth]} {curYear}
        </Text>
        <TouchableOpacity style={s.navBtn} onPress={() => changeMonth(1)}>
          <Text style={s.navBtnText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={[s.weekRow, { paddingHorizontal: gridPadH }]}>
        {WEEKDAYS.map(wd => (
          <Text key={wd} style={[s.weekLabel, { width: cellSize }]}>{wd}</Text>
        ))}
      </View>

      <View style={[s.grid, { paddingHorizontal: gridPadH }]}>
        {renderCells()}
      </View>
    </View>
  );

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          s.container,
          isDesktop && { maxWidth: MAX_W, alignSelf: 'center' as const, paddingHorizontal: H_PAD },
        ]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backRow}>
            <Text style={s.backText}>{'<- Volver'}</Text>
          </TouchableOpacity>
          <Text style={[s.pageTitle, { fontSize: isDesktop ? 28 : 22 }]}>RESERVA DE CITAS</Text>
          <Text style={s.pageSub}>Selecciona un día disponible para ver los horarios</Text>

          {isDesktop ? (
            // ── DESKTOP: 3 fixed columns, panels opacity:0 when hidden ────────
            <View style={s.row}>
              {renderCal()}
              <View style={[s.sidePanel, { width: SLOTS_W }, !showSlots && s.invisible]}>
                {showSlots && renderSlots(true)}
              </View>
              <View style={[s.sidePanel, { width: CONFIRM_W }, !showConfirm && s.invisible]}>
                {showConfirm && renderConfirm(true)}
              </View>
            </View>

          ) : (
            // ── MOBILE ────────────────────────────────────────────────────────
            <>
              {/* Calendar always visible */}
              {renderCal()}

              {/* Step 1: day selected → show slots in a 2-column grid */}
              {showSlots && !showConfirm && (
                <View style={s.mobilePanel}>
                  {renderSlots(false)}
                </View>
              )}

              {/* Step 2: slot selected → show confirm below */}
              {showConfirm && (
                <View style={s.mobilePanel}>
                  {/* Back to slots */}
                  <TouchableOpacity
                    onPress={() => setShowConfirm(false)}
                    style={s.mobileBack}
                  >
                    <MaterialIcons name="chevron-left" size={18} color={BURGUNDY} />
                    <Text style={s.mobileBackText}>Horarios</Text>
                  </TouchableOpacity>
                  {renderConfirm(false)}
                </View>
              )}
            </>
          )}
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: CREAM },
  scroll:        { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'space-between', paddingBottom: 32 },
  container:     { paddingHorizontal: 14, paddingTop: 16 },

  backRow:   { paddingVertical: 10 },
  backText:  { color: BURGUNDY, fontSize: 14, fontWeight: '600' },
  pageTitle: { fontWeight: '700', color: '#2C2A22', marginBottom: 4, letterSpacing: 0.5 },
  pageSub:   { fontSize: 12, color: MUTED, marginBottom: 16 },

  // ── Desktop row ───────────────────────────────────────────────────────────
  row:       { flexDirection: 'row', alignItems: 'flex-start', gap: GAP },
  invisible: { opacity: 0, pointerEvents: 'none' as const },

  // ── Calendar ─────────────────────────────────────────────────────────────
  calCard: {
    backgroundColor: '#FFF',
    borderRadius:    14,
    borderWidth:     1,
    borderColor:     BORDER,
    overflow:        'hidden',
    marginBottom:    14,
  },
  calHeader: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 16,
    paddingVertical:   14,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    backgroundColor:   CREAM,
  },
  navBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 0.5, borderColor: BORDER },
  navBtnText: { color: BURGUNDY, fontSize: 22, lineHeight: 26 },
  monthLabel: { color: '#2C2A22', fontWeight: '700', letterSpacing: 0.4 },

  weekRow: { flexDirection: 'row', paddingTop: 10, paddingBottom: 4, gap: 2 },
  weekLabel: {
    textAlign: 'center',
    fontSize: 10,
    color: MUTED,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 14, gap: 2 },

  cell:            { alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  cellToday:       { borderWidth: 1, borderColor: BURGUNDY },
  cellSelected:    { backgroundColor: BURGUNDY },
  cellDisabled:    { opacity: 0.25 },
  cellFull:        { backgroundColor: '#EDE8DE' },
  cellText:        { color: '#4A4035' },
  cellTextToday:   { color: BURGUNDY, fontWeight: '700' },
  cellTextSel:     { color: '#FFF', fontWeight: '700' },
  cellTextDisabled:{ color: MUTED },

  dot:       { width: 4, height: 4, borderRadius: 2, backgroundColor: BURGUNDY, position: 'absolute', bottom: 5 },
  dotSel:    { backgroundColor: '#FFF' },
  fullLabel: { fontSize: 7, color: MUTED, marginTop: 1 },

  // ── Desktop side panels ───────────────────────────────────────────────────
  sidePanel: {
    backgroundColor: '#FFF',
    borderRadius:    14,
    borderWidth:     1,
    borderColor:     BORDER,
    padding:         16,
    maxHeight:       620,
  },

  // ── Mobile panels ─────────────────────────────────────────────────────────
  // A single card below the calendar, full width, no maxHeight (scrolls naturally)
  mobilePanel: {
    backgroundColor: '#FFF',
    borderRadius:    14,
    borderWidth:     1,
    borderColor:     BORDER,
    padding:         16,
    marginBottom:    16,
  },

  mobileBack: {
    flexDirection:  'row',
    alignItems:     'center',
    marginBottom:   12,
    gap:            2,
  },
  mobileBackText: { color: BURGUNDY, fontSize: 13, fontWeight: '600' },

  // ── Shared panel internals ────────────────────────────────────────────────
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  panelDate:   { fontSize: 14, fontWeight: '700', color: '#2C2A22' },
  panelLabel:  { fontSize: 9, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },

  // Slots — on mobile rendered in a 2-column grid
  slotRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingVertical:   10,
    paddingHorizontal: 12,
    borderRadius:   8,
    borderWidth:    0.5,
    borderColor:    BORDER,
    marginBottom:   8,
    backgroundColor: '#FAFAF7',
  },
  slotBooked:    { backgroundColor: '#F0EBE1', borderColor: '#E0D8C8' },
  slotSel:       { backgroundColor: BURGUNDY, borderColor: BURGUNDY },
  slotText:      { fontSize: 14, color: '#4A4035', fontWeight: '500' },
  slotTextBooked:{ color: '#C4B89A', textDecorationLine: 'line-through' },
  slotTextSel:   { color: '#FFF', fontWeight: '600' },
  slotUnavail:   { fontSize: 10, color: '#C4B89A', fontStyle: 'italic' },

  // Confirm
  confirmTitle: { fontSize: 16, fontWeight: '700', color: '#2C2A22', marginBottom: 4 },
  confirmSub:   { fontSize: 12, color: MUTED, marginBottom: 14 },

  servRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical:   10,
    paddingHorizontal: 12,
    borderRadius:   8,
    borderWidth:    0.5,
    borderColor:    BORDER,
    marginBottom:   8,
    backgroundColor: '#FAFAF7',
  },
  servRowSel: { borderColor: BURGUNDY, backgroundColor: '#FBF5F6' },
  servName:   { fontSize: 13, color: '#2C2A22', fontWeight: '500' },
  servNameSel:{ color: BURGUNDY, fontWeight: '700' },
  servDur:    { fontSize: 11, color: MUTED, marginTop: 1 },

  loginNote:     { fontSize: 12, color: MUTED, textAlign: 'center', marginVertical: 10 },
  errorText:     { fontSize: 13, color: BURGUNDY, marginBottom: 8, textAlign: 'center' },
  confirmBtn:    { backgroundColor: BURGUNDY, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  confirmBtnOff: { backgroundColor: BORDER },
  confirmBtnText:{ color: '#FFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.8 },

  successBox:   { alignItems: 'center', paddingVertical: 28, gap: 10 },
  successTitle: { fontSize: 20, fontWeight: '700', color: BURGUNDY },
  successSub:   { fontSize: 14, color: '#4A4035' },
  successServ:  { fontSize: 13, color: MUTED },
  resetBtn:     { marginTop: 16, borderWidth: 0.5, borderColor: BORDER, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  resetBtnText: { fontSize: 14, color: BURGUNDY },
});
