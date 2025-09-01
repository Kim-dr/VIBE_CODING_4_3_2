// Core types for Campus Mojo app
export interface User {
  id: string;
  email: string;
  handle?: string;
  tier: 'free' | 'lite' | 'premium';
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  handle?: string;
  tier: 'free' | 'lite' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface Mood {
  id: string;
  user_id: string;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  note?: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  type: 'sleep' | 'steps';
  value: number;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  weekly_income: number;
  allocations: {
    food: number;
    transportation: number;
    entertainment: number;
    supplies: number;
    other: number;
  };
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category: 'food' | 'transportation' | 'entertainment' | 'supplies' | 'other';
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

export interface PeerGroup {
  id: string;
  name: string;
  description: string;
  created_by: string;
  is_premium: boolean;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

export interface Message {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Form types
export interface AuthForm {
  email: string;
  password: string;
}

export interface MoodForm {
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

export interface HabitForm {
  type: 'sleep' | 'steps';
  value: number;
}

export interface BudgetForm {
  weekly_income: number;
  allocations: {
    food: number;
    transportation: number;
    entertainment: number;
    supplies: number;
    other: number;
  };
}

export interface GroupForm {
  name: string;
  description: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
  MoodTracker: undefined;
  HabitTracker: undefined;
  BudgetTracker: undefined;
  PeerGroups: undefined;
  GroupChat: { group: PeerGroup };
  Profile: undefined;
  Upgrade: undefined;
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
};
