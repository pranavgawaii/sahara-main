import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Theme {
  mode: 'light' | 'dark' | 'auto';
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  colorScheme: 'default' | 'warm' | 'cool' | 'monochrome';
}

export interface UIPreferences {
  sidebarCollapsed: boolean;
  showWelcomeMessage: boolean;
  enableNotifications: boolean;
  enableSounds: boolean;
  autoSaveInterval: number; // in seconds
  defaultView: 'grid' | 'list';
  animationsEnabled: boolean;
  // Accessibility preferences
  colorBlindnessFilter?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  textScale?: 'small' | 'normal' | 'large' | 'extra-large' | 'huge';
}

export interface ModalState {
  isOpen: boolean;
  type: 'crisis' | 'feedback' | 'settings' | 'confirmation' | null;
  data?: any;
}

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UIState {
  // Theme and accessibility
  theme: Theme;
  preferences: UIPreferences;
  
  // UI state
  isLoading: boolean;
  loadingMessage: string;
  modal: ModalState;
  toasts: ToastState[];
  
  // Navigation
  breadcrumbs: Array<{ label: string; href?: string }>;
  
  // Actions
  setTheme: (theme: Partial<Theme>) => void;
  setPreferences: (preferences: Partial<UIPreferences>) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  
  // Modal actions
  openModal: (type: ModalState['type'], data?: any) => void;
  closeModal: () => void;
  
  // Toast actions
  addToast: (toast: Omit<ToastState, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Navigation actions
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void;
  addBreadcrumb: (breadcrumb: { label: string; href?: string }) => void;
  
  // Utility actions
  resetUI: () => void;
}

const defaultTheme: Theme = {
  mode: 'auto',
  reducedMotion: false,
  highContrast: false,
  fontSize: 'md',
  colorScheme: 'default',
};

const defaultPreferences: UIPreferences = {
  sidebarCollapsed: false,
  showWelcomeMessage: true,
  enableNotifications: true,
  enableSounds: true,
  autoSaveInterval: 30,
  defaultView: 'grid',
  animationsEnabled: true,
  colorBlindnessFilter: 'none',
  textScale: 'normal',
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: defaultTheme,
      preferences: defaultPreferences,
      isLoading: false,
      loadingMessage: '',
      modal: { isOpen: false, type: null },
      toasts: [],
      breadcrumbs: [],

      // Theme actions
      setTheme: (newTheme) =>
        set((state) => ({
          theme: { ...state.theme, ...newTheme },
        })),

      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      // Loading actions
      setLoading: (isLoading, message = '') =>
        set({ isLoading, loadingMessage: message }),

      // Modal actions
      openModal: (type, data) =>
        set({ modal: { isOpen: true, type, data } }),

      closeModal: () =>
        set({ modal: { isOpen: false, type: null, data: undefined } }),

      // Toast actions
      addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };
        
        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));
        
        // Auto-remove toast after duration
        if (toast.duration !== 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, toast.duration || 5000);
        }
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),

      clearToasts: () => set({ toasts: [] }),

      // Navigation actions
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
      
      addBreadcrumb: (breadcrumb) =>
        set((state) => ({
          breadcrumbs: [...state.breadcrumbs, breadcrumb],
        })),

      // Reset
      resetUI: () =>
        set({
          theme: defaultTheme,
          preferences: defaultPreferences,
          isLoading: false,
          loadingMessage: '',
          modal: { isOpen: false, type: null },
          toasts: [],
          breadcrumbs: [],
        }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        preferences: state.preferences,
      }),
    }
  )
);

// Utility hooks for common UI patterns
export const useToast = () => {
  const { addToast } = useUIStore();
  
  return {
    toast: addToast,
    success: (title: string, description?: string) =>
      addToast({ type: 'success', title, description }),
    error: (title: string, description?: string) =>
      addToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) =>
      addToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) =>
      addToast({ type: 'info', title, description }),
  };
};

export const useModal = () => {
  const { modal, openModal, closeModal } = useUIStore();
  
  return {
    modal,
    openModal,
    closeModal,
    isOpen: modal.isOpen,
  };
};

export const useTheme = () => {
  const { theme, setTheme } = useUIStore();
  
  return {
    theme,
    setTheme,
    isDark: theme.mode === 'dark' || 
      (theme.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    isReducedMotion: theme.reducedMotion || 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
};