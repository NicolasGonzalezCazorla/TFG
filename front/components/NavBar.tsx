import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const BURGUNDY = '#63202C';
const GOLD     = '#C6A75E';
const CREAM    = '#F5F0E8';
const BORDER   = '#C4B89A';

export default function NavBar() {
  const router   = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { usuario, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.replace('/');
  };

  const navegar = (ruta: string) => {
    setMenuOpen(false);
    router.push(ruta as any);
  };

  const LINKS = [
    { label: 'INICIO',     ruta: '/' },
    { label: 'SERVICIOS',  ruta: '/servicio' },
    { label: 'PRODUCTOS',  ruta: '/productos' },
    { label: 'CONTACTOS',  ruta: '/contacto' },
    { label: 'RESERVAR',   ruta: '/reserva' },
    ...(isAdmin ? [{ label: 'ADMIN', ruta: '/admin' }] : []),
  ];

  return (
    <SafeAreaView edges={['top']} style={s.safeArea}>
      <View style={s.header}>

        {/* Logo */}
        <TouchableOpacity
          style={s.leftContainer}
          onPress={() => router.push('/')}
        >
          <Image source={require('../assets/images/Logo.png')} style={s.logo} />
        </TouchableOpacity>

        {/* Desktop: links + avatar */}
        {isDesktop ? (
          <View style={s.rightContainer}>
            <View style={s.navLinks}>
              {LINKS.map((link) => (
                <TouchableOpacity
                  key={link.ruta}
                  onPress={() => navegar(link.ruta)}
                  style={s.navItem}
                >
                  <Text style={[
                    s.navText,
                    link.label === 'ADMIN' && { color: GOLD },
                  ]}>
                    {link.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {usuario ? (
              <TouchableOpacity
                style={s.avatarWrapper}
                onPress={() => navegar('/Perfil')}
                onLongPress={handleLogout}
              >
                <Image source={require('../assets/images/Logo.png')} style={s.avatar} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={s.loginBtn}
                onPress={() => navegar('/login')}
              >
                <Text style={s.loginBtnText}>{'LOGIN'}</Text>
              </TouchableOpacity>
            )}
          </View>

        ) : (
          // Móvil: hamburguesa + avatar
          <View style={s.mobileRight}>
            {usuario ? (
              <TouchableOpacity
                onPress={() => navegar('/Perfil')}
                style={{ marginRight: 12 }}
              >
                <Image source={require('../assets/images/Logo.png')} style={s.avatar} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[s.loginBtn, { marginRight: 12 }]}
                onPress={() => navegar('/login')}
              >
                <Text style={s.loginBtnText}>{'LOGIN'}</Text>
              </TouchableOpacity>
            )}

            {/* Botón hamburguesa */}
            <TouchableOpacity
              onPress={() => setMenuOpen(true)}
              style={s.hamburger}
            >
              <View style={s.hamburgerLine} />
              <View style={s.hamburgerLine} />
              <View style={s.hamburgerLine} />
            </TouchableOpacity>
          </View>
        )}

      </View>

      {/* Modal menú móvil */}
      <Modal
        visible={menuOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={s.modalBackdrop}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={s.mobileMenu}>

            {/* Cabecera */}
            <View style={s.mobileMenuHeader}>
              <TouchableOpacity style={s.leftContainer} onPress={() => router.push('/')}>
                <Image source={require('../assets/images/Logo.png')} style={s.logo} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <MaterialIcons name="close" size={24} color="#2C2A22" style={s.closeBtn} />
              </TouchableOpacity>
            </View>

            {/* Links */}
            {LINKS.map((link) => (
              <TouchableOpacity
                key={link.ruta}
                style={s.mobileMenuItem}
                onPress={() => navegar(link.ruta)}
              >
                <Text style={[
                  s.mobileMenuText,
                  link.label === 'ADMIN' && { color: GOLD },
                ]}>
                  {link.label}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Separador */}
            <View style={s.separator} />

            {/* Auth */}
            {usuario ? (
              <>
                <TouchableOpacity
                  style={s.mobileMenuItem}
                  onPress={() => navegar('/Perfil')}
                >
                  <Text style={s.mobileMenuText}>{'MI PERFIL'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.mobileMenuItem}
                  onPress={handleLogout}
                >
                  <Text style={[s.mobileMenuText, { color: BURGUNDY }]}>
                    {'CERRAR SESION'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={s.mobileMenuItem}
                  onPress={() => navegar('/login')}
                >
                  <Text style={[s.mobileMenuText, { color: BURGUNDY, fontWeight: '700' }]}>
                    {'INICIAR SESION'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.mobileMenuItem}
                  onPress={() => navegar('/registro')}
                >
                  <Text style={s.mobileMenuText}>{'REGISTRARSE'}</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { backgroundColor: '#FFFFFF' },
  header: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f1e8',
  },

  leftContainer: { flexDirection: 'row', alignItems: 'center' },
  logo:          { width: 40, height: 40, resizeMode: 'contain' },

  rightContainer: { flexDirection: 'row', alignItems: 'center' },
  navLinks:       { flexDirection: 'row', marginRight: 15 },
  navItem:        { marginLeft: 20, alignItems: 'center' },
  navText:        { fontSize: 12, color: '#5a1e2a', fontWeight: '400' },

  avatarWrapper: { marginLeft: 12 },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: GOLD,
  },

  loginBtn: {
    borderWidth: 1,
    borderColor: BURGUNDY,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  loginBtnText: { fontSize: 12, color: BURGUNDY, fontWeight: '700', letterSpacing: 0.8 },

  // ── Móvil ──
  mobileRight:    { flexDirection: 'row', alignItems: 'center' },
  hamburger:      { padding: 6, gap: 5 },
  hamburgerLine:  { width: 22, height: 2, backgroundColor: BURGUNDY, borderRadius: 1 },

  // Modal menú
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  mobileMenu: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 48,
  },
  mobileMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeBtn: { fontSize: 18, color: '#9A8E7A', padding: 4 },

  mobileMenuItem: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0EBE1',
  },
  mobileMenuText: {
    fontSize: 14,
    color: '#2C2A22',
    letterSpacing: 0.8,
  },

  separator: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 8,
  },
});