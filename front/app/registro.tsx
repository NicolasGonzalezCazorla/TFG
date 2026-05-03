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
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [exito,     setExito]     = useState(false);

  const handleRegister = async () => {
    if (!nombre || !apellidos || !email || !password || !password2) {
      setError('Rellena todos los campos');
      return;
    }
    if (password !== password2) {
      setError('Las contrasenas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await register(email, password, nombre, apellidos);
      setExito(true);
    } catch (e: any) {
      setError(e.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (exito) {
    return (
      <View style={s.successScreen}>
        <View style={[s.card, isDesktop && s.cardDesktop]}>
          <Text style={s.successIcon}>{'✓'}</Text>
          <Text style={s.successTitle}>{'Cuenta creada'}</Text>
          <Text style={s.successText}>
            {'Revisa tu email para confirmar tu cuenta y luego inicia sesion.'}
          </Text>
          <TouchableOpacity
            style={s.loginBtn}
            onPress={() => router.replace('/login')}
          >
            <Text style={s.loginBtnText}>{'IR AL LOGIN'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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

        <Text style={s.title}>{'Crear cuenta'}</Text>
        <Text style={s.subtitle}>{'Registrate para gestionar tus citas y reservas'}</Text>

        {/* Nombre */}
        <Text style={s.label}>{'Nombre'}</Text>
        <TextInput
          style={s.input}
          placeholder={'Tu nombre'}
          placeholderTextColor={MUTED}
          value={nombre}
          onChangeText={setNombre}
        />

        {/* Apellidos */}
        <Text style={s.label}>{'Apellidos'}</Text>
        <TextInput
          style={s.input}
          placeholder={'Tus apellidos'}
          placeholderTextColor={MUTED}
          value={apellidos}
          onChangeText={setApellidos}
        />

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
          placeholder={'Minimo 6 caracteres'}
          placeholderTextColor={MUTED}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Repetir password */}
        <Text style={s.label}>{'Repite la contrasena'}</Text>
        <TextInput
          style={s.input}
          placeholder={'Repite tu contrasena'}
          placeholderTextColor={MUTED}
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
        />

        {/* Error */}
        {error ? <Text style={s.error}>{error}</Text> : null}

        {/* Botón registro */}
        <TouchableOpacity
          style={[s.loginBtn, loading && s.loginBtnDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={s.loginBtnText}>{'CREAR CUENTA'}</Text>
          }
        </TouchableOpacity>

        {/* Ir a login */}
        <View style={s.registerRow}>
          <Text style={s.registerText}>{'Ya tienes cuenta? '}</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={s.registerLink}>{'Inicia sesion'}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: CREAM },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  successScreen: { flex: 1, backgroundColor: CREAM, justifyContent: 'center', padding: 24 },

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

  loginBtn:         { backgroundColor: BURGUNDY, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  loginBtnDisabled: { backgroundColor: BORDER },
  loginBtnText:     { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.8 },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  registerText: { fontSize: 13, color: MUTED },
  registerLink: { fontSize: 13, color: BURGUNDY, fontWeight: '700' },

  successIcon:  { fontSize: 48, color: BURGUNDY, textAlign: 'center', marginBottom: 12 },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#2C2A22', textAlign: 'center', marginBottom: 8 },
  successText:  { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
});