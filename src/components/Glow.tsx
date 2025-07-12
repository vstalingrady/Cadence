import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '~/theme/theme';

const Glow = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const pulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.7,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    pulseAnimation();
  }, [scaleAnim, opacityAnim]);

  return (
    <Animated.View style={[styles.glowContainer, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
      <LinearGradient
        colors={[`${theme.colors.primary}50`, 'transparent']}
        style={styles.gradient}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glowContainer: {
    position: 'absolute',
    width: 300,
    height: 200,
    zIndex: -1,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
  },
});

export default Glow;
