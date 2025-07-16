import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '~/theme/theme';

interface GenericSlideProps {
  title: string;
  description: string;
  icon?: React.ElementType;
}

const GenericSlide: React.FC<GenericSlideProps> = ({ title, description, icon: Icon }) => {
  return (
    <View style={styles.textContainer}>
      {Icon && <Icon size={48} color={theme.colors.primary} style={styles.icon} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.foreground,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
    lineHeight: theme.lineHeights.loose,
  },
  description: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginTop: theme.spacing.medium,
  },
  icon: {
    marginBottom: theme.spacing.large,
  },
});

export default GenericSlide;
