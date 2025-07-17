import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import theme from '~/theme/theme';

// Mock financial institutions data
const financialInstitutions = [
  { name: 'BCA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg' },
  { name: 'Mandiri', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg' },
  { name: 'BRI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg' },
  { name: 'BNI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/BNI_logo.svg' },
  { name: 'GoPay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
  { name: 'OVO', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
  { name: 'DANA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' },
  { name: 'ShopeePay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg' },
];

const LogoScroller = ({ institutions, reverse = false }: { institutions: any[], reverse?: boolean }) => (
  <View style={styles.logoRow}>
    {institutions.map((institution, index) => (
      <View key={index} style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>{institution.name}</Text>
        </View>
      </View>
    ))}
  </View>
);

const WelcomeSignupSlide = () => {
  const partnersRow1 = financialInstitutions.slice(0, 4);
  const partnersRow2 = financialInstitutions.slice(4, 8);
  const partnersRow3 = financialInstitutions.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Ready to take control?</Text>
          <Text style={styles.subtitle}>
            We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.
          </Text>
        </View>

        <View style={styles.logosSection}>
          <LogoScroller institutions={partnersRow1} />
          <LogoScroller institutions={partnersRow2} reverse />
          <LogoScroller institutions={partnersRow3} />
        </View>

        <View style={styles.buttonsSection}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Get Started for Free</Text>
            <ArrowRight color={theme.colors.background} size={20} style={styles.buttonIcon} />
          </TouchableOpacity>
          
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Cadence. All Rights Reserved.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: theme.spacing.medium,
  },
  content: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
    marginBottom: theme.spacing.large,
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
  },
  subtitle: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  logosSection: {
    width: '100%',
    marginBottom: theme.spacing.xl,
    gap: 12,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.small,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 60,
    height: 36,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  logoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  buttonsSection: {
    width: '100%',
    gap: theme.spacing.large,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.large,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
  buttonIcon: {
    marginLeft: theme.spacing.medium,
  },
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
  },
  loginLink: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: theme.spacing.xl,
  },
  footerText: {
    fontFamily: theme.fonts.sans,
    fontSize: 12,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
});

export default WelcomeSignupSlide;