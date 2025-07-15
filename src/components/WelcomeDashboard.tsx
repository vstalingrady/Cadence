
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, AppState } from 'react-native';
import { Landmark, Briefcase, Wallet, Coins, Pin } from 'lucide-react-native';
import theme from '~/theme/theme';
import BalanceChart from './BalanceChart';

// --- Mock Data ---
type Account = {
  id: string;
  name: string;
  institutionSlug: string;
  type: 'bank' | 'loan' | 'e-wallet' | 'investment';
  balance: number;
  accountNumber: string;
  isPinned?: boolean;
};

const mockAccounts: Account[] = [
    { id: 'acc_bca_tahapan_1', name: 'BCA Tahapan Gold', institutionSlug: 'bca', type: 'bank', balance: 85200501, accountNumber: '2847', isPinned: true },
    { id: 'acc_gopay_main_3', name: 'GoPay', institutionSlug: 'gopay', type: 'e-wallet', balance: 1068000, accountNumber: '7890' },
    { id: 'acc_mandiri_payroll_4', name: 'Mandiri Payroll', institutionSlug: 'mandiri', type: 'bank', balance: 42500000, accountNumber: '5566' },
    { id: 'acc_bibit_main_5', name: 'Bibit Portfolio', institutionSlug: 'bibit', type: 'investment', balance: 125000000, accountNumber: 'IVST' },
];

const generateChartData = (netWorth: number) => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const fluctuation = (Math.random() - 0.5) * 0.1;
    data.push({ date, netWorth: netWorth * (1 + fluctuation) });
  }
  return data;
};

// --- Helper Functions ---
const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const getAccountIcon = (slug: string) => {
    const icons: { [key: string]: string } = {
        bca: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg',
        gopay: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
        bibit: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bibit.id_logo.svg',
        mandiri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg',
    };
    return <Image source={{ uri: icons[slug] }} style={styles.accountIconImage} resizeMode="contain" />;
};

// --- Components ---
const TotalBalance = ({ amount }: { amount: number }) => (
    <View style={styles.totalBalanceContainer}>
        <Text style={styles.totalBalanceTitle}>Total Net Worth</Text>
        <Text style={styles.totalBalanceAmount}>{formatCurrency(amount)}</Text>
    </View>
);

const AccountCard = ({ icon, name, balance }: { icon: React.ReactNode, name: string, balance: string }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>{icon}</View>
            <Text style={styles.cardName} numberOfLines={1}>{name}</Text>
        </View>
        <Text style={styles.cardBalance}>{balance}</Text>
    </View>
);

const WelcomeDashboard = ({ isActive }: { isActive?: boolean }) => {
    const scrollRef = useRef<ScrollView>(null);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            appState.current = nextAppState;
        });

        let scrollInterval: NodeJS.Timeout;

        const animateScroll = () => {
             if (appState.current === 'active' && isActive) {
                scrollRef.current?.scrollToEnd({ animated: true });
                setTimeout(() => {
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                }, 4000);
            }
        };

        if (isActive) {
            scrollInterval = setInterval(animateScroll, 8000);
        }

        return () => {
            subscription.remove();
            if(scrollInterval) clearInterval(scrollInterval);
        };
    }, [isActive]);

    const netWorth = useMemo(() => mockAccounts.reduce((sum, acc) => sum + acc.balance, 0), []);
    const chartData = useMemo(() => generateChartData(netWorth), [netWorth]);

    return (
        <View style={styles.container}>
            <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollViewContent}>
                <TotalBalance amount={netWorth} />
                <BalanceChart chartData={chartData} onPointSelect={() => {}} />
                <View style={styles.sectionContainer}>
                    {mockAccounts.map(account => (
                        <AccountCard
                            key={account.id}
                            icon={getAccountIcon(account.institutionSlug)}
                            name={account.name}
                            balance={formatCurrency(account.balance)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginTop: 80,
        overflow: 'hidden',
    },
    scrollViewContent: {
        padding: 16,
    },
    totalBalanceContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    totalBalanceTitle: {
        color: theme.colors.mutedForeground,
        fontSize: 16,
        fontFamily: theme.fonts.sans,
    },
    totalBalanceAmount: {
        color: theme.colors.foreground,
        fontSize: 32,
        fontFamily: theme.fonts.serif,
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginTop: 16,
    },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    accountIconImage: {
        width: 24,
        height: 24,
    },
    cardName: {
        color: theme.colors.foreground,
        fontSize: 16,
        fontFamily: theme.fonts.sans,
        fontWeight: '600',
        flex: 1,
    },
    cardBalance: {
        color: theme.colors.foreground,
        fontSize: 16,
        fontFamily: theme.fonts.sans,
        fontWeight: '600',
    },
});

export default WelcomeDashboard;
