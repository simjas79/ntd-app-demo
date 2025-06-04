import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Flame } from 'lucide-react-native';

type BurnButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

const BurnButton: React.FC<BurnButtonProps> = ({ onPress, disabled = false }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: disabled ? theme.colors.textSecondary : theme.colors.accent,
          shadowColor: disabled ? 'transparent' : theme.colors.accent,
        }
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Flame size={24} color={theme.colors.white} />
      <Text style={[styles.buttonText, { color: theme.colors.white, fontFamily: 'Inter-Bold' }]}>
        BURN
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      }
    }),
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 10,
    letterSpacing: 1,
  },
});

export default BurnButton;