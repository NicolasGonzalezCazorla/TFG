import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, useWindowDimensions, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/Alertmodal';

const BURGUNDY = '#63202C';
const CREAM    = '#F5F0E8';
const BORDER   = '#C4B89A';
const MUTED    = '#9A8E7A';
const GOLD     = '#C6A75E';

export default function Registro() {
  const { register } = useAuth();
  const router       = useRouter();
  const { width }    = useWindowDimensions();
  const isDesktop    = width >= 768;

  const [nombre,    setNombre]    = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [password2, setPassword2] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [exito,     setExito]     = useState(false);

  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'error' | 'success' | 'info';
    title: string;
    message: string;
    onClose?: () => void;
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

  const handleRegister = async () => {
    if (!nombre || !apellidos || !email || !password || !password2) {
      showAlert('error', 'Campos vacíos', 'Por favor, rellena todos los campos antes de continuar.');
      return;
    }
    if (password !== password2) {
      showAlert('error', 'Contraseñas distintas', 'Las dos contraseñas que has introducido no coinciden.');
      return;
    }
    if (password.length < 6) {
      showAlert('error', 'Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    try {
      setLoading(true);
      await register(email, password, nombre, apellidos);
      setExito(true);
    } catch (e: any) {
      showAlert('error', 'Error al registrarse', e.message || 'No se pudo crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── Pantalla de éxito ─────────────────────────────────────────────────────
  if (exito) {
    return (
      <View style={s.successScreen}>
        <View style={[s.card, isDesktop && s.cardDesktop]}>
          <MaterialIcons name="check-circle" size={52} color="#4A7C59" style={{ alignSelf: 'center' }} />
          <Text style={s.successTitle}>¡Cuenta creada!</Text>
          <Text style={s.successText}>
            Revisa tu email para confirmar tu cuenta y luego inicia sesión.
          </Text>
          <TouchableOpacity style={s.loginBtn} onPress={() => router.replace('/login')}>
            <Text style={s.loginBtnText}>IR AL LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Formulario ────────────────────────────────────────────────────────────
  return (
    <>
      <ScrollView style={s.screen} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[s.card, isDesktop && s.cardDesktop]}>

          {/* Logo */}
          <View style={s.logoRow}>
            <View style={s.logoCircle} />
            <Text style={s.brandName}>Estética Alicia</Text>
          </View>

          <Text style={s.title}>Crear cuenta</Text>
          <Text style={s.subtitle}>Regístrate para gestionar tus citas y reservas</Text>

          <Text style={s.label}>Nombre</Text>
          <TextInput style={s.input} placeholder="Tu nombre" placeholderTextColor={MUTED} value={nombre} onChangeText={setNombre} />

          <Text style={s.label}>Apellidos</Text>
          <TextInput style={s.input} placeholder="Tus apellidos" placeholderTextColor={MUTED} value={apellidos} onChangeText={setApellidos} />

          <Text style={s.label}>Email</Text>
          <TextInput style={s.input} placeholder="tu@email.com" placeholderTextColor={MUTED} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          <Text style={s.label}>Contraseña</Text>
          <TextInput style={s.input} placeholder="Mínimo 6 caracteres" placeholderTextColor={MUTED} value={password} onChangeText={setPassword} secureTextEntry />

          <Text style={s.label}>Repite la contraseña</Text>
          <TextInput style={s.input} placeholder="Repite tu contraseña" placeholderTextColor={MUTED} value={password2} onChangeText={setPassword2} secureTextEntry />

          <TouchableOpacity
            style={[s.loginBtn, loading && s.loginBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={s.loginBtnText}>CREAR CUENTA</Text>
            }
          </TouchableOpacity>

          <View style={s.registerRow}>
            <Text style={s.registerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={s.registerLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

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
  screen:        { flex: 1, backgroundColor: CREAM },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  successScreen: { flex: 1, backgroundColor: CREAM, justifyContent: 'center', padding: 24 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 28,
    gap: 12,
  },
  cardDesktop: { maxWidth: 440, alignSelf: 'center', width: '100%' },

  logoRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  logoCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: GOLD },
  brandName:  { fontSize: 18, fontWeight: '700', color: '#2C2A22' },

  title:        { fontSize: 22, fontWeight: '700', color: '#2C2A22' },
  subtitle:     { fontSize: 13, color: MUTED, marginBottom: 8, lineHeight: 19 },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#2C2A22', textAlign: 'center' },
  successText:  { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 21 },

  label: { fontSize: 11, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '600' },
  input: {
    borderWidth: 0.5, borderColor: BORDER, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#2C2A22', backgroundColor: '#FAFAF7',
  },

  loginBtn:         { backgroundColor: BURGUNDY, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  loginBtnDisabled: { backgroundColor: BORDER },
  loginBtnText:     { color: '#FFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.8 },

  registerRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  registerText: { fontSize: 13, color: MUTED },
  registerLink: { fontSize: 13, color: BURGUNDY, fontWeight: '700' },
});
