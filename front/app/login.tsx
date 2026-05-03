import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

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
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Rellena todos los campos');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      router.replace('/');
    } catch (e: any) {
      setError(e.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[s.card, isDesktop && s.cardDesktop]}>

        {/* Logo */}
        <View style={s.logoRow}>
          <View style={s.logoCircle} />
          <Text style={s.brandName}>{'Estetica Alicia'}</Text>
        </View>

        <Text style={s.title}>{'Iniciar sesion'}</Text>
        <Text style={s.subtitle}>{'Accede a tu cuenta para gestionar tus citas y reservas'}</Text>

        {/* Email */}
        <Text style={s.label}>{'Email'}</Text>
        <TextInput
          style={s.input}
          placeholder={'tu@email.com'}
          placeholderTextColor={MUTED}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <Text style={s.label}>{'Contrasena'}</Text>
        <TextInput
          style={s.input}
          placeholder={'Tu contrasena'}
          placeholderTextColor={MUTED}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Error */}
        {error ? <Text style={s.error}>{error}</Text> : null}

        {/* Botón login */}
        <TouchableOpacity
          style={[s.loginBtn, loading && s.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={s.loginBtnText}>{'ENTRAR'}</Text>
          }
        </TouchableOpacity>

        {/* Continuar como invitado */}
        <TouchableOpacity
          style={s.guestBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={s.guestBtnText}>{'Continuar como invitado'}</Text>
        </TouchableOpacity>

        {/* Ir a registro */}
        <View style={s.registerRow}>
          <Text style={s.registerText}>{'No tienes cuenta? '}</Text>
          <TouchableOpacity onPress={() => router.push('/registro')}>
            <Text style={s.registerLink}>{'Registrate'}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: CREAM },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 28,
    gap: 12,
  },
  cardDesktop: {
    maxWidth: 440,
    alignSelf: 'center',
    width: '100%',
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GOLD,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C2A22',
  },

  title:    { fontSize: 22, fontWeight: '700', color: '#2C2A22' },
  subtitle: { fontSize: 13, color: MUTED, marginBottom: 8, lineHeight: 19 },

  label: {
    fontSize: 11,
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  input: {
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#2C2A22',
    backgroundColor: '#FAFAF7',
  },

  error: {
    fontSize: 13,
    color: BURGUNDY,
    backgroundColor: '#FBF5F6',
    padding: 10,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#E8C4C8',
  },

  loginBtn: {
    backgroundColor: BURGUNDY,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  loginBtnDisabled: { backgroundColor: BORDER },
  loginBtnText:     { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.8 },

  guestBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: BORDER,
  },
  guestBtnText: { color: MUTED, fontSize: 13 },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  registerText: { fontSize: 13, color: MUTED },
  registerLink: { fontSize: 13, color: BURGUNDY, fontWeight: '700' },
});