import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '~/theme/theme';

const WelcomeDashboardMockup = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard Mockup</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.muted,
    borderRadius: 16,
  },
  text: {
    color: theme.colors.foreground,
    fontSize: theme.fontSizes.large,
  },
});

export default WelcomeDashboardMockup;
