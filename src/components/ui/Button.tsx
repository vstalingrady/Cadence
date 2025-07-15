
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';

const Button = ({ 
  variant = 'primary', 
  onPress, 
  children, 
  disabled = false, 
  isLoading = false,
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'ghost':
        return {
          button: styles.ghostButton,
          text: styles.ghostButtonText,
        };
      case 'primary':
      default:
        return {
          button: styles.primaryButton,
          text: styles.primaryButtonText,
        };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        variantStyle.button,
        (disabled || isLoading) && styles.disabledButton,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variantStyle.text.color} />
      ) : (
        <Text style={[styles.text, variantStyle.text, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: theme.colors.light.primary,
  },
  primaryButtonText: {
    color: theme.colors.light.primaryForeground,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostButtonText: {
    color: theme.colors.light.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Button;
