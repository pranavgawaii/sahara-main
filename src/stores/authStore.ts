import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: 'student' | 'counselor';
  googleId: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(persist(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,

    setUser: (user: User) => {
      set({ user, isAuthenticated: true });
    },

    setToken: (token: string) => {
      set({ token });
      Cookies.set('auth_token', token, { expires: 1, secure: true, sameSite: 'strict' });
    },

    login: (user: User, token: string) => {
      set({ user, token, isAuthenticated: true, isLoading: false });
      Cookies.set('auth_token', token, { expires: 1, secure: true, sameSite: 'strict' });
    },

    logout: () => {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      Cookies.remove('auth_token');
      // Clear any other stored data
      localStorage.removeItem('auth-storage');
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    initializeAuth: () => {
      const token = Cookies.get('auth_token');
      if (token) {
        // In a real app, you'd validate the token with your backend
        // For now, we'll just check if it exists
        const storedAuth = localStorage.getItem('auth-storage');
        if (storedAuth) {
          try {
            const parsedAuth = JSON.parse(storedAuth);
            if (parsedAuth.state?.user && parsedAuth.state?.token) {
              set({
                user: parsedAuth.state.user,
                token: parsedAuth.state.token,
                isAuthenticated: true,
                isLoading: false
              });
              return;
            }
          } catch (error) {
            console.error('Error parsing stored auth:', error);
          }
        }
      }
      set({ isLoading: false });
    },
  }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
    }),
  }
));