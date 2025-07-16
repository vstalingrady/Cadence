import React from 'react';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import theme from '~/theme/theme';
import { StyleSheet } from 'react-native';

interface DotProps {
  scrollX: Animated.SharedValue<number>;
  index: number;
  width: number;
}

const Dot: React.FC<DotProps> = ({ scrollX, index, width }) => {
  const dotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.3, 1, 0.3],
      'clamp'
    );
    const dotWidth = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [8, 16, 8],
      'clamp'
    );
    return {
      opacity,
      width: dotWidth,
    };
  });

  return <Animated.View style={[styles.dot, dotStyle]} />;
};

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 4,
  },
});

export default Dot;
