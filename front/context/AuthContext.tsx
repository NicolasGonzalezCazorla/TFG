import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Al arrancar, comprueba si hay sesión guardada
  useEffect(() => {
    const cargarSesion = async () => {
      try {
        const tokenGuardado   = await AsyncStorage.getItem('token');
        const usuarioGuardado = await AsyncStorage.getItem('usuario');
        if (tokenGuardado && usuarioGuardado) {
          setToken(tokenGuardado);
          setUsuario(JSON.parse(usuarioGuardado));
        }
      } catch (e) {
        console.error('Error cargando sesion:', e);
      } finally {
        setLoading(false);
      }
    };
    cargarSesion();
  }, []);

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

    await AsyncStorage.setItem('token',   data.session.access_token);
    await AsyncStorage.setItem('usuario', JSON.stringify(user));

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
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
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