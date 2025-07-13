import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Pin, Landmark, Wallet, Briefcase, Coins } from 'lucide-react-native';
import theme from '../theme/theme'; // Import the theme

// Mock data - same as original
const mockAccounts = [
  {
    id: 'acc_bca_tahapan_1',
    name: 'BCA Tahapan Gold',
    institutionSlug: 'bca',
    type: 'bank',
    balance: 85200501,
    accountNumber: '2847',
    isPinned: true,
  },
  {
    id: 'acc_bca_kredit_2',
    name: 'BCA Everyday Card',
    institutionSlug: 'bca',
    type: 'loan',
    balance: 4500000,
    accountNumber: '5588',
  },
  {
    id: 'acc_gopay_main_3',
    name: 'GoPay',
    institutionSlug: 'gopay',
    type: 'e-wallet',
    balance: 1068000,
    accountNumber: '7890',
  },
  {
    id: 'acc_mandiri_payroll_4',
    name: 'Mandiri Payroll',
    institutionSlug: 'mandiri',
    type: 'bank',
    balance: 42500000,
    accountNumber: '5566',
  },
  {
    id: 'acc_bibit_main_5',
    name: 'Bibit Portfolio',
    institutionSlug: 'bibit',
    type: 'investment',
    balance: 125000000,
    accountNumber: 'IVST',
  },
  {
    id: 'acc_pintu_main_6',
    name: 'Pintu Crypto',
    institutionSlug: 'pintu',
    type: 'investment',
    balance: 75000000,
    accountNumber: 'CRPT',
  },
  {
    id: 'acc_kredivo_loan_7',
    name: 'Kredivo PayLater',
    institutionSlug: 'kredivo',
    type: 'loan',
    balance: 5500000,
    accountNumber: 'LOAN',
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDisplayNumber = (account) => {
  const { accountNumber, type } = account;
  if (type === 'investment') {
    return '';
  }
  if (type === 'loan') {
    return 'Outstanding debt';
  }
  if (accountNumber && accountNumber.length > 4) {
    const firstTwo = accountNumber.substring(0, 2);
    const lastTwo = accountNumber.substring(accountNumber.length - 2);
    return `${firstTwo}********${lastTwo}`;
  }
  return `...${accountNumber}`;
};

const getAccountIcon = (slug) => {
  const icons = {
    bca: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg',
    gopay: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
    ovo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg',
    bibit: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bibit.id_logo.svg',
    pintu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pintu_logo.svg/2560px-Pintu_logo.svg.png',
    kredivo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kredivo_logo.svg/2560px-Kredivo_logo.svg.png',
    mandiri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg',
    bni: 'https://upload.wikimedia.org/wikipedia/commons/thumb/B/BA/Logo_BNI.svg/200px-Logo_BNI.svg.png'
  };
  return icons[slug] || 'https://placehold.co/32x32.png';
};

const MockAccountCard = ({ iconUrl, name, displayNumber, balance, isLoan = false }) => (
  <View style={styles.accountCard}>
    <View style={styles.accountCardContent}>
      <View style={styles.iconContainer}>
        <Image source={{ uri: iconUrl }} style={styles.accountIcon} />
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.accountName} numberOfLines={1}>{name}</Text>
        {displayNumber ? <Text style={styles.accountNumber}>{displayNumber}</Text> : null}
      </View>
    </View>
    <View style={styles.balanceContainer}>
      <Text style={[styles.balance, isLoan && styles.loanBalance]}>
        {balance}
      </Text>
    </View>
  </View>
);

const TotalBalanceCard = ({ netWorth, isActive }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [isActive, animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.card, theme.colors.muted],
  });

  return (
    <Animated.View style={[styles.totalBalanceCard, { backgroundColor }]}>
      <Text style={styles.totalBalanceTitle}>Total Net Worth</Text>
      <Text style={styles.totalBalanceAmount}>{formatCurrency(netWorth)}</Text>
    </Animated.View>
  );
};

const NetWorthChart = ({ netWorth }) => {
  const chartData = {
    labels: ['-30d', '-15d', 'Today'],
    datasets: [
      {
        data: [
          netWorth * 0.95,
          netWorth * 0.98,
          netWorth,
        ],
      },
    ],
  };

  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={chartData}
        width={phoneWidth - 48}
        height={180}
        chartConfig={{
          backgroundColor: theme.colors.card,
          backgroundGradientFrom: theme.colors.card,
          backgroundGradientTo: theme.colors.muted,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 191, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: theme.colors.accent,
          },
        }}
        bezier
        style={{
          marginVertical: theme.spacing.small,
          borderRadius: 16,
        }}
      />
    </View>
  );
};


const WelcomeDashboardMockup = ({ isActive = false }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isActive || !scrollRef.current) return;

    let scrollTimeout;

    const animateScroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: true });

        scrollTimeout = setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ y: 0, animated: true });
            scrollTimeout = setTimeout(animateScroll, 8000);
          }
        }, 8000);
      }
    };

    const startTimeout = setTimeout(animateScroll, 2500);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(scrollTimeout);
    };
  }, [isActive]);

  const totalAssets = mockAccounts
    .filter(acc => acc.type !== 'loan')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalLiabilities = mockAccounts
    .filter(acc => acc.type === 'loan')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const netWorth = totalAssets - totalLiabilities;

  const pinnedAccounts = mockAccounts.filter(a => a.isPinned);

  const accountGroups = {
    bank: mockAccounts.filter(a => a.type === 'bank' && !a.isPinned),
    ewallet: mockAccounts.filter(a => a.type === 'e-wallet'),
    investment: mockAccounts.filter(a => a.type === 'investment'),
    loan: mockAccounts.filter(a => a.type === 'loan'),
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TotalBalanceCard netWorth={netWorth} isActive={isActive} />
          <NetWorthChart netWorth={netWorth} />

          {pinnedAccounts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Pin color={theme.colors.accent} size={theme.fontSizes.large} />
                <Text style={styles.sectionTitle}>Pinned</Text>
              </View>
              <View style={styles.sectionContent}>
                {pinnedAccounts.map(account => (
                  <MockAccountCard
                    key={account.id}
                    iconUrl={getAccountIcon(account.institutionSlug)}
                    name={account.name}
                    displayNumber={formatDisplayNumber(account)}
                    balance={formatCurrency(account.balance)}
                    isLoan={account.type === 'loan'}
                  />
                ))}
              </View>
            </View>
          )}

          {accountGroups.bank.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Landmark color={theme.colors.accent} size={theme.fontSizes.large} />
                <Text style={styles.sectionTitle}>Banks</Text>
              </View>
              <View style={styles.sectionContent}>
                {accountGroups.bank.map(account => (
                  <MockAccountCard
                    key={account.id}
                    iconUrl={getAccountIcon(account.institutionSlug)}
                    name={account.name}
                    displayNumber={formatDisplayNumber(account)}
                    balance={formatCurrency(account.balance)}
                  />
                ))}
              </View>
            </View>
          )}

          {accountGroups.ewallet.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Wallet color={theme.colors.accent} size={theme.fontSizes.large} />
                <Text style={styles.sectionTitle}>E-Money</Text>
              </View>
              <View style={styles.sectionContent}>
                {accountGroups.ewallet.map(account => (
                  <MockAccountCard
                    key={account.id}
                    iconUrl={getAccountIcon(account.institutionSlug)}
                    name={account.name}
                    displayNumber={formatDisplayNumber(account)}
                    balance={formatCurrency(account.balance)}
                  />
                ))}
              </View>
            </View>
          )}

          {accountGroups.investment.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Briefcase color={theme.colors.accent} size={theme.fontSizes.large} />
                <Text style={styles.sectionTitle}>Investments</Text>
              </View>
              <View style={styles.sectionContent}>
                {accountGroups.investment.map(account => (
                  <MockAccountCard
                    key={account.id}
                    iconUrl={getAccountIcon(account.institutionSlug)}
                    name={account.name}
                    displayNumber={formatDisplayNumber(account)}
                    balance={formatCurrency(account.balance)}
                  />
                ))}
              </View>
            </View>
          )}

          {accountGroups.loan.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Coins color={theme.colors.accent} size={theme.fontSizes.large} />
                <Text style={styles.sectionTitle}>Loans</Text>
              </View>
              <View style={styles.sectionContent}>
                {accountGroups.loan.map(account => (
                  <MockAccountCard
                    key={account.id}
                    iconUrl={getAccountIcon(account.institutionSlug)}
                    name={account.name}
                    displayNumber={formatDisplayNumber(account)}
                    balance={formatCurrency(account.balance)}
                    isLoan={true}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const phoneWidth = Math.min(width * 0.9, 350);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  phoneFrame: {
    width: phoneWidth,
    height: 600,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.border,
    padding: 8,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
  },
  scrollContent: {
    padding: 12,
  },
  totalBalanceCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  totalBalanceTitle: {
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fonts.sans,
    color: theme.colors.mutedForeground,
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: theme.fontSizes.xxl,
    fontFamily: theme.fonts.serif,
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  section: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.large,
    fontFamily: theme.fonts.sans,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginLeft: 8,
  },
  sectionContent: {
    gap: 8,
  },
  accountCard: {
    backgroundColor: theme.colors.muted,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  accountCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fonts.sans,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  accountNumber: {
    fontSize: theme.fontSizes.small,
    fontFamily: theme.fonts.sans,
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fonts.sans,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  loanBalance: {
    color: theme.colors.primary,
  },
});

export default WelcomeDashboardMockup;
