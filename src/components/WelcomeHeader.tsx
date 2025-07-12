import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '~/theme/theme';

interface WelcomeHeaderProps {
  onLoginPress: () => void;
  onSignUpPress: () => void;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onLoginPress, onSignUpPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Semua</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onLoginPress}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={onSignUpPress}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
  },
  logo: {
    fontFamily: theme.fonts.serif,
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  loginText: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.foreground,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: 8,
  },
  signUpText: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.background,
    fontWeight: '600',
  },
});

export default WelcomeHeader;
