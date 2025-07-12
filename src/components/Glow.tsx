import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '~/theme/theme';

const Glow = () => {
  const opacityAnim = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    const pulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.15,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    pulseAnimation();
  }, [opacityAnim]);

  return (
    <Animated.View style={[styles.glowContainer, { opacity: opacityAnim }]}>
      <LinearGradient
        colors={[`${theme.colors.primary}90`, 'transparent']}
        style={styles.gradient}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glowContainer: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    height: 300,
    zIndex: -1,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
});

export default Glow;
