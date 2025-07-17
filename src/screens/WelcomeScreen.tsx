import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import { BarChart2, Zap, PiggyBank, Sparkles, ClipboardList, ShieldCheck } from 'lucide-react-native';
import theme from '~/theme/theme';
import WelcomeHeader from '~/components/WelcomeHeader';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import WelcomeDashboardMockup from '~/components/slides/WelcomeDashboardMockup';
import WelcomePaymentMockup from '~/components/slides/WelcomePaymentMockup';
import WelcomeInsightsMockup from '~/components/slides/WelcomeInsightsMockup';
import WelcomeVaultsMockup from '~/components/slides/WelcomeVaultsMockup';
import WelcomeBudgetsMockup from '~/components/slides/WelcomeBudgetsMockup';
import WelcomeSecurityMockup from '~/components/slides/WelcomeSecurityMockup';
import WelcomeSignupSlide from '~/components/slides/WelcomeSignupSlide';

const WelcomeScreen = () => {
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const generateData = () => {
      const data = [];
      for (let i = 0; i < 30; i++) {
        data.push({
          date: new Date(2025, 0, i + 1),
          netWorth: Math.random() * 100000000 + 200000000,
        });
      }
      setChartData(data);
    };

    generateData();
  }, []);

  const slides = [
    {
      type: 'hero',
      title: 'All Your Money,',
      gradientTitle: 'One Single App.',
      description: 'Cadence securely connects to all your accounts, giving you a complete financial overview and AI-powered insights to grow your wealth.',
    },
    {
      type: 'dashboard',
      title: 'Unified Dashboard',
      description: 'See your complete financial picture in one glance. Track balances across all your linked accounts in real-time.',
      icon: BarChart2,
    },
    {
      type: 'payments',
      title: 'Effortless Payments',
      description: 'Pay bills, transfer funds, and top-up e-wallets seamlessly from any of your accounts, all from one central hub.',
      icon: Zap,
    },
    {
      type: 'budgets',
      title: 'Smart Budgeting',
      description: 'Set custom budgets, track your spending against them in real-time, and get coached by our AI to stay on track.',
      icon: ClipboardList,
    },
    {
      type: 'insights',
      title: 'AI-Powered Insights',
      description: 'Let our AI analyze your spending to find personalized saving opportunities and create actionable financial plans.',
      icon: Sparkles,
    },
    {
      type: 'vaults',
      title: 'Automated Savings',
      description: 'Create savings vaults for your goals. Automate contributions with round-ups and scheduled transfers.',
      icon: PiggyBank,
    },
    {
      type: 'security',
      title: 'Bank-Grade Security',
      description: 'Your data is protected with the highest bank-grade security standards, including 256-bit AES encryption. Your privacy is our priority.',
      icon: ShieldCheck,
    },
    {
      type: 'signup',
      title: 'Ready to take control?',
      description: 'We support all major banks, e-wallets, and payment providers in Indonesia, with more coming soon.',
    },
  ];

  const numSlides = slides.length;
  const isLastSlide = selectedIndex === numSlides - 1;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / width);
      setSelectedIndex(index);
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [(slides.length - 2) * width, (slides.length - 1) * width],
      [1, 0],
      'clamp'
    );

    const translateY = interpolate(
      scrollX.value,
      [(slides.length - 2) * width, (slides.length - 1) * width],
      [0, -100],
      'clamp'
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const renderSlide = (slide: any, index: number) => {
    const IconComponent = slide.icon;
    
    switch (slide.type) {
      case 'hero':
        return (
          <View style={[styles.slide, { width }]}>
            <View style={styles.heroContainer}>
              <Text style={styles.heroTitle}>
                {slide.title}{'\n'}
                <MaskedView
                  style={styles.maskedView}
                  maskElement={
                    <Text style={[styles.heroTitle, { backgroundColor: 'transparent' }]}>
                      {slide.gradientTitle}
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBackground}
                  />
                </MaskedView>
              </Text>
              <Text style={styles.heroDescription}>{slide.description}</Text>
            </View>
          </View>
        );
      
      case 'dashboard':
        return (
          <View style={[styles.featureSlide, { width }]}>
            <View style={styles.featureHeader}>
              <IconComponent color={theme.colors.primary} size={32} style={styles.featureIcon} />
              <Text style={styles.featureTitle}>{slide.title}</Text>
              <Text style={styles.featureDescription}>{slide.description}</Text>
            </View>
            <View style={styles.mockupContainer}>
              <WelcomeDashboardMockup 
                isActive={selectedIndex === index} 
                chartData={chartData}
                onPointSelect={() => {}}
              />
            </View>
          </View>
        );
      
      case 'payments':
        return (
          <View style={[styles.featureSlide, { width }]}>
            <View style={styles.featureHeader}>
              <IconComponent color={theme.colors.primary} size={32} style={styles.featureIcon} />
              <Text style={styles.featureTitle}>{slide.title}</Text>
              <Text style={styles.featureDescription}>{slide.description}</Text>
            </View>
            <View style={styles.mockupContainer}>
              <WelcomePaymentMockup isActive={selectedIndex === index} />
            </View>
          </View>
        );
      
      case 'budgets':
        return (
          <View style={[styles.featureSlide, { width }]}>
            <View style={styles.featureHeader}>
              <IconComponent color={theme.colors.primary} size={32} style={styles.featureIcon} />
              <Text style={styles.featureTitle}>{slide.title}</Text>
              <Text style={styles.featureDescription}>{slide.description}</Text>
            </View>
            <View style={styles.mockupContainer}>
              <WelcomeBudgetsMockup isActive={selectedIndex === index} />
            </View>
          </View>
        );
      
      case 'insights':
        return (
          <View style={[styles.featureSlide, { width }]}>
            <View style={styles.featureHeader}>
              <IconComponent color={theme.colors.primary} size={32} style={styles.featureIcon} />
              <Text style={styles.featureTitle}>{slide.title}</Text>
              <Text style={styles.featureDescription}>{slide.description}</Text>
            </View>
            <View style={styles.mockupContainer}>
              <WelcomeInsightsMockup isActive={selectedIndex === index} />
            </View>
          </View>
        );
      
      case 'vaults':
        return (
          <View style={[styles.featureSlide, { width }]}>
            <View style={styles.featureHeader}>
              <IconComponent color={theme.colors.primary} size={32} style={styles.featureIcon} />
              <Text style={styles.featureTitle}>{slide.title}</Text>
              <Text style={styles.featureDescription}>{slide.description}</Text>
            </View>
            <View style={styles.mockupContainer}>
              <WelcomeVaultsMockup isActive={selectedIndex === index} />
            </View>
          </View>
        );
      
      case 'security':
        return (
          <View style={[styles.featureSlide, { width }]}>
            <View style={styles.featureHeader}>
              <IconComponent color={theme.colors.primary} size={32} style={styles.featureIcon} />
              <Text style={styles.featureTitle}>{slide.title}</Text>
              <Text style={styles.featureDescription}>{slide.description}</Text>
            </View>
            <View style={styles.mockupContainer}>
              <WelcomeSecurityMockup isActive={selectedIndex === index} />
            </View>
          </View>
        );
      
      case 'signup':
        return (
          <View style={[styles.signupSlide, { width }]}>
            <WelcomeSignupSlide />
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <WelcomeHeader onLoginPress={() => {}} onSignUpPress={() => {}} />
      </Animated.View>
      
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={index}>
            {renderSlide(slide, index)}
          </View>
        ))}
      </Animated.ScrollView>
      
      <View style={styles.dotContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              {
                width: selectedIndex === index ? 24 : 8,
                backgroundColor: selectedIndex === index ? theme.colors.primary : theme.colors.mutedForeground + '50',
              }
            ]}
            onPress={() => {
              // Scroll to specific slide - we'll implement this if needed
            }}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 320,
  },
  heroTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: 32,
    color: theme.colors.foreground,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 40,
  },
  heroDescription: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: theme.spacing.large,
  },
  maskedView: {
    height: 40,
  },
  gradientBackground: {
    flex: 1,
  },
  featureSlide: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.large,
    paddingTop: 80,
    paddingBottom: theme.spacing.large,
  },
  featureHeader: {
    alignItems: 'center',
    maxWidth: 320,
    minHeight: 144,
    marginBottom: theme.spacing.large,
  },
  featureIcon: {
    marginBottom: theme.spacing.medium,
  },
  featureTitle: {
    fontFamily: theme.fonts.serif,
    fontSize: theme.fontSizes.xl,
    color: theme.colors.foreground,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: theme.spacing.small,
  },
  featureDescription: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  mockupContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: theme.spacing.medium,
  },
  signupSlide: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.large,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
  },
});

export default WelcomeScreen;
