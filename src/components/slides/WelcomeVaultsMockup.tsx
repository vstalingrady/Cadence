import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { PiggyBank, Plane, Home, GraduationCap, Car } from 'lucide-react-native';
import theme from '~/theme/theme';

const VaultCard = ({ icon: Icon, title, target, current, progress, color }: any) => (
  <View style={styles.vaultCard}>
    <View style={styles.cardHeader}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Icon color={color} size={20} />
      </View>
      <View style={styles.vaultInfo}>
        <Text style={styles.vaultTitle}>{title}</Text>
        <Text style={styles.vaultTarget}>Target: {target}</Text>
      </View>
    </View>
    
    <View style={styles.progressSection}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
    
    <View style={styles.amountSection}>
      <Text style={styles.currentAmount}>{current}</Text>
      <Text style={styles.remainingAmount}>Rp {(parseInt(target.replace(/[^\d]/g, '')) - parseInt(current.replace(/[^\d]/g, ''))).toLocaleString('id-ID')} to go</Text>
    </View>
  </View>
);

const WelcomeVaultsMockup = ({ isActive }: { isActive?: boolean }) => {
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
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 2500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }
  }, [isActive, fadeAnim]);

  const vaults = [
    {
      icon: Plane,
      title: 'Bali Vacation',
      target: 'Rp 15,000,000',
      current: 'Rp 12,500,000',
      progress: 83,
      color: theme.colors.primary,
    },
    {
      icon: Home,
      title: 'Emergency Fund',
      target: 'Rp 50,000,000',
      current: 'Rp 32,000,000',
      progress: 64,
      color: '#10B981',
    },
    {
      icon: Car,
      title: 'New Car',
      target: 'Rp 300,000,000',
      current: 'Rp 85,000,000',
      progress: 28,
      color: '#F59E0B',
    },
    {
      icon: GraduationCap,
      title: 'MBA Fund',
      target: 'Rp 200,000,000',
      current: 'Rp 45,000,000',
      progress: 23,
      color: '#8B5CF6',
    },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.mockupFrame}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Savings Vaults</Text>
          <Text style={styles.headerSubtitle}>Automated goal tracking</Text>
        </View>
        
        <ScrollView 
          ref={scrollRef}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.vaultsContainer}>
            {vaults.map((vault, index) => (
              <VaultCard
                key={index}
                icon={vault.icon}
                title={vault.title}
                target={vault.target}
                current={vault.current}
                progress={vault.progress}
                color={vault.color}
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
  vaultsContainer: {
    padding: theme.spacing.medium,
    gap: 16,
  },
  vaultCard: {
    backgroundColor: theme.colors.background + '80',
    padding: theme.spacing.large,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border + '50',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.medium,
  },
  vaultInfo: {
    flex: 1,
  },
  vaultTitle: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: 2,
  },
  vaultTarget: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    fontWeight: '600',
    color: theme.colors.foreground,
    minWidth: 35,
    textAlign: 'right',
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentAmount: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  remainingAmount: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
  },
});

export default WelcomeVaultsMockup;