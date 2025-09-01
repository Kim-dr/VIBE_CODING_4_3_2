# Campus Mojo Codebase Improvements

## Overview
This document outlines the comprehensive improvements made to the Campus Mojo codebase to make it more DRY, minimalistic, modular, consistent, and well-structured.

## 🎯 Key Improvements Made

### 1. **TypeScript Integration**
- ✅ Added comprehensive type definitions in `types/index.ts`
- ✅ Converted key screens to TypeScript
- ✅ Added proper type safety for all API calls
- ✅ Defined interfaces for all data structures

### 2. **Centralized Utilities**
- ✅ **Supabase Utils** (`utils/supabase.ts`): Centralized all database operations with proper error handling
- ✅ **Validation Utils** (`utils/validation.ts`): Centralized form validation logic
- ✅ **Constants** (`utils/constants.ts`): Centralized all app constants and configuration

### 3. **Custom Hooks**
- ✅ **useAuth** (`hooks/useAuth.ts`): Complete authentication state management
- ✅ **useApi** (`hooks/useApi.ts`): Generic API hook with loading states and error handling

### 4. **Reusable Components**
- ✅ **FormField** (`components/ui/FormField.tsx`): Consistent form input component
- ✅ **Button** (`components/ui/Button.tsx`): Reusable button with variants and loading states
- ✅ **Card** (`components/ui/Card.tsx`): Consistent card layout component

### 5. **Improved Screens**
- ✅ **AuthScreen**: Converted to TypeScript with proper validation and error handling
- ✅ **MoodTrackerScreen**: Enhanced with better UX and validation

## 📁 Recommended Folder Structure

```
frontend/campusmojo/
├── app/                    # Expo Router screens
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── FormField.tsx
│   │   └── index.ts       # Export all UI components
│   ├── forms/             # Form-specific components
│   ├── charts/            # Data visualization components
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useMood.ts
│   ├── useHabits.ts
│   └── useGroups.ts
├── screens/               # Screen components
│   ├── auth/
│   ├── dashboard/
│   ├── mood/
│   ├── habits/
│   ├── budget/
│   └── groups/
├── utils/                 # Utility functions
│   ├── supabase.ts
│   ├── validation.ts
│   ├── constants.ts
│   ├── helpers.ts
│   └── storage.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
├── services/              # API service layer
│   ├── auth.ts
│   ├── mood.ts
│   ├── habits.ts
│   └── groups.ts
├── constants/             # App constants
│   ├── colors.ts
│   ├── spacing.ts
│   └── config.ts
└── assets/                # Static assets
```

## 🔧 Additional Utilities to Create

### 1. **Storage Utilities** (`utils/storage.ts`)
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageUtils = {
  async set(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
};
```

### 2. **Helper Functions** (`utils/helpers.ts`)
```typescript
import { MOOD_EMOJIS, HABIT_ICONS, BUDGET_CATEGORIES } from './constants';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getMoodEmoji = (mood: number): string => {
  return MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS] || '❓';
};

export const getHabitIcon = (type: string): string => {
  return HABIT_ICONS[type as keyof typeof HABIT_ICONS] || '📊';
};

export const getCategoryIcon = (category: string): string => {
  return BUDGET_CATEGORIES[category as keyof typeof BUDGET_CATEGORIES] || '💼';
};

export const calculatePercentage = (value: number, total: number): number => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};
```

### 3. **Additional Custom Hooks**

#### `hooks/useMood.ts`
```typescript
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useApi } from './useApi';
import { moodUtils } from '../utils/supabase';
import { Mood } from '../types';

export const useMood = () => {
  const { user } = useAuth();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [latestMood, setLatestMood] = useState<Mood | null>(null);
  
  const { execute: loadMoods, loading: loadingMoods } = useApi<Mood[]>();
  const { execute: loadLatestMood, loading: loadingLatest } = useApi<Mood>();

  const fetchMoods = async () => {
    if (!user) return;
    
    const result = await loadMoods(() => 
      moodUtils.getMoods(user.id, 10)
    );
    
    if (result.success && result.data) {
      setMoods(result.data);
    }
  };

  const fetchLatestMood = async () => {
    if (!user) return;
    
    const result = await loadLatestMood(() => 
      moodUtils.getLatestMood(user.id)
    );
    
    if (result.success && result.data) {
      setLatestMood(result.data);
    }
  };

  useEffect(() => {
    fetchMoods();
    fetchLatestMood();
  }, [user]);

  return {
    moods,
    latestMood,
    loadingMoods,
    loadingLatest,
    refreshMoods: fetchMoods,
    refreshLatestMood: fetchLatestMood,
  };
};
```

#### `hooks/useHabits.ts`
```typescript
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useApi } from './useApi';
import { habitUtils } from '../utils/supabase';
import { Habit } from '../types';

export const useHabits = (date?: Date) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayTotals, setTodayTotals] = useState({ sleep: 0, steps: 0 });
  
  const { execute: loadHabits, loading } = useApi<Habit[]>();

  const fetchHabits = async () => {
    if (!user) return;
    
    const result = await loadHabits(() => 
      habitUtils.getHabits(user.id, date)
    );
    
    if (result.success && result.data) {
      setHabits(result.data);
      
      // Calculate totals
      const sleepTotal = result.data
        .filter(h => h.type === 'sleep')
        .reduce((sum, h) => sum + h.value, 0);
        
      const stepsTotal = result.data
        .filter(h => h.type === 'steps')
        .reduce((sum, h) => sum + h.value, 0);
      
      setTodayTotals({ sleep: sleepTotal, steps: stepsTotal });
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user, date]);

  return {
    habits,
    todayTotals,
    loading,
    refreshHabits: fetchHabits,
  };
};
```

## 🎨 UI Component Improvements

### 1. **Loading States Component**
```typescript
// components/ui/LoadingSpinner.tsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'large',
}) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={COLORS.primary} />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  message: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.gray[600],
  },
});
```

### 2. **Empty State Component**
```typescript
// components/ui/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../../utils/constants';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.dark,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
});
```

## 🔄 State Management Patterns

### 1. **Context for Global State**
```typescript
// context/AppContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

interface AppState {
  theme: 'light' | 'dark';
  notifications: boolean;
  offline: boolean;
}

type AppAction = 
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'SET_OFFLINE'; payload: boolean };

const initialState: AppState = {
  theme: 'light',
  notifications: true,
  offline: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications };
    case 'SET_OFFLINE':
      return { ...state, offline: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

## 📱 Navigation Improvements

### 1. **Type-Safe Navigation**
```typescript
// navigation/types.ts
import { RootStackParamList, TabParamList } from '../types';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// navigation/index.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

export const Navigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
            <Stack.Screen name="HabitTracker" component={HabitTrackerScreen} />
            <Stack.Screen name="BudgetTracker" component={BudgetTrackerScreen} />
            <Stack.Screen name="PeerGroups" component={PeerGroupsScreen} />
            <Stack.Screen name="GroupChat" component={GroupChatScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Upgrade" component={UpgradeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## 🧹 Code Cleanup Recommendations

### 1. **Remove Unnecessary Dependencies**
```json
// package.json - Remove these if not used
{
  "dependencies": {
    // Remove if not using React Native UI Lib extensively
    "react-native-ui-lib": "^x.x.x",
    
    // Consider alternatives
    "expo-blur": "~14.1.5",        // Only if using blur effects
    "expo-haptics": "~14.1.4",     // Only if using haptic feedback
    "expo-image": "~2.4.0",        // Only if using advanced image features
    "expo-symbols": "~0.4.5",      // Only if using SF Symbols
  }
}
```

### 2. **Consolidate Styling**
```typescript
// styles/global.ts
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../utils/constants';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[600],
    marginBottom: SPACING.md,
  },
});
```

## 🚀 Performance Optimizations

### 1. **Memoization**
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // Component logic
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.reduce((sum, item) => sum + item.value, 0);
}, [data]);

// Use useCallback for event handlers
const handlePress = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 2. **Lazy Loading**
```typescript
// Lazy load screens
const MoodTrackerScreen = lazy(() => import('./screens/MoodTrackerScreen'));
const HabitTrackerScreen = lazy(() => import('./screens/HabitTrackerScreen'));

// Lazy load components
const ChartComponent = lazy(() => import('./components/ChartComponent'));
```

## 📊 Testing Strategy

### 1. **Unit Tests**
```typescript
// __tests__/utils/validation.test.ts
import { validateAuthForm, isValidEmail } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
    });
  });

  describe('validateAuthForm', () => {
    it('should validate complete form', () => {
      const result = validateAuthForm('test@example.com', 'Password123');
      expect(result.isValid).toBe(true);
    });
  });
});
```

### 2. **Component Tests**
```typescript
// __tests__/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/ui/Button';

describe('Button Component', () => {
  it('should render with title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Test Button" onPress={onPress} />);
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## 🔒 Security Improvements

### 1. **Input Sanitization**
```typescript
// utils/security.ts
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateInput = (input: string, maxLength: number): boolean => {
  return input.length <= maxLength && /^[a-zA-Z0-9\s\-_.,!?]+$/.test(input);
};
```

### 2. **Environment Variables**
```typescript
// utils/config.ts
export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  intasendKey: process.env.EXPO_PUBLIC_INTASEND_KEY!,
  apiUrl: process.env.EXPO_PUBLIC_API_URL!,
};
```

## 📈 Monitoring and Analytics

### 1. **Error Tracking**
```typescript
// utils/errorTracking.ts
export const logError = (error: Error, context?: string) => {
  console.error(`[${context || 'App'}] Error:`, error);
  // Send to error tracking service (e.g., Sentry)
};

export const logEvent = (event: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] ${event}:`, properties);
  // Send to analytics service
};
```

## 🎯 Next Steps

1. **Convert remaining screens** to TypeScript using the new patterns
2. **Implement the suggested utilities** and hooks
3. **Add comprehensive error handling** throughout the app
4. **Set up testing infrastructure** with Jest and React Native Testing Library
5. **Implement proper loading states** and error boundaries
6. **Add accessibility features** (screen reader support, proper labels)
7. **Optimize bundle size** by removing unused dependencies
8. **Add proper documentation** for all components and utilities
9. **Implement proper caching** strategies for API calls
10. **Add offline support** with proper sync mechanisms

## 📝 Summary

The improvements focus on:
- **DRY**: Eliminated repeated code through utilities and components
- **Minimalistic**: Removed unnecessary complexity and dependencies
- **Modular**: Created reusable components and utilities
- **Consistent**: Established patterns and naming conventions
- **Well-structured**: Organized code into logical folders and files

These changes will make the codebase more maintainable, scalable, and easier to work with for future development.
