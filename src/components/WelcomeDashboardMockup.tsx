import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

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
    holdings: [
      { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0.65, value: 45000000, logoUrl: 'https://placehold.co/48x48.png' },
      { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 5, value: 25000000, logoUrl: 'https://placehold.co/48x48.png' },
    ]
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

const mockTransactions = [
  { id: 'txn_1', accountId: 'acc_bca_tahapan_1', amount: 55000000, date: '2024-07-25', description: 'Salary Deposit', category: 'Income' },
  { id: 'txn_2', accountId: 'acc_bca_tahapan_1', amount: -1800000, date: '2024-07-24', description: 'Dinner at SKYE', category: 'Food and Drink' },
  { id: 'txn_3', accountId: 'acc_bca_tahapan_1', amount: -3200000, date: '2024-07-19', description: 'Garuda Flight to Bali', category: 'Travel' },
  { id: 'txn_4', accountId: 'acc_gopay_main_3', amount: -120000, date: '2024-07-26', description: "GoFood McDonald's", category: 'Food and Drink' },
  { id: 'txn_5', accountId: 'acc_gopay_main_3', amount: -35000, date: '2024-07-23', description: 'Gojek Ride', category: 'Transportation' },
  { id: 'txn_6', accountId: 'acc_bca_kredit_2', amount: -2500000, date: '2024-07-27', description: 'Shopping at Zara', category: 'Shopping' },
  { id: 'txn_7', accountId: 'acc_bca_kredit_2', amount: -54999, date: '2024-07-27', description: 'Spotify Premium', category: 'Services' },
  { id: 'txn_8', accountId: 'acc_mandiri_payroll_4', amount: 45000000, date: '2024-06-30', description: 'Bonus Tahunan', category: 'Income' },
  { id: 'txn_9', accountId: 'acc_mandiri_payroll_4', amount: -250000, date: '2024-07-31', description: 'Biaya Admin', category: 'Fees'},
  { id: 'txn_10', accountId: 'acc_kredivo_loan_7', amount: -5500000, date: '2024-07-01', description: 'Pembayaran Tagihan Kredivo', category: 'Payments' },
  { id: 'txn_11', accountId: 'acc_bibit_main_5', amount: -25000000, date: '2024-07-02', description: 'Invest in Mutual Fund', category: 'Investments' },
  { id: 'txn_12', accountId: 'acc_bca_tahapan_1', amount: -850000, date: '2024-07-05', description: 'Uniqlo Shopping', category: 'Shopping' },
  { id: 'txn_13', accountId: 'acc_bca_tahapan_1', amount: -1200000, date: '2024-07-10', description: 'PLN & IndiHome Bill', category: 'Bills' },
  { id: 'txn_14', accountId: 'acc_mandiri_payroll_4', amount: 15000000, date: '2024-07-15', description: 'Project Freelance Payment', category: 'Income' },
  { id: 'txn_15', accountId: 'acc_pintu_main_6', amount: -10000000, date: '2024-07-18', description: 'Buy Bitcoin', category: 'Investments' },
  { id: 'txn_16', accountId: 'acc_gopay_main_3', amount: -55000, date: '2024-07-28', description: 'Kopi Kenangan', category: 'Food and Drink' },
  { id: 'txn_17', accountId: 'acc_bca_tahapan_1', amount: -750000, date: '2024-07-29', description: 'Groceries at Ranch Market', category: 'Groceries' },
  { id: 'txn_18', accountId: 'acc_bca_tahapan_1', amount: 5000000, date: '2024-07-08', description: 'Reimbursement from Office', category: 'Income' },
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

// Icon components (simplified text representations)
const PinIcon = () => <Text style={styles.icon}></Text>;
const LandmarkIcon = () => <Text style={styles.icon}>️</Text>;
const WalletIcon = () => <Text style={styles.icon}></Text>;
const BriefcaseIcon = () => <Text style={styles.icon}></Text>;
const CoinsIcon = () => <Text style={styles.icon}></Text>;

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
    outputRange: ['#f8f9fa', '#e3f2fd'],
  });

  return (
    <Animated.View style={[styles.totalBalanceCard, { backgroundColor }]}>
      <Text style={styles.totalBalanceTitle}>Total Net Worth</Text>
      <Text style={styles.totalBalanceAmount}>{formatCurrency(netWorth)}</Text>
    </Animated.View>
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

  const { totalAssets, totalLiabilities, netWorth, pinnedAccounts, accountGroups } = useMemo(() => {
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

    return { totalAssets, totalLiabilities, netWorth, pinnedAccounts, accountGroups };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Total Balance Card */}
          <TotalBalanceCard netWorth={netWorth} isActive={isActive} />
          
          {/* Pinned Account Section */}
          {pinnedAccounts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <PinIcon />
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

          {/* Banks Section */}
          {accountGroups.bank.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LandmarkIcon />
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

          {/* E-Money Section */}
          {accountGroups.ewallet.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <WalletIcon />
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

          {/* Investments Section */}
          {accountGroups.investment.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <BriefcaseIcon />
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

          {/* Loans Section */}
          {accountGroups.loan.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <CoinsIcon />
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  phoneFrame: {
    width: phoneWidth,
    height: 600,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
  },
  scrollContent: {
    padding: 12,
  },
  totalBalanceCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalBalanceTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  sectionContent: {
    gap: 8,
  },
  accountCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  accountCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  accountNumber: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  loanBalance: {
    color: '#dc3545',
  },
  icon: {
    fontSize: 16,
  },
});

export default WelcomeDashboardMockup;