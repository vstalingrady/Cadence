import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Utensils, Car, ShoppingBag, Gamepad2, Coffee, Shirt } from 'lucide-react-native';
import theme from '~/theme/theme';

const BudgetCard = ({ icon: Icon, category, spent, budget, progress, isOverBudget = false }: any) => (
  <View style={[styles.budgetCard, isOverBudget && styles.overBudgetCard]}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Icon color={isOverBudget ? theme.colors.destructive : theme.colors.primary} size={20} />
      </View>
      <View style={styles.budgetInfo}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.budgetAmount}>{spent} of {budget}</Text>
      </View>
      <Text style={[styles.progressPercentage, isOverBudget && styles.overBudgetText]}>
        {progress}%
      </Text>
    </View>
    
    <View style={styles.progressSection}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${Math.min(progress, 100)}%`, 
              backgroundColor: isOverBudget ? theme.colors.destructive : theme.colors.primary 
            }
          ]} 
        />
      </View>
    </View>
    
    {isOverBudget && (
      <Text style={styles.warningText}>Over budget by {budget.replace(/[^\d]/g, '') - spent.replace(/[^\d]/g, '') < 0 ? 'Rp ' + Math.abs(parseInt(budget.replace(/[^\d]/g, '')) - parseInt(spent.replace(/[^\d]/g, ''))).toLocaleString('id-ID') : ''}</Text>
    )}
  </View>
);

const WelcomeBudgetsMockup = ({ isActive }: { isActive?: boolean }) => {
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0.8,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }
  }, [isActive, fadeAnim]);

  const budgets = [
    {
      icon: Utensils,
      category: 'Food & Dining',
      spent: 'Rp 2,850,000',
      budget: 'Rp 3,000,000',
      progress: 95,
      isOverBudget: false,
    },
    {
      icon: Car,
      category: 'Transportation',
      spent: 'Rp 1,250,000',
      budget: 'Rp 1,000,000',
      progress: 125,
      isOverBudget: true,
    },
    {
      icon: ShoppingBag,
      category: 'Shopping',
      spent: 'Rp 1,800,000',
      budget: 'Rp 2,500,000',
      progress: 72,
      isOverBudget: false,
    },
    {
      icon: Gamepad2,
      category: 'Entertainment',
      spent: 'Rp 450,000',
      budget: 'Rp 800,000',
      progress: 56,
      isOverBudget: false,
    },
    {
      icon: Coffee,
      category: 'Coffee & Drinks',
      spent: 'Rp 320,000',
      budget: 'Rp 400,000',
      progress: 80,
      isOverBudget: false,
    },
    {
      icon: Shirt,
      category: 'Clothing',
      spent: 'Rp 650,000',
      budget: 'Rp 1,200,000',
      progress: 54,
      isOverBudget: false,
    },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.mockupFrame}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Budget Tracker</Text>
          <Text style={styles.headerSubtitle}>Stay on track with spending</Text>
        </View>
        
        <ScrollView 
          ref={scrollRef}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.budgetsContainer}>
            {budgets.map((budget, index) => (
              <BudgetCard
                key={index}
                icon={budget.icon}
                category={budget.category}
                spent={budget.spent}
                budget={budget.budget}
                progress={budget.progress}
                isOverBudget={budget.isOverBudget}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockupFrame: {
    width: '90%',
    maxWidth: 300,
    height: 400,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    padding: theme.spacing.large,
    backgroundColor: theme.colors.background + '50',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
  },
  scrollContainer: {
    flex: 1,
  },
  budgetsContainer: {
    padding: theme.spacing.medium,
    gap: 12,
  },
  budgetCard: {
    backgroundColor: theme.colors.background + '80',
    padding: theme.spacing.medium,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border + '50',
  },
  overBudgetCard: {
    backgroundColor: theme.colors.destructive + '10',
    borderColor: theme.colors.destructive + '30',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.medium,
  },
  budgetInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: 2,
  },
  budgetAmount: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
  },
  progressPercentage: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  overBudgetText: {
    color: theme.colors.destructive,
  },
  progressSection: {
    marginBottom: theme.spacing.small,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  warningText: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.destructive,
    fontWeight: '500',
  },
});

export default WelcomeBudgetsMockup;