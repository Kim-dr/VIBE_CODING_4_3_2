import { APP_CONSTANTS } from './constants';

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < APP_CONSTANTS.MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${APP_CONSTANTS.MIN_PASSWORD_LENGTH} characters`);
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Form validation
export const validateAuthForm = (email: string, password: string): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!password.trim()) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Mood validation
export const validateMood = (mood: number): boolean => {
  return mood >= 1 && mood <= 5 && Number.isInteger(mood);
};

// Energy validation
export const validateEnergy = (energy: number): boolean => {
  return energy >= 1 && energy <= 5 && Number.isInteger(energy);
};

// Habit validation
export const validateHabit = (type: string, value: number): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!['sleep', 'steps'].includes(type)) {
    errors.type = 'Invalid habit type';
  }
  
  if (type === 'sleep') {
    if (value < 0 || value > 24) {
      errors.value = 'Sleep hours must be between 0 and 24';
    }
  } else if (type === 'steps') {
    if (value < 0 || value > 100000) {
      errors.value = 'Step count must be between 0 and 100,000';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Budget validation
export const validateBudget = (weeklyIncome: number, allocations: Record<string, number>): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (weeklyIncome < 0) {
    errors.weeklyIncome = 'Weekly income cannot be negative';
  }
  
  const totalAllocated = Object.values(allocations).reduce((sum, amount) => sum + amount, 0);
  if (totalAllocated > weeklyIncome) {
    errors.allocations = 'Total allocations cannot exceed weekly income';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Group validation
export const validateGroup = (name: string, description: string): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!name.trim()) {
    errors.name = 'Group name is required';
  } else if (name.length > APP_CONSTANTS.MAX_GROUP_NAME_LENGTH) {
    errors.name = `Group name must be ${APP_CONSTANTS.MAX_GROUP_NAME_LENGTH} characters or less`;
  }
  
  if (description.length > APP_CONSTANTS.MAX_GROUP_DESCRIPTION_LENGTH) {
    errors.description = `Description must be ${APP_CONSTANTS.MAX_GROUP_DESCRIPTION_LENGTH} characters or less`;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Generic required field validation
export const validateRequired = (value: string, fieldName: string): string | null => {
  return value.trim() ? null : `${fieldName} is required`;
};

// Number validation
export const validateNumber = (value: string, min?: number, max?: number): string | null => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }
  if (min !== undefined && num < min) {
    return `Value must be at least ${min}`;
  }
  if (max !== undefined && num > max) {
    return `Value must be at most ${max}`;
  }
  return null;
};
