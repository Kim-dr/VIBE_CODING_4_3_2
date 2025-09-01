// frontend/screens/BudgetTrackerScreen.js
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Button, Card } from 'react-native-ui-lib';
import { supabase } from '../utils/supabase';

export default function BudgetTrackerScreen() {
  const [budget, setBudget] = useState(null);
  const [weeklyIncome, setWeeklyIncome] = useState('');
  const [allocations, setAllocations] = useState({
    food: '',
    transportation: '',
    entertainment: '',
    supplies: '',
    other: ''
  });
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadBudget();
    loadWeeklyExpenses();
  }, []);

  async function loadBudget() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (data) {
      setBudget(data);
      setWeeklyIncome(data.weekly_income.toString());
      setAllocations(data.allocations);
    }
  }

  async function loadWeeklyExpenses() {
    const { data: { user } } = await supabase.auth.getUser();
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    // In a real app, you would query your expenses table
    // For now, we'll use mock data
    const mockExpenses = [
      { id: 1, category: 'food', amount: 25.50, description: 'Campus lunch', date: new Date() },
      { id: 2, category: 'transportation', amount: 15.00, description: 'Bus pass', date: new Date() },
      { id: 3, category: 'entertainment', amount: 12.00, description: 'Movie ticket', date: new Date() },
    ];
    
    setExpenses(mockExpenses);
  }

  async function saveBudget() {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('budgets')
      .insert([
        { 
          user_id: user.id, 
          weekly_income: parseFloat(weeklyIncome), 
          allocations: allocations 
        }
      ]);

    if (!error) {
      loadBudget(); // Reload budget
      alert('Budget saved successfully!');
    }
  }

  const calculateTotalSpent = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateRemaining = () => {
    if (!budget) return 0;
    return parseFloat(budget.weekly_income) - calculateTotalSpent();
  };

  const getCategorySpent = (category) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Budget Tracker</Text>

      {/* Budget Summary */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Weekly Budget Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Income: ${budget?.weekly_income || 0}</Text>
          <Text>Spent: ${calculateTotalSpent().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.remainingText}>
            Remaining: ${calculateRemaining().toFixed(2)}
          </Text>
        </View>
      </Card>

      {/* Set Budget Form */}
      <Card style={styles.formCard}>
        <Text style={styles.formTitle}>Set Weekly Budget</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Weekly Income ($)"
          value={weeklyIncome}
          onChangeText={setWeeklyIncome}
          keyboardType="numeric"
        />
        
        <Text style={styles.allocationTitle}>Budget Allocations</Text>
        {Object.entries(allocations).map(([category, amount]) => (
          <View key={category} style={styles.allocationRow}>
            <Text style={styles.categoryLabel}>
              {category.charAt(0).toUpperCase() + category.slice(1)}:
            </Text>
            <TextInput
              style={styles.allocationInput}
              placeholder="0.00"
              value={amount}
              onChangeText={(value) => setAllocations({
                ...allocations,
                [category]: value
              })}
              keyboardType="numeric"
            />
          </View>
        ))}
        
        <Button
          label="Save Budget"
          onPress={saveBudget}
          style={styles.saveButton}
        />
      </Card>

      {/* Recent Expenses */}
      <Text style={styles.sectionTitle}>Recent Expenses</Text>
      {expenses.length === 0 ? (
        <Text style={styles.emptyText}>No expenses recorded this week</Text>
      ) : (
        expenses.map((expense) => (
          <Card key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
              <Text style={styles.expenseCategory}>{expense.category}</Text>
              <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
            </View>
            <Text style={styles.expenseDescription}>{expense.description}</Text>
            <Text style={styles.expenseDate}>
              {new Date(expense.date).toLocaleDateString()}
            </Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  summaryCard: {
    padding: 15,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  remainingText: {
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  formCard: {
    padding: 15,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  allocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  allocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryLabel: {
    flex: 1,
    color: '#333',
  },
  allocationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: 80,
    textAlign: 'right',
  },
  saveButton: {
    padding: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  expenseCard: {
    padding: 15,
    marginBottom: 10,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  expenseCategory: {
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  expenseAmount: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  expenseDescription: {
    color: '#666',
    marginBottom: 5,
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
  },
});