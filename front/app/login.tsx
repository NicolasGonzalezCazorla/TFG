import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, useWindowDimensions, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/Alertmodal';

const BURGUNDY = '#63202C';
const CREAM    = '#F5F0E8';
const BORDER   = '#C4B89A';
const MUTED    = '#9A8E7A';
const GOLD     = '#C6A75E';

export default function Login() {
  const { login }  = useAuth();
  const router     = useRouter();
  const { width }  = useWindowDimensions();
  const isDesktop  = width >= 768;

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  // Alert modal state
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

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('error', 'Campos vacíos', 'Por favor, rellena el email y la contraseña.');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      // Navegar directamente — el login correcto no necesita modal
      router.replace('/');
    } catch (e: any) {
      showAlert('error', 'Error al iniciar sesión', e.message || 'Comprueba tus credenciales e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={s.screen} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[s.card, isDesktop && s.cardDesktop]}>

          {/* Logo */}
          <View style={s.logoRow}>
            <View style={s.logoCircle} />
            <Text style={s.brandName}>Estética Alicia</Text>
          </View>

          <Text style={s.title}>Iniciar sesión</Text>
          <Text style={s.subtitle}>Accede a tu cuenta para gestionar tus citas y reservas</Text>

          <Text style={s.label}>Email</Text>
          <TextInput
            style={s.input}
            placeholder="tu@email.com"
            placeholderTextColor={MUTED}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={s.label}>Contraseña</Text>
          <TextInput
            style={s.input}
            placeholder="Tu contraseña"
            placeholderTextColor={MUTED}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[s.loginBtn, loading && s.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={s.loginBtnText}>ENTRAR</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={s.guestBtn} onPress={() => router.replace('/')}>
            <Text style={s.guestBtnText}>Continuar como invitado</Text>
          </TouchableOpacity>

          <View style={s.registerRow}>
            <Text style={s.registerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/registro')}>
              <Text style={s.registerLink}>Regístrate</Text>
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

  title:    { fontSize: 22, fontWeight: '700', color: '#2C2A22' },
  subtitle: { fontSize: 13, color: MUTED, marginBottom: 8, lineHeight: 19 },

  label: { fontSize: 11, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '600' },
  input: {
    borderWidth: 0.5, borderColor: BORDER, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#2C2A22', backgroundColor: '#FAFAF7',
  },

  loginBtn:         { backgroundColor: BURGUNDY, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  loginBtnDisabled: { backgroundColor: BORDER },
  loginBtnText:     { color: '#FFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.8 },

  guestBtn:     { paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 0.5, borderColor: BORDER },
  guestBtnText: { color: MUTED, fontSize: 13 },

  registerRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  registerText: { fontSize: 13, color: MUTED },
  registerLink: { fontSize: 13, color: BURGUNDY, fontWeight: '700' },
});
