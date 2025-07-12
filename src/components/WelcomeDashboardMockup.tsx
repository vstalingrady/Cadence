// WelcomeDashboardMockup.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Pin, Landmark, Briefcase, Wallet, Coins } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
  runOnJS,
  scrollTo,
} from 'react-native-reanimated';

// -------------------
// Types (same shape as your web types)
// -------------------
type Holdings = {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  logoUrl: string;
};
type Account = {
  id: string;
  name: string;
  institutionSlug: string;
  type: 'bank' | 'e-wallet' | 'investment' | 'loan';
  balance: number;
  accountNumber?: string;
  isPinned?: boolean;
  holdings?: Holdings[];
};
type Transaction = {
  id: string;
  accountId: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

// -------------------
// Mock Data (identical to web)
// -------------------
const mockAccounts: Account[] = [
  {
    id: 'bca-tahapan-gold',
    name: 'BCA Tahapan Gold',
    institutionSlug: 'bca',
    type: 'bank',
    balance: 150000000,
    accountNumber: '1234567890',
    isPinned: true,
  },
  {
    id: 'gopay-main',
    name: 'GoPay Main',
    institutionSlug: 'gopay',
    type: 'e-wallet',
    balance: 250000,
    accountNumber: '08123456789',
    isPinned: true,
  },
  {
    id: 'mandiri-tabungan',
    name: 'Mandiri Tabungan',
    institutionSlug: 'mandiri',
    type: 'bank',
    balance: 75000000,
    accountNumber: '0987654321',
  },
  {
    id: 'bibit-reksadana',
    name: 'Bibit Reksadana',
    institutionSlug: 'bibit',
    type: 'investment',
    balance: 50000000,
    holdings: [
      { id: 'h1', name: 'ABC Equity Fund', symbol: 'ABC', amount: 100, value: 25000000, logoUrl: '' },
      { id: 'h2', name: 'XYZ Bond Fund', symbol: 'XYZ', amount: 50, value: 25000000, logoUrl: '' },
    ],
  },
  {
    id: 'pintu-crypto',
    name: 'Pintu Crypto',
    institutionSlug: 'pintu',
    type: 'investment',
    balance: 10000000,
    holdings: [
      { id: 'h3', name: 'Bitcoin', symbol: 'BTC', amount: 0.5, value: 5000000, logoUrl: '' },
      { id: 'h4', name: 'Ethereum', symbol: 'ETH', amount: 2, value: 5000000, logoUrl: '' },
    ],
  },
  {
    id: 'kredivo-loan',
    name: 'Kredivo Loan',
    institutionSlug: 'kredivo',
    type: 'loan',
    balance: 5000000,
    accountNumber: 'KLN12345',
  },
];
const mockTransactions: Transaction[] = []; // You can populate this if needed

// -------------------
// Helper: currency
// -------------------
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

// -------------------
// Helper: mask account number
// -------------------
const formatDisplayNumber = (acc: Account): string => {
  if (acc.type === 'investment') return '';
  if (acc.type === 'loan') return 'Outstanding debt';
  const n = acc.accountNumber ?? '';
  return n.length > 4
    ? `${n.slice(0, 2)}********${n.slice(-2)}`
    : `...${n}`;
};

// -------------------
// Institution logo map
// -------------------
const institutionLogos: { [slug: string]: any } = {
  bca: require('./assets/logos/bca.png'),
  gopay: require('./assets/logos/gopay.png'),
  mandiri: require('./assets/logos/mandiri.png'),
  bibit: require('./assets/logos/bibit.png'),
  pintu: require('./assets/logos/pintu.png'),
  kredivo: require('./assets/logos/kredivo.png'),
};

// -------------------
// Re-usable card
// -------------------
const MockAccountCard = ({
  icon,
  name,
  displayNumber,
  balance,
  isLoan = false,
}: {
  icon: React.ReactNode;
  name: string;
  displayNumber: string;
  balance: string;
  isLoan?: boolean;
}) => (
  <View style={styles.card}>
    <View style={styles.cardInner}>
      <View style={styles.iconWrapper}>{icon}</View>
      <View style={styles.textWrapper}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {name}
        </Text>
        {!!displayNumber && (
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {displayNumber}
          </Text>
        )}
      </View>
    </View>
    <Text style={[styles.balance, isLoan && styles.negative]}>{balance}</Text>
  </View>
);

// -------------------
// Main component
// -------------------
export default function WelcomeDashboardMockup({
  isActive = false,
}: {
  isActive?: boolean;
}) {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollY = useSharedValue(0);

  // Memoised calculations
  const { totalAssets, totalLiabilities, netWorth, pinnedAccounts, accountGroups } =
    useMemo(() => {
      const assets = mockAccounts
        .filter(a => a.type !== 'loan')
        .reduce((s, a) => s + a.balance, 0);
      const liabilities = mockAccounts
        .filter(a => a.type === 'loan')
        .reduce((s, a) => s + a.balance, 0);
      return {
        totalAssets: assets,
        totalLiabilities: liabilities,
        netWorth: assets - liabilities,
        pinnedAccounts: mockAccounts.filter(a => a.isPinned),
        accountGroups: {
          bank: mockAccounts.filter(
            a => a.type === 'bank' && !a.isPinned,
          ),
          ewallet: mockAccounts.filter(a => a.type === 'e-wallet'),
          investment: mockAccounts.filter(a => a.type === 'investment'),
          loan: mockAccounts.filter(a => a.type === 'loan'),
        },
      };
    }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!isActive) return;

    let down = true;
    const scroll = () => {
      'worklet';
      scrollTo(scrollRef, 0, down ? 9999 : 0, true);
      down = !down;
    };

    const t1 = setTimeout(() => runOnJS(scroll)(), 2500);
    const interval = setInterval(() => runOnJS(scroll)(), 8000);

    return () => {
      clearTimeout(t1);
      clearInterval(interval);
    };
  }, [isActive]);

  // -------------------
  // Render
  // -------------------
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Total Net Worth */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Net Worth</Text>
          <Text style={styles.totalAmount}>{formatCurrency(netWorth)}</Text>
        </View>

        {/* Pinned */}
        {pinnedAccounts.length > 0 && (
          <Section title="Pinned" icon={<Pin size={16} color="#6366f1" />}>
            {pinnedAccounts.map(acc => (
              <MockAccountCard
                key={acc.id}
                icon={
                  <Image
                    source={institutionLogos[acc.institutionSlug]}
                    style={styles.logo}
                  />
                }
                name={acc.name}
                displayNumber={formatDisplayNumber(acc)}
                balance={formatCurrency(acc.balance)}
                isLoan={acc.type === 'loan'}
              />
            ))}
          </Section>
        )}

        {/* Banks */}
        {accountGroups.bank.length > 0 && (
          <Section title="Banks" icon={<Landmark size={16} />}>
            {accountGroups.bank.map(acc => (
              <MockAccountCard
                key={acc.id}
                icon={
                  <Image
                    source={institutionLogos[acc.institutionSlug]}
                    style={styles.logo}
                  />
                }
                name={acc.name}
                displayNumber={formatDisplayNumber(acc)}
                balance={formatCurrency(acc.balance)}
              />
            ))}
          </Section>
        )}

        {/* E-Wallet */}
        {accountGroups.ewallet.length > 0 && (
          <Section title="E-Money" icon={<Wallet size={16} />}>
            {accountGroups.ewallet.map(acc => (
              <MockAccountCard
                key={acc.id}
                icon={
                  <Image
                    source={institutionLogos[acc.institutionSlug]}
                    style={styles.logo}
                  />
                }
                name={acc.name}
                displayNumber={formatDisplayNumber(acc)}
                balance={formatCurrency(acc.balance)}
              />
            ))}
          </Section>
        )}

        {/* Investments */}
        {accountGroups.investment.length > 0 && (
          <Section title="Investments" icon={<Briefcase size={16} />}>
            {accountGroups.investment.map(acc => (
              <MockAccountCard
                key={acc.id}
                icon={
                  <Image
                    source={institutionLogos[acc.institutionSlug]}
                    style={styles.logo}
                  />
                }
                name={acc.name}
                displayNumber={formatDisplayNumber(acc)}
                balance={formatCurrency(acc.balance)}
              />
            ))}
          </Section>
        )}

        {/* Loans */}
        {accountGroups.loan.length > 0 && (
          <Section title="Loans" icon={<Coins size={16} />}>
            {accountGroups.loan.map(acc => (
              <MockAccountCard
                key={acc.id}
                icon={
                  <Image
                    source={institutionLogos[acc.institutionSlug]}
                    style={styles.logo}
                  />
                }
                name={acc.name}
                displayNumber={formatDisplayNumber(acc)}
                balance={formatCurrency(acc.balance)}
                isLoan
              />
            ))}
          </Section>
        )}
      </Animated.ScrollView>
    </View>
  );
}

// -------------------
// Section helper
// -------------------
const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

// -------------------
// Styles
// -------------------
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    maxWidth: 360,
    height: 600,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#818cf833',
    backgroundColor: '#ffffffcc',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 8, paddingBottom: 24 },
  totalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  totalLabel: { fontSize: 14, color: '#64748b' },
  totalAmount: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionBody: { gap: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  cardInner: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 1,
  },
  logo: { width: 28, height: 28, resizeMode: 'contain' },
  textWrapper: { flex: 1 },
  cardTitle: { fontWeight: '600', fontSize: 14 },
  cardSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  balance: { fontSize: 14, fontWeight: '600' },
  negative: { color: '#ef4444' },
});