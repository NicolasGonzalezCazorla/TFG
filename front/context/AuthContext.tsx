import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { API_URL } from '../constants';

type Rol = 'invitado' | 'cliente' | 'admin';

type Usuario = {
  id: string;
  email: string;
  rol: Rol;
  nombre?: string;
  apellidos?: string;
};

type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nombre: string, apellidos: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isCliente: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Storage universal — localStorage en web, AsyncStorage en móvil
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage.removeItem(key);
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario,  setUsuario]  = useState<Usuario | null>(null);
  const [token,    setToken]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    cargarSesion();
  }, []);

  const cargarSesion = async () => {
    try {
      const tokenGuardado        = await storage.getItem('token');
      const refreshTokenGuardado = await storage.getItem('refresh_token');
      const usuarioGuardado      = await storage.getItem('usuario');

      if (!tokenGuardado || !usuarioGuardado) {
        setLoading(false);
        return;
      }

      // Verifica el token actual
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${tokenGuardado}` },
      });

      if (res.ok) {
        setToken(tokenGuardado);
        setUsuario(JSON.parse(usuarioGuardado));
      } else if (refreshTokenGuardado) {
        await refrescarToken(refreshTokenGuardado);
      } else {
        await limpiarSesion();
      }

    } catch (e) {
      console.error('Error cargando sesion:', e);
      try {
        const tokenGuardado   = await storage.getItem('token');
        const usuarioGuardado = await storage.getItem('usuario');
        if (tokenGuardado && usuarioGuardado) {
          setToken(tokenGuardado);
          setUsuario(JSON.parse(usuarioGuardado));
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const refrescarToken = async (refreshToken: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) {
        await limpiarSesion();
        return;
      }

      const data = await res.json();

      await storage.setItem('token',         data.session.access_token);
      await storage.setItem('refresh_token', data.session.refresh_token);

      const user: Usuario = {
        id:        data.user.id,
        email:     data.user.email,
        rol:       data.perfil?.rol ?? 'cliente',
        nombre:    data.perfil?.nombre,
        apellidos: data.perfil?.apellidos,
      };

      await storage.setItem('usuario', JSON.stringify(user));
      setToken(data.session.access_token);
      setUsuario(user);

    } catch (e) {
      console.error('Error refrescando token:', e);
      await limpiarSesion();
    }
  };

  const limpiarSesion = async () => {
    await storage.removeItem('token');
    await storage.removeItem('refresh_token');
    await storage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesion');

    const user: Usuario = {
      id:        data.user.id,
      email:     data.user.email,
      rol:       data.perfil?.rol ?? 'cliente',
      nombre:    data.perfil?.nombre,
      apellidos: data.perfil?.apellidos,
    };

    await storage.setItem('token',         data.session.access_token);
    await storage.setItem('refresh_token', data.session.refresh_token);
    await storage.setItem('usuario',       JSON.stringify(user));

    setToken(data.session.access_token);
    setUsuario(user);
  };

  const register = async (email: string, password: string, nombre: string, apellidos: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nombre, apellidos }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al registrarse');
  };

  const logout = async () => {
    await limpiarSesion();
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      loading,
      login,
      register,
      logout,
      isAdmin:   usuario?.rol === 'admin',
      isCliente: usuario?.rol === 'cliente',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}