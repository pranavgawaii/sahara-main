// Core Application Types
export interface User {
  id: string;
  email?: string;
  name?: string;
  role: 'student' | 'counsellor' | 'staff' | 'admin';
  institutionCode: string;
  ephemeralHandle?: string;
  language: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication & Session Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

export interface ConsentFlags {
  dataProcessing: boolean;
  anonymousChat: boolean;
  counselorContact: boolean;
  researchParticipation?: boolean;
  marketingCommunications?: boolean;
}



// Chat & Communication Types
export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'counsellor' | 'system';
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, any>;
  isEdited?: boolean;
  editedAt?: Date;
}

export interface ChatSession {
  id: string;
  institutionCode: string;
  problemId?: string;
  participants: string[];
  isActive: boolean;
  startedAt: Date;
  endedAt?: Date;
  metadata?: Record<string, any>;
}

// Resource & Content Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'article' | 'video' | 'audio' | 'exercise' | 'tool';
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in minutes
  author: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Booking & Appointment Types
export interface Appointment {
  id: string;
  studentId: string;
  counsellorId: string;
  scheduledAt: Date;
  duration: number; // in minutes
  type: 'individual' | 'group' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  notes?: string;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tracking & Analytics Types
export interface MoodEntry {
  id: string;
  userId: string;
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  notes?: string;
  tags: string[];
  timestamp: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  category: 'chat' | 'resource' | 'booking' | 'mood';
  metadata?: Record<string, any>;
  timestamp: Date;
}

// UI & Component Types
export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  details?: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
  timestamp: Date;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
  options?: { label: string; value: string | number }[];
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Theme & Styling Types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
}

// Accessibility Types
export interface A11yConfig {
  screenReader: boolean;
  keyboardNavigation: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number;
  announcements: boolean;
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};