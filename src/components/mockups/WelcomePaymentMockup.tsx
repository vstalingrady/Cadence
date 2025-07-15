
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

const WelcomePaymentMockup = ({ isActive, className }) => {
  return (
    <View style={[styles.container, className]}>
      <Text style={styles.text}>Payment Mockup</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.light.secondary,
    borderRadius: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.light.secondaryForeground,
  },
});

export default WelcomePaymentMockup;
