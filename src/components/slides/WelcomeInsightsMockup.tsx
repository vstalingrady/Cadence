import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { TrendingUp, TrendingDown, Lightbulb, Target } from 'lucide-react-native';
import theme from '~/theme/theme';

const InsightCard = ({ icon: Icon, title, description, trend, amount, isPositive = true }: any) => (
  <View style={styles.insightCard}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Icon color={theme.colors.primary} size={20} />
      </View>
      <View style={styles.trendContainer}>
        {trend && (
          <>
            {isPositive ? (
              <TrendingUp color={theme.colors.success} size={16} />
            ) : (
              <TrendingDown color={theme.colors.destructive} size={16} />
            )}
            <Text style={[styles.trendText, { color: isPositive ? theme.colors.success : theme.colors.destructive }]}>
              {trend}
            </Text>
          </>
        )}
      </View>
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    {amount && <Text style={styles.cardAmount}>{amount}</Text>}
  </View>
);

const WelcomeInsightsMockup = ({ isActive }: { isActive?: boolean }) => {
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
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }
  }, [isActive, fadeAnim]);

  const insights = [
    {
      icon: Lightbulb,
      title: 'Spending Opportunity',
      description: 'You spent 23% less on dining this month. Consider allocating this to your emergency fund.',
      trend: '+23%',
      amount: 'Save Rp 850,000',
      isPositive: true,
    },
    {
      icon: Target,
      title: 'Goal Progress',
      description: 'You\'re on track to reach your vacation savings goal 2 months early!',
      trend: '+15%',
      amount: 'Rp 12,500,000',
      isPositive: true,
    },
    {
      icon: TrendingUp,
      title: 'Investment Growth',
      description: 'Your portfolio gained 8.5% this quarter. Consider increasing your monthly contribution.',
      trend: '+8.5%',
      amount: 'Rp 6,750,000',
      isPositive: true,
    },
    {
      icon: TrendingDown,
      title: 'Subscription Alert',
      description: 'You have 3 unused subscriptions costing you monthly. Cancel to save money.',
      trend: '-12%',
      amount: 'Save Rp 285,000/mo',
      isPositive: false,
    },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.mockupFrame}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Insights</Text>
          <Text style={styles.headerSubtitle}>Personalized recommendations</Text>
        </View>
        
        <ScrollView 
          ref={scrollRef}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.insightsContainer}>
            {insights.map((insight, index) => (
              <InsightCard
                key={index}
                icon={insight.icon}
                title={insight.title}
                description={insight.description}
                trend={insight.trend}
                amount={insight.amount}
                isPositive={insight.isPositive}
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
  insightsContainer: {
    padding: theme.spacing.medium,
    gap: 16,
  },
  insightCard: {
    backgroundColor: theme.colors.background + '80',
    padding: theme.spacing.large,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border + '50',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.medium,
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    fontWeight: '600',
  },
  cardTitle: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: 6,
  },
  cardDescription: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
    lineHeight: 18,
    marginBottom: theme.spacing.medium,
  },
  cardAmount: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default WelcomeInsightsMockup;