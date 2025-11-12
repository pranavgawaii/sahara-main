// Responsive Breakpoints (Tailwind CSS defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Application Configuration
export const APP_CONFIG = {
  name: 'Sahara',
  version: '1.0.0',
  description: 'Mental Health & Wellbeing Support Platform',
  supportEmail: 'support@wellbeingbuddy.com',
  privacyPolicyUrl: '/privacy',
  termsOfServiceUrl: '/terms',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Authentication
export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  rememberMeDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;



// Problem Categories
export const PROBLEM_CATEGORIES = {
  ACADEMIC: {
    id: 'academic',
    label: 'Academic Stress',
    color: 'hsl(var(--academic-neutral))',
    icon: '📚',
    description: 'Study pressure, exams, grades, academic performance',
  },
  RELATIONSHIP: {
    id: 'relationship',
    label: 'Relationships',
    color: 'hsl(var(--relationship-warm))',
    icon: '💝',
    description: 'Family, friends, romantic relationships, social connections',
  },
  CAREER: {
    id: 'career',
    label: 'Career & Future',
    color: 'hsl(var(--career-focused))',
    icon: '🎯',
    description: 'Career planning, job search, future uncertainty',
  },
  FAMILY: {
    id: 'family',
    label: 'Family Issues',
    color: 'hsl(var(--family-gentle))',
    icon: '🏠',
    description: 'Family conflicts, expectations, support issues',
  },
  SLEEP: {
    id: 'sleep',
    label: 'Sleep & Health',
    color: 'hsl(var(--sleep-dark))',
    icon: '😴',
    description: 'Sleep disorders, physical health, lifestyle habits',
  },
  SOCIAL: {
    id: 'social',
    label: 'Social Anxiety',
    color: 'hsl(var(--social-open))',
    icon: '🤝',
    description: 'Social situations, public speaking, making friends',
  },
  MIXED: {
    id: 'mixed',
    label: 'Multiple Issues',
    color: 'hsl(var(--mixed-flexible))',
    icon: '🌈',
    description: 'Combination of different concerns',
  },
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  maxMessageLength: 2000,
  typingIndicatorTimeout: 3000,
  messageRetryAttempts: 3,
  fileUploadMaxSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  autoSaveInterval: 30000, // 30 seconds
} as const;

// Notification Settings
export const NOTIFICATION_CONFIG = {
  defaultDuration: 5000, // 5 seconds
  maxNotifications: 5,
  positions: {
    topRight: 'top-right',
    topLeft: 'top-left',
    bottomRight: 'bottom-right',
    bottomLeft: 'bottom-left',
    topCenter: 'top-center',
    bottomCenter: 'bottom-center',
  },
} as const;

// Accessibility Settings
export const A11Y_CONFIG = {
  focusRingWidth: '2px',
  focusRingColor: 'hsl(var(--ring))',
  minTouchTarget: 44, // pixels
  colorContrastRatio: 4.5,
  animationDuration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  reducedMotionQuery: '(prefers-reduced-motion: reduce)',
} as const;

// Form Validation
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  institutionCode: /^[A-Z0-9]{4,8}$/,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: 'wellbeing-buddy-theme',
  language: 'wellbeing-buddy-language',
  onboarding: 'wellbeing-buddy-onboarding',
  preferences: 'wellbeing-buddy-preferences',
  draftMessages: 'wellbeing-buddy-drafts',
  accessibility: 'wellbeing-buddy-a11y',
} as const;

// Route Paths
export const ROUTES = {
  home: '/',
  onboarding: '/onboarding',
  simpleOnboarding: '/simple-onboarding',
  dashboard: '/dashboard',
  chat: '/chat',
  resources: '/resources',
  booking: '/booking',
  tracker: '/tracker',
  counsellor: '/counsellor',
  problems: '/problems',
  settings: '/settings',
  privacy: '/privacy',
  terms: '/terms',
  notFound: '/404',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  enableGroupChat: true,
  enableVideoCall: false,
  enablePeerSupport: true,
  enableGamification: true,
  enableAdvancedAnalytics: false,
  enableOfflineMode: false,
} as const;

// Performance Thresholds
export const PERFORMANCE_CONFIG = {
  lazyLoadThreshold: 100, // pixels
  debounceDelay: 300, // milliseconds
  throttleDelay: 100, // milliseconds
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 50, // number of items
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network connection error. Please check your internet connection.',
  unauthorized: 'You are not authorized to access this resource.',
  forbidden: 'Access to this resource is forbidden.',
  notFound: 'The requested resource was not found.',
  serverError: 'An internal server error occurred. Please try again later.',
  validationError: 'Please check your input and try again.',
  sessionExpired: 'Your session has expired. Please log in again.',
  fileUploadError: 'File upload failed. Please try again.',
  genericError: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  profileUpdated: 'Profile updated successfully!',
  messagesSent: 'Message sent successfully!',
  appointmentBooked: 'Appointment booked successfully!',

  settingsSaved: 'Settings saved successfully!',
  dataExported: 'Data exported successfully!',
  passwordChanged: 'Password changed successfully!',
} as const;