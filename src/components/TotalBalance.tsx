import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '~/theme/theme';

interface TotalBalanceProps {
  title: string;
  amount: number;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(amount);

const TotalBalance: React.FC<TotalBalanceProps> = ({ title, amount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>{formatCurrency(amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSizes.medium,
    marginBottom: theme.spacing.small,
  },
  amount: {
    color: theme.colors.foreground,
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
  },
});

export default TotalBalance;
