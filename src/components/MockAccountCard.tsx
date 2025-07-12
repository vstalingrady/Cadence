import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '~/theme/theme';

interface MockAccountCardProps {
  icon: any;
  name: string;
  displayNumber: string;
  balance: string;
  isLoan?: boolean;
}

const MockAccountCard: React.FC<MockAccountCardProps> = ({ icon, name, displayNumber, balance, isLoan }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          {displayNumber ? <Text style={styles.displayNumber}>{displayNumber}</Text> : null}
        </View>
      </View>
      <Text style={[styles.balance, isLoan && styles.loanBalance]}>{balance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${theme.colors.card}80`,
    padding: theme.spacing.medium,
    borderRadius: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.medium,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: theme.colors.foreground,
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
  },
  displayNumber: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSizes.small,
  },
  balance: {
    color: theme.colors.foreground,
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
  },
  loanBalance: {
    color: theme.colors.primary,
  },
});

export default MockAccountCard;
