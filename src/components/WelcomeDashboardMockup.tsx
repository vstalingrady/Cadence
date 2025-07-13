import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, AppState, SafeAreaView } from 'react-native';
import { Landmark, Briefcase, Wallet, Coins, Pin } from 'lucide-react-native';
import TotalBalance from './TotalBalance';

// --- Mock Data ---
// In a real app, this data would likely come from an API or a global state management solution.

type Account = {
  id: string;
  name: string;
  institutionSlug: string;
  type: 'bank' | 'loan' | 'e-wallet' | 'investment';
  balance: number;
  accountNumber: string;
  isPinned?: boolean;
};

type Transaction = {
    id: string;
    accountId: string;
    amount: number;
    date: string;
    description: string;
    category: string;
};

// Example mock data is kept here for demonstration purposes.
const mockAccounts: Account[] = [
    { id: 'acc_bca_tahapan_1', name: 'BCA Tahapan Gold', institutionSlug: 'bca', type: 'bank', balance: 85200501, accountNumber: '2847', isPinned: true },
    { id: 'acc_bca_kredit_2', name: 'BCA Everyday Card', institutionSlug: 'bca', type: 'loan', balance: 4500000, accountNumber: '5588' },
    { id: 'acc_gopay_main_3', name: 'GoPay', institutionSlug: 'gopay', type: 'e-wallet', balance: 1068000, accountNumber: '7890' },
    { id: 'acc_mandiri_payroll_4', name: 'Mandiri Payroll', institutionSlug: 'mandiri', type: 'bank', balance: 42500000, accountNumber: '5566' },
    { id: 'acc_bibit_main_5', name: 'Bibit Portfolio', institutionSlug: 'bibit', type: 'investment', balance: 125000000, accountNumber: 'IVST' },
];

const mockTransactions: Transaction[] = [
    { id: 'txn_1', accountId: 'acc_bca_tahapan_1', amount: 55000000, date: '2024-07-25', description: 'Salary Deposit', category: 'Income' },
    { id: 'txn_11', accountId: 'acc_bibit_main_5', amount: -25000000, date: '2024-07-02', description: 'Invest in Mutual Fund', category: 'Investments' },
    { id: 'txn_14', accountId: 'acc_mandiri_payroll_4', amount: 15000000, date: '2024-07-15', description: 'Project Freelance Payment', category: 'Income' },
];


// --- Helper Functions ---

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const formatDisplayNumber = (account: Account): string => {
    const { accountNumber, type } = account;
    if (type === 'investment') return 'Portfolio';
    if (type === 'loan') return 'Outstanding Debt';
    if (accountNumber && accountNumber.length > 4) {
        return `...${accountNumber.substring(accountNumber.length - 4)}`;
    }
    return `...${accountNumber}`;
};

const getAccountIcon = (slug: string) => {
    const icons: { [key: string]: string } = {
        bca: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg',
        gopay: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
        bibit: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bibit.id_logo.svg',
        mandiri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg',
    };
    return <Image source={{ uri: icons[slug] }} style={styles.accountIconImage} resizeMode="contain" />;
};


// --- Sub-components for better structure ---

const MockAccountCard = ({ account }: { account: Account }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>{getAccountIcon(account.institutionSlug)}</View>
            <View style={styles.cardTextContainer}>
                <Text style={styles.cardName} numberOfLines={1}>{account.name}</Text>
                <Text style={styles.cardDisplayNumber}>{formatDisplayNumber(account)}</Text>
            </View>
        </View>
        <Text style={[styles.cardBalance, account.type === 'loan' && styles.loanBalance]}>
            {formatCurrency(account.balance)}
        </Text>
    </View>
);

const AccountSection = ({ title, icon, accounts }: { title: string, icon: React.ReactNode, accounts: Account[] }) => {
    if (accounts.length === 0) return null;
    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                {icon}
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View style={styles.sectionContent}>
                {accounts.map(account => <MockAccountCard key={account.id} account={account} />)}
            </View>
        </View>
    );
};


// --- Main WelcomeDashboard Component ---

const WelcomeDashboard = ({ isActive = true }: { isActive?: boolean }) => {
    const scrollRef = useRef<ScrollView>(null);

    // This hook manages the auto-scrolling animation.
    useEffect(() => {
        let scrollInterval: NodeJS.Timeout | null = null;
        
        const animateScroll = () => {
            if (isActive) {
                scrollRef.current?.scrollToEnd({ animated: true });
                setTimeout(() => {
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                }, 4000);
            }
        };

        if (isActive) {
            // Start the animation after a short delay
            setTimeout(() => {
                animateScroll();
                scrollInterval = setInterval(animateScroll, 8000);
            }, 2000);
        }

        return () => {
            if (scrollInterval) clearInterval(scrollInterval);
        };
    }, [isActive]);

    // This hook calculates financial summaries and groups accounts.
    const { netWorth, pinnedAccounts, accountGroups } = useMemo(() => {
        const totalAssets = mockAccounts.filter(acc => acc.type !== 'loan').reduce((sum, acc) => sum + acc.balance, 0);
        const totalLiabilities = mockAccounts.filter(acc => acc.type === 'loan').reduce((sum, acc) => sum + acc.balance, 0);
        
        return {
            netWorth: totalAssets - totalLiabilities,
            pinnedAccounts: mockAccounts.filter(a => a.isPinned),
            accountGroups: {
                bank: mockAccounts.filter(a => a.type === 'bank' && !a.isPinned),
                ewallet: mockAccounts.filter(a => a.type === 'e-wallet' && !a.isPinned),
                investment: mockAccounts.filter(a => a.type === 'investment' && !a.isPinned),
                loan: mockAccounts.filter(a => a.type === 'loan' && !a.isPinned),
            },
        };
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollViewContent}>
                    <TotalBalance
                        title="Total Net Worth"
                        amount={netWorth}
                    />
                    
                    <AccountSection title='Pinned' icon={<Pin color="#3b82f6" size={16} />} accounts={pinnedAccounts} />
                    <AccountSection title='Bank Accounts' icon={<Landmark color="#A0A0A0" size={16} />} accounts={accountGroups.bank} />
                    <AccountSection title='E-Money' icon={<Wallet color="#A0A0A0" size={16} />} accounts={accountGroups.ewallet} />
                    <AccountSection title='Investments' icon={<Briefcase color="#A0A0A0" size={16} />} accounts={accountGroups.investment} />
                    <AccountSection title='Loans' icon={<Coins color="#A0A0A0" size={16} />} accounts={accountGroups.loan} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};


// --- Styles ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        padding: 8,
        margin: 16,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    sectionContainer: {
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        color: '#E5E5EA',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    sectionContent: {
        marginTop: 8,
    },
    card: {
        backgroundColor: 'rgba(44, 44, 46, 0.8)',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
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
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    accountIconImage: {
        width: 32,
        height: 32,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    cardDisplayNumber: {
        color: '#8E8E93',
        fontSize: 12,
        marginTop: 2,
    },
    cardBalance: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    loanBalance: {
        color: '#FF453A', // iOS destructive red
    },
});

export default WelcomeDashboard;