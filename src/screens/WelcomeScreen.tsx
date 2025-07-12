import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent, Animated, Platform, StatusBar } from 'react-native';
import theme from '~/theme/theme';
import WelcomeHeader from '~/components/WelcomeHeader';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { BarChart2 } from 'lucide-react-native';

const WelcomeScreen = () => {
  const { width } = useWindowDimensions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const slides = [
    {
      title: 'All Your Money,',
      gradientTitle: 'One Single App.',
      description: 'Semua securely connects to all your accounts, giving you a complete financial overview and AI-powered insights to grow your wealth.',
      icon: null,
    },
    {
      title: 'Unified Dashboard',
      description: 'See your complete financial picture in one glance. Track balances across all your linked accounts in real-time.',
      icon: BarChart2,
    },
    {
      title: 'Effortless Payments',
      description: 'Pay bills, transfer funds, and top-up e-wallets seamlessly from any of your accounts, all from one central hub.',
      icon: null,
    },
    {
      title: 'Smart Budgeting',
      description: 'Set custom budgets, track your spending against them in real-time, and get coached by our AI to stay on track.',
      icon: null,
    },
    {
      title: 'AI-Powered Insights',
      description: 'Let our AI analyze your spending to find personalized saving opportunities and create actionable financial plans.',
      icon: null,
    },
    {
      title: 'Automated Savings',
      description: 'Create savings vaults for your goals. Automate contributions with round-ups and scheduled transfers.',
      icon: null,
    },
    {
      title: 'Bank-Grade Security',
      description: 'Your data is protected with the highest bank-grade security standards, including 256-bit AES encryption. Your privacy is our priority.',
      icon: null,
    },
    {
      title: 'Sign Up',
      description: '',
      icon: null,
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setSelectedIndex(newIndex);
    Animated.event(
      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
      { useNativeDriver: false }
    )(event);
  };

  const headerTranslateY = scrollX.interpolate({
    inputRange: [(slides.length - 2) * width, (slides.length - 1) * width],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollX.interpolate({
    inputRange: [(slides.length - 2) * width, (slides.length - 1) * width],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[{ transform: [{ translateY: headerTranslateY }], opacity: headerOpacity }, styles.header]}>
        <WelcomeHeader onLoginPress={() => {}} onSignUpPress={() => {}} />
      </Animated.View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            <View style={styles.textContainer}>
              {slide.icon && <slide.icon size={48} color={theme.colors.primary} style={styles.icon} />}
              {index === 0 ? (
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <MaskedView
                    style={styles.maskedView}
                    maskElement={<Text style={[styles.title, styles.gradientText, { backgroundColor: 'transparent' }]}>{slide.gradientTitle}</Text>}
                  >
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.accent]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={[styles.title, styles.gradientText, { opacity: 0 }]}>{slide.gradientTitle}</Text>
                    </LinearGradient>
                  </MaskedView>
                </View>
              ) : (
                <Text style={styles.title}>{slide.title}</Text>
              )}
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { opacity: selectedIndex === i ? 1 : 0.3, width: selectedIndex === i ? 16 : 8 }]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
