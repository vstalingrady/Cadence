import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import theme from '~/theme/theme';

interface TitleSlideProps {
  title: string;
  gradientTitle: string;
  description: string;
}

const TitleSlide: React.FC<TitleSlideProps> = ({ title, gradientTitle, description }) => {
  return (
    <View style={styles.textContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <MaskedView
          style={styles.maskedView}
          maskElement={<Text style={[styles.title, styles.gradientText, { backgroundColor: 'transparent' }]}>{gradientTitle}</Text>}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.title, styles.gradientText, { opacity: 0 }]}>{gradientTitle}</Text>
          </LinearGradient>
        </MaskedView>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default TitleSlide;
