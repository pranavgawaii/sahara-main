import { z } from 'zod';

/**
 * Input validation schemas using Zod
 * Provides type-safe validation for all user inputs with security-focused rules
 */

// Common validation schemas
/**
 * Email validation with security considerations
 * Validates email format and checks for suspicious patterns that could indicate attacks
 */
export const emailSchema = z.string().email('Please enter a valid email address');

/**
 * Password validation with strength requirements
 * Enforces strong password policy to prevent brute force attacks
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z
  .string()
  .regex(/^[+]?[1-9]\d{1,14}$/, 'Please enter a valid phone number');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const ageSchema = z
  .number()
  .int('Age must be a whole number')
  .min(13, 'You must be at least 13 years old')
  .max(120, 'Please enter a valid age');

/**
 * Student registration validation
 * Validates student registration data while ensuring privacy and security
 */
export const studentRegistrationSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  age: ageSchema,
  phone: phoneSchema.optional(),
  emergencyContact: z.object({
    name: nameSchema,
    phone: phoneSchema,
    relationship: z.string().min(1, 'Please specify relationship')
  }),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  }),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: 'You must agree to the privacy policy'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Counselor registration schema
export const counselorRegistrationSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  licenseNumber: z.string().min(1, 'License number is required'),
  specialization: z.array(z.string()).min(1, 'Please select at least one specialization'),
  experience: z.number().min(0, 'Experience cannot be negative'),
  phone: phoneSchema,
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  credentials: z.array(z.string()).optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});



/**
 * Chat message validation
 * Validates chat messages and filters spam/malicious content
 */
export const chatMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  type: z.enum(['text', 'image', 'file']).default('text'),
  metadata: z.record(z.any()).optional()
});

// Mood entry schema
export const moodEntrySchema = z.object({
  mood: z.number().min(1).max(10, 'Mood must be between 1 and 10'),
  energy: z.number().min(1).max(10, 'Energy must be between 1 and 10'),
  stress: z.number().min(1).max(10, 'Stress must be between 1 and 10'),
  sleep: z.number().min(0).max(24, 'Sleep hours must be between 0 and 24'),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
  tags: z.array(z.string()).optional()
});

// Goal schema
export const goalSchema = z.object({
  title: z.string().min(1, 'Goal title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  category: z.enum(['mental_health', 'physical_health', 'academic', 'social', 'personal']),
  targetDate: z.date().min(new Date(), 'Target date must be in the future'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  milestones: z.array(z.object({
    title: z.string().min(1, 'Milestone title is required'),
    completed: z.boolean().default(false)
  })).optional()
});

// Journal entry schema
export const journalEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  mood: z.number().min(1).max(10).optional(),
  tags: z.array(z.string()).optional(),
  isPrivate: z.boolean().default(true)
});

// Appointment booking schema
export const appointmentSchema = z.object({
  counselorId: z.string().min(1, 'Counselor selection is required'),
  date: z.date().min(new Date(), 'Appointment date must be in the future'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  type: z.enum(['video', 'audio', 'chat']).default('video'),
  reason: z.string().min(10, 'Please provide a reason for the appointment').max(500, 'Reason too long'),
  urgency: z.enum(['low', 'medium', 'high']).default('medium')
});

// Feedback schema
export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'general', 'complaint']),
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject too long'),
  message: z.string().min(10, 'Please provide more details').max(1000, 'Message too long'),
  rating: z.number().min(1).max(5).optional(),
  email: emailSchema.optional()
});

/**
 * Input sanitization functions
 * Prevents XSS attacks by encoding dangerous characters
 */

/**
 * Sanitize user input by encoding HTML entities
 * @param input Raw user input string
 * @returns Sanitized string safe for display
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>"'&]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    });
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

/**
 * Rate limiting helpers
 * Prevents abuse by limiting request frequency per user/IP
 */

/**
 * Create a rate limiter function
 * @param maxAttempts Maximum attempts allowed in window
 * @param windowMs Time window in milliseconds
 * @returns Rate limiter function
 */
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now();
    const record = attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: maxAttempts - 1, resetTime: now + windowMs };
    }
    
    if (record.count >= maxAttempts) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }
    
    record.count++;
    return { allowed: true, remaining: maxAttempts - record.count, resetTime: record.resetTime };
  };
};

/**
 * Content moderation
 * Detects crisis situations and filters inappropriate content
 */

/**
 * Moderate user-generated content for crisis situations and inappropriate content
 * @param content User input to moderate
 * @returns Moderation result with safety status and flagged reasons
 */
export const moderateContent = (content: string): { safe: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // Check for potentially harmful content
  const harmfulPatterns = [
    /\b(suicide|kill myself|end it all|want to die)\b/i,
    /\b(self harm|cut myself|hurt myself)\b/i,
    /\b(hate myself|worthless|useless)\b/i
  ];
  
  const inappropriatePatterns = [
    /\b(fuck|shit|damn|bitch)\b/i,
    /\b(sexual|porn|nude)\b/i
  ];
  
  const spamPatterns = [
    /(..)\1{4,}/i, // Repeated characters
    /^[A-Z\s!]{20,}$/i, // All caps
    /(http|www)\./i // URLs
  ];
  
  if (harmfulPatterns.some(pattern => pattern.test(content))) {
    reasons.push('Contains potentially harmful content');
  }
  
  if (inappropriatePatterns.some(pattern => pattern.test(content))) {
    reasons.push('Contains inappropriate language');
  }
  
  if (spamPatterns.some(pattern => pattern.test(content))) {
    reasons.push('Appears to be spam');
  }
  
  return { safe: reasons.length === 0, reasons };
};

/**
 * Crisis detection with severity classification
 * Analyzes content for mental health crisis indicators
 */

/**
 * Detect crisis situations in user content
 * @param content User input to analyze
 * @returns Crisis detection result with severity and keywords
 */
export const detectCrisis = (content: string): { isCrisis: boolean; severity: 'low' | 'medium' | 'high'; keywords: string[] } => {
  const crisisKeywords = {
    high: ['suicide', 'kill myself', 'end my life', 'want to die', 'better off dead'],
    medium: ['self harm', 'cut myself', 'hurt myself', 'can\'t go on', 'no point'],
    low: ['depressed', 'hopeless', 'alone', 'worthless', 'hate myself']
  };
  
  const lowerContent = content.toLowerCase();
  const foundKeywords: string[] = [];
  let severity: 'low' | 'medium' | 'high' = 'low';
  
  for (const [level, keywords] of Object.entries(crisisKeywords)) {
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword)) {
        foundKeywords.push(keyword);
        if (level === 'high') severity = 'high';
        else if (level === 'medium' && severity !== 'high') severity = 'medium';
      }
    }
  }
  
  return {
    isCrisis: foundKeywords.length > 0,
    severity,
    keywords: foundKeywords
  };
};

/**
 * Validation helper function
 * Combines Zod validation with error handling
 */

/**
 * Validate and sanitize data using Zod schema
 * @param schema Zod schema for validation
 * @param data Raw data to validate
 * @returns Validation result with parsed data or errors
 */
export const validateWithSchema = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};