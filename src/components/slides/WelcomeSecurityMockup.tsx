import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Shield, Lock, Eye, Fingerprint, Key, CheckCircle } from 'lucide-react-native';
import theme from '~/theme/theme';

const SecurityFeature = ({ icon: Icon, title, description, status = 'active' }: any) => (
  <View style={styles.featureCard}>
    <View style={styles.featureHeader}>
      <View style={styles.iconContainer}>
        <Icon color={theme.colors.primary} size={20} />
      </View>
      <View style={styles.featureInfo}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      <View style={styles.statusContainer}>
        <CheckCircle color={theme.colors.success} size={16} />
      </View>
    </View>
  </View>
);

const WelcomeSecurityMockup = ({ isActive }: { isActive?: boolean }) => {
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }
  }, [isActive, fadeAnim, pulseAnim]);

  const securityFeatures = [
    {
      icon: Shield,
      title: '256-bit AES Encryption',
      description: 'Bank-grade encryption protects all your data',
      status: 'active',
    },
    {
      icon: Fingerprint,
      title: 'Biometric Authentication',
      description: 'Secure access with fingerprint or face ID',
      status: 'active',
    },
    {
      icon: Lock,
      title: 'Two-Factor Authentication',
      description: 'Extra layer of security for your account',
      status: 'active',
    },
    {
      icon: Eye,
      title: 'Privacy Controls',
      description: 'You control what data is shared and when',
      status: 'active',
    },
    {
      icon: Key,
      title: 'Secure Key Management',
      description: 'Advanced cryptographic key protection',
      status: 'active',
    },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.mockupFrame}>
        <Animated.View style={[styles.header, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.shieldContainer}>
            <Shield color={theme.colors.primary} size={32} />
          </View>
          <Text style={styles.headerTitle}>Security Center</Text>
          <Text style={styles.headerSubtitle}>Your data is protected</Text>
        </Animated.View>
        
        <ScrollView 
          ref={scrollRef}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.featuresContainer}>
            {securityFeatures.map((feature, index) => (
              <SecurityFeature
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                status={feature.status}
              />
            ))}
            
            <View style={styles.certificationSection}>
              <Text style={styles.certificationTitle}>Certifications & Compliance</Text>
              <View style={styles.certificationGrid}>
                <View style={styles.certificationBadge}>
                  <Text style={styles.badgeText}>ISO 27001</Text>
                </View>
                <View style={styles.certificationBadge}>
                  <Text style={styles.badgeText}>PCI DSS</Text>
                </View>
                <View style={styles.certificationBadge}>
                  <Text style={styles.badgeText}>SOC 2</Text>
                </View>
                <View style={styles.certificationBadge}>
                  <Text style={styles.badgeText}>GDPR</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockupFrame: {
    width: '90%',
    maxWidth: 300,
    height: 400,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    padding: theme.spacing.large,
    backgroundColor: theme.colors.background + '50',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  shieldContainer: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.medium,
  },
  headerTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
  },
  scrollContainer: {
    flex: 1,
  },
  featuresContainer: {
    padding: theme.spacing.medium,
    gap: 12,
  },
  featureCard: {
    backgroundColor: theme.colors.background + '80',
    padding: theme.spacing.medium,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border + '50',
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.medium,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: 2,
  },
  featureDescription: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
  },
  statusContainer: {
    marginLeft: theme.spacing.small,
  },
  certificationSection: {
    marginTop: theme.spacing.large,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background + '60',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border + '30',
  },
  certificationTitle: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  certificationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  certificationBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  badgeText: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default WelcomeSecurityMockup;