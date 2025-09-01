// App-wide constants
export const APP_CONSTANTS = {
  APP_NAME: 'Campus Mojo',
  APP_TAGLINE: 'Your Campus Wellness Companion',
  
  // API limits
  MAX_MOOD_HISTORY: 50,
  MAX_HABIT_HISTORY: 100,
  MAX_GROUP_MESSAGES: 100,
  
  // Validation
  MIN_PASSWORD_LENGTH: 6,
  MAX_GROUP_NAME_LENGTH: 50,
  MAX_GROUP_DESCRIPTION_LENGTH: 200,
  
  // Time intervals
  REFRESH_INTERVAL: 30000, // 30 seconds
  CACHE_DURATION: 300000, // 5 minutes
  
  // Default values
  DEFAULT_MOOD: 3,
  DEFAULT_ENERGY: 3,
  DEFAULT_SLEEP_HOURS: 8,
  DEFAULT_STEPS_GOAL: 10000,
} as const;

// Mood emojis mapping
export const MOOD_EMOJIS = {
  1: '😢',
  2: '😞', 
  3: '😐',
  4: '😊',
  5: '😁',
} as const;

// Habit type icons
export const HABIT_ICONS = {
  sleep: '💤',
  steps: '👟',
} as const;

// Budget categories
export const BUDGET_CATEGORIES = {
  food: '🍕',
  transportation: '🚌',
  entertainment: '🎬',
  supplies: '📚',
  other: '💼',
} as const;

// User tiers
export const USER_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['Basic mood tracking', 'Basic habit tracking', 'Limited groups'],
  },
  lite: {
    name: 'Lite',
    price: 2.99,
    features: ['Advanced analytics', 'Unlimited groups', 'Priority support'],
  },
  premium: {
    name: 'Premium',
    price: 4.99,
    features: ['All Lite features', 'Premium groups', 'Personal coaching', 'Advanced insights'],
  },
} as const;

// Colors
export const COLORS = {
  primary: '#007AFF',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  black: '#000000',
  gray: {
    100: '#f8f9fa',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Font sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Font weights
export const FONT_WEIGHTS = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
