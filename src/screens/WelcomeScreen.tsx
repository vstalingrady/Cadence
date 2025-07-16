import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform, StatusBar, SafeAreaView } from 'react-native';
import theme from '~/theme/theme';
import WelcomeHeader from '~/components/WelcomeHeader';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import WelcomeDashboardMockup from '~/components/slides/WelcomeDashboardMockup';
import TitleSlide from '~/components/slides/TitleSlide';
import Dot from '~/components/Dot';

const WelcomeScreen = () => {
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const generateData = () => {
      const data = [];
      for (let i = 0; i < 30; i++) {
        data.push({
          date: new Date(2025, 0, i + 1),
          netWorth: Math.random() * 100000,
        });
      }
      setChartData(data);
    };

    generateData();
  }, []);

  const slides = [
    {
      type: 'title',
      title: 'All Your Money,',
      gradientTitle: 'One Single App.',
      description: 'Semua securely connects to all your accounts, giving you a complete financial overview and AI-powered insights to grow your wealth.',
    },
    {
      type: 'dashboard',
    },
    {
      type: 'generic',
      title: 'Effortless Payments',
      description: 'Pay bills, transfer funds, and top-up e-wallets seamlessly from any of your accounts, all from one central hub.',
      icon: null,
    },
    {
      type: 'generic',
      title: 'Smart Budgeting',
      description: 'Set custom budgets, track your spending against them in real-time, and get coached by our AI to stay on track.',
      icon: null,
    },
    {
      type: 'generic',
      title: 'AI-Powered Insights',
      description: 'Let our AI analyze your spending to find personalized saving opportunities and create actionable financial plans.',
      icon: null,
    },
    {
      type: 'generic',
      title: 'Automated Savings',
      description: 'Create savings vaults for your goals. Automate contributions with round-ups and scheduled transfers.',
      icon: null,
    },
    {
      type: 'generic',
      title: 'Bank-Grade Security',
      description: 'Your data is protected with the highest bank-grade security standards, including 256-bit AES encryption. Your privacy is our priority.',
      icon: null,
    },
    {
      type: 'generic',
      title: 'Sign Up',
      description: '',
      icon: null,
    },
  ];

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
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
        contentContainerStyle={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[slide.type === 'dashboard' ? styles.dashboardSlide : styles.slide, { width }]}>
            {slide.type === 'title' && <TitleSlide title={slide.title} gradientTitle={slide.gradientTitle} description={slide.description} />}
            {slide.type === 'dashboard' && <WelcomeDashboardMockup isActive={index === 1} chartData={chartData} onPointSelect={() => {}} />}
            {slide.type === 'generic' && <GenericSlide title={slide.title} description={slide.description} icon={slide.icon} />}
          </View>
        ))}
      </Animated.ScrollView>
      <View style={styles.dotContainer}>
        {slides.map((_, i) => (
          <Dot key={i} scrollX={scrollX} index={i} width={width} />
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
  dashboardSlide: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.large,
  },
  textContainer: {
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.foreground,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
    lineHeight: theme.lineHeights.loose,
  },
  gradientText: {
    textShadowColor: `${theme.colors.primary}90`,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  description: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: theme.spacing.medium,
  },
  maskedView: {
    height: theme.fontSizes.xxl + theme.lineHeights.loose / 2,
  },
  icon: {
    marginBottom: theme.spacing.large,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.large,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 4,
  },
});

export default WelcomeScreen;
