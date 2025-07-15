import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { BarChart2, Zap, PiggyBank, Sparkles, ClipboardList, ShieldCheck } from 'lucide-react-native';
import { theme } from '../theme/theme';
import Button from '../components/ui/Button';
import WelcomeDashboardMockup from '../components/mockups/WelcomeDashboardMockup';
import WelcomePaymentMockup from '../components/mockups/WelcomePaymentMockup';
import WelcomeBudgetsMockup from '../components/mockups/WelcomeBudgetsMockup';
import WelcomeInsightsMockup from '../components/mockups/WelcomeInsightsMockup';
import WelcomeVaultsMockup from '../components/mockups/WelcomeVaultsMockup';
import WelcomeSecurityMockup from '../components/mockups/WelcomeSecurityMockup';

const { width } = Dimensions.get('window');

const slides = [
    {
        type: 'hero',
        title: 'All Your Money, \nOne Single App.',
        description: 'Semua securely connects to all your accounts, giving you a complete financial overview and AI-powered insights to grow your wealth.',
    },
    {
        type: 'feature',
        icon: BarChart2,
        title: 'Unified Dashboard',
        description: 'See your complete financial picture in one glance. Track balances across all your linked accounts in real-time.',
        mockup: WelcomeDashboardMockup,
    },
    {
        type: 'feature',
        icon: Zap,
        title: 'Effortless Payments',
        description: 'Pay bills, transfer funds, and top-up e-wallets seamlessly from any of your accounts, all from one central hub.',
        mockup: WelcomePaymentMockup,
    },
    {
        type: 'feature',
        icon: ClipboardList,
        title: 'Smart Budgeting',
        description: 'Set custom budgets, track your spending against them in real-time, and get coached by our AI to stay on track.',
        mockup: WelcomeBudgetsMockup,
    },
    {
        type: 'feature',
        icon: Sparkles,
        title: 'AI-Powered Insights',
        description: 'Let our AI analyze your spending to find personalized saving opportunities and create actionable financial plans.',
        mockup: WelcomeInsightsMockup,
    },
    {
        type: 'feature',
        icon: PiggyBank,
        title: 'Automated Savings',
        description: 'Create savings vaults for your goals. Automate contributions with round-ups and scheduled transfers.',
        mockup: WelcomeVaultsMockup,
    },
    {
        type: 'feature',
        icon: ShieldCheck,
        title: 'Bank-Grade Security',
        description: 'Your data is protected with the highest bank-grade security standards, including 256-bit AES encryption. Your privacy is our priority.',
        mockup: WelcomeSecurityMockup,
    },
    {
        type: 'signup',
        title: 'Create Your Account',
        description: 'Join Semua today and take control of your financial future. It’s free, secure, and takes less than a minute.',
    }
];

const WelcomeScreen = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const carouselRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleLogin = () => {
    // navigation.navigate('Login');
  };

  const handleSignUp = () => {
    // navigation.navigate('SignUp');
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [(slides.length - 2) * width, (slides.length - 1) * width],
      [1, 0],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollX.value,
      [(slides.length - 2) * width, (slides.length - 1) * width],
      [0, -100],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const renderItem = ({ item, index }) => {
    if (item.type === 'hero') {
        return (
            <View style={styles.slideContainer}>
                <View style={styles.slideContent}>
                    <Text style={styles.heroTitle}>{item.title}</Text>
                    <Text style={styles.slideDescription}>{item.description}</Text>
                </View>
            </View>
        );
    }
    if (item.type === 'signup') {
        return (
            <View style={styles.slideContainer}>
                <View style={styles.slideContent}>
                    <Text style={styles.slideTitle}>{item.title}</Text>
                    <Text style={styles.slideDescription}>{item.description}</Text>
                    <Button onPress={handleSignUp} style={{ marginTop: 24 }}>Get Started</Button>
                </View>
            </View>
        );
    }
    return (
        <View style={styles.slideContainer}>
            <View style={styles.slideContent}>
                <item.icon size={48} color={theme.colors.light.primary} />
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideDescription}>{item.description}</Text>
                <item.mockup isActive={selectedIndex === index} className={styles.mockup} />
            </View>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.logo}>Semua</Text>
        <View style={styles.headerButtons}>
          <Button variant="ghost" onPress={handleLogin}>Log In</Button>
          <Button onPress={handleSignUp}>Sign Up</Button>
        </View>
      </Animated.View>

      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={'70%'}
        data={slides}
        renderItem={renderItem}
        onProgressChange={(_, absoluteProgress) => {
            scrollX.value = absoluteProgress * width;
        }}
        onSnapToItem={(index) => setSelectedIndex(index)}
      />

      <View style={styles.dotContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              { backgroundColor: selectedIndex === index ? theme.colors.light.primary : theme.colors.light.muted },
            ]}
            onPress={() => carouselRef.current?.scrollTo({ index, animated: true })}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.light.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    width: width,
  },
  slideContent: {
    alignItems: 'center',
  },
  heroTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.light.foreground,
      textAlign: 'center',
      marginBottom: 12,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.light.foreground,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 16,
    color: theme.colors.light.mutedForeground,
    textAlign: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  mockup: {
    marginTop: 24,
    width: width * 0.8,
    height: 400,
  },
});

export default WelcomeScreen;