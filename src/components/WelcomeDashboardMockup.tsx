import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import theme from '~/theme/theme';
import { mockAccounts, mockTransactions } from '~/lib/data';
import TotalBalance from './TotalBalance';
import MockAccountCard from './MockAccountCard';
import { Landmark, Wallet, Briefcase, Coins, Pin } from 'lucide-react-native';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(amount);

const formatDisplayNumber = (account: any): string => {
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

const getAccountIcon = (slug: string) => {
  const icons: { [key: string]: string } = {
    bca: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg',
    gopay: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
    ovo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg',
    bibit: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bibit.id_logo.svg',
    pintu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pintu_logo.svg/2560px-Pintu_logo.svg.png',
    kredivo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kredivo_logo.svg/2560px-Kredivo_logo.svg.png',
    mandiri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg',
    bni: 'https://upload.wikimedia.org/wikipedia/commons/thumb/B/BA/Logo_BNI.svg/200px-Logo_BNI.svg.png'
  };
  return <Image source={{ uri: icons[slug] || '' }} style={{ width: 32, height: 32, resizeMode: 'contain' }} />;
}

const WelcomeDashboardMockup = ({ isActive }: { isActive?: boolean }) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!isActive || !scrollRef.current) return;

    let scrollTimeout: NodeJS.Timeout;
    const animateScroll = () => {
      scrollRef.current?.scrollToEnd({ animated: true });
      scrollTimeout = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        scrollTimeout = setTimeout(animateScroll, 8000);
      }, 8000);
    };

    const startTimeout = setTimeout(animateScroll, 2500);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(scrollTimeout);
    };
  }, [isActive]);

  const { netWorth, pinnedAccounts, accountGroups } = useMemo(() => {
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
    return { netWorth, pinnedAccounts, accountGroups };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <TotalBalance title="Total Net Worth" amount={netWorth} />
        {pinnedAccounts.length > 0 && (
          <View style={styles.groupContainer}>
            <View style={styles.groupHeader}>
              <Pin size={16} color={theme.colors.primary} />
              <Text style={styles.groupTitle}>Pinned</Text>
            </View>
            {pinnedAccounts.map(account => (
              <MockAccountCard
                key={account.id}
                icon={getAccountIcon(account.institutionSlug)}
                name={account.name}
                displayNumber={formatDisplayNumber(account)}
                balance={formatCurrency(account.balance)}
                isLoan={account.type === 'loan'}
              />
            ))}
          </View>
        )}
        {accountGroups.bank.length > 0 && (
          <View style={styles.groupContainer}>
            <View style={styles.groupHeader}>
              <Landmark size={16} color={theme.colors.foreground} />
              <Text style={styles.groupTitle}>Banks</Text>
            </View>
            {accountGroups.bank.map(account => (
              <MockAccountCard
                key={account.id}
                icon={getAccountIcon(account.institutionSlug)}
                name={account.name}
                displayNumber={formatDisplayNumber(account)}
                balance={formatCurrency(account.balance)}
              />
            ))}
          </View>
        )}
        {accountGroups.ewallet.length > 0 && (
          <View style={styles.groupContainer}>
            <View style={styles.groupHeader}>
              <Wallet size={16} color={theme.colors.foreground} />
              <Text style={styles.groupTitle}>E-Money</Text>
            </View>
            {accountGroups.ewallet.map(account => (
              <MockAccountCard
                key={account.id}
                icon={getAccountIcon(account.institutionSlug)}
                name={account.name}
                displayNumber={formatDisplayNumber(account)}
                balance={formatCurrency(account.balance)}
              />
            ))}
          </View>
        )}
        {accountGroups.investment.length > 0 && (
          <View style={styles.groupContainer}>
            <View style={styles.groupHeader}>
              <Briefcase size={16} color={theme.colors.foreground} />
              <Text style={styles.groupTitle}>Investments</Text>
            </View>
            {accountGroups.investment.map(account => (
              <MockAccountCard
                key={account.id}
                icon={getAccountIcon(account.institutionSlug)}
                name={account.name}
                displayNumber={formatDisplayNumber(account)}
                balance={formatCurrency(account.balance)}
              />
            ))}
          </View>
        )}
        {accountGroups.loan.length > 0 && (
          <View style={styles.groupContainer}>
            <View style={styles.groupHeader}>
              <Coins size={16} color={theme.colors.foreground} />
              <Text style={styles.groupTitle}>Loans</Text>
            </View>
            {accountGroups.loan.map(account => (
              <MockAccountCard
                key={account.id}
                icon={getAccountIcon(account.institutionSlug)}
                name={account.name}
                displayNumber={formatDisplayNumber(account)}
                balance={formatCurrency(account.balance)}
                isLoan={true}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: `${theme.colors.primary}30`,
    backgroundColor: `${theme.colors.card}50`,
    padding: theme.spacing.small,
    overflow: 'hidden',
  },
  groupContainer: {
    marginTop: theme.spacing.medium,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
  },
  groupTitle: {
    color: theme.colors.foreground,
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
    marginLeft: theme.spacing.small,
  },
});

export default WelcomeDashboardMockup;