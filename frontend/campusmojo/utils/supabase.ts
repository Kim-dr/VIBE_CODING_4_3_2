import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { 
  User, 
  Profile, 
  Mood, 
  Habit, 
  Budget, 
  Expense, 
  PeerGroup, 
  GroupMember, 
  Message,
  ApiResponse 
} from '../types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Error handling utility
export const handleSupabaseError = (error: any): string => {
  if (error?.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
};

// User authentication utilities
export const authUtils = {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error(handleSupabaseError(error));
    return user;
  },

  async signIn(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data: data.user, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async signUp(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { data: data.user, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(handleSupabaseError(error));
  }
};

// Profile utilities
export const profileUtils = {
  async getProfile(userId: string): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }
};

// Mood utilities
export const moodUtils = {
  async getMoods(userId: string, limit = 10): Promise<ApiResponse<Mood[]>> {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async addMood(mood: Omit<Mood, 'id' | 'created_at'>): Promise<ApiResponse<Mood>> {
    try {
      const { data, error } = await supabase
        .from('moods')
        .insert([mood])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async getLatestMood(userId: string): Promise<ApiResponse<Mood>> {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }
};

// Habit utilities
export const habitUtils = {
  async getHabits(userId: string, date?: Date): Promise<ApiResponse<Habit[]>> {
    try {
      let query = supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        query = query.gte('created_at', startOfDay.toISOString());
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async addHabit(habit: Omit<Habit, 'id' | 'created_at'>): Promise<ApiResponse<Habit>> {
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([habit])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async deleteHabit(habitId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);
      
      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }
};

// Budget utilities
export const budgetUtils = {
  async getBudget(userId: string): Promise<ApiResponse<Budget>> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async saveBudget(budget: Omit<Budget, 'id' | 'created_at'>): Promise<ApiResponse<Budget>> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([budget])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }
};

// Group utilities
export const groupUtils = {
  async getGroups(): Promise<ApiResponse<PeerGroup[]>> {
    try {
      const { data, error } = await supabase
        .from('peer_groups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async getUserGroups(userId: string): Promise<ApiResponse<string[]>> {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      return { data: data?.map(item => item.group_id) || [], error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async createGroup(group: Omit<PeerGroup, 'id' | 'created_at'>): Promise<ApiResponse<PeerGroup>> {
    try {
      const { data, error } = await supabase
        .from('peer_groups')
        .insert([group])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  async joinGroup(groupId: string, userId: string): Promise<ApiResponse<GroupMember>> {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .insert([{ group_id: groupId, user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }
};
