import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { CreditCard, Smartphone, Banknote, ArrowRight } from 'lucide-react-native';
import theme from '~/theme/theme';

const PaymentCard = ({ icon: Icon, title, subtitle, amount, isHighlighted = false }: any) => (
  <View style={[styles.paymentCard, isHighlighted && styles.highlightedCard]}>
    <View style={styles.cardLeft}>
      <View style={styles.iconContainer}>
        <Icon color={theme.colors.primary} size={20} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <View style={styles.cardRight}>
      <Text style={[styles.amount, isHighlighted && styles.highlightedAmount]}>{amount}</Text>
      <ArrowRight color={theme.colors.mutedForeground} size={16} />
    </View>
  </View>
);

const WelcomePaymentMockup = ({ isActive }: { isActive?: boolean }) => {
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
              toValue: 0.7,
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

  const payments = [
    { icon: CreditCard, title: 'PLN Electricity', subtitle: 'Due today', amount: 'Rp 450,000', isHighlighted: true },
    { icon: Smartphone, title: 'Telkomsel Postpaid', subtitle: 'Due in 2 days', amount: 'Rp 125,000' },
    { icon: Banknote, title: 'Credit Card Payment', subtitle: 'BCA Everyday', amount: 'Rp 2,500,000' },
    { icon: CreditCard, title: 'Internet Bill', subtitle: 'IndiHome', amount: 'Rp 350,000' },
    { icon: Smartphone, title: 'Netflix Subscription', subtitle: 'Monthly', amount: 'Rp 186,000' },
    { icon: Banknote, title: 'Insurance Premium', subtitle: 'Allianz Life', amount: 'Rp 750,000' },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.mockupFrame}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quick Payments</Text>
          <Text style={styles.headerSubtitle}>Pay bills from any account</Text>
        </View>
        
        <ScrollView 
          ref={scrollRef}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.paymentsContainer}>
            {payments.map((payment, index) => (
              <PaymentCard
                key={index}
                icon={payment.icon}
                title={payment.title}
                subtitle={payment.subtitle}
                amount={payment.amount}
                isHighlighted={payment.isHighlighted}
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
  paymentsContainer: {
    padding: theme.spacing.medium,
    gap: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background + '80',
    padding: theme.spacing.medium,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border + '50',
  },
  highlightedCard: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary + '30',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.medium,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amount: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  highlightedAmount: {
    color: theme.colors.primary,
  },
});

export default WelcomePaymentMockup;