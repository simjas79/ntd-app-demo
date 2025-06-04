import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the theme structure
type ThemeColors = {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  borderDark: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  white: string;
};

type Theme = {
  dark: boolean;
  colors: ThemeColors;
};

// Theme contexts
type ThemeContextType = {
  theme: Theme;
  reduceMotion: boolean;
  soundEnabled: boolean;
  toggleReduceMotion: () => void;
  toggleSound: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: {
    dark: true,
    colors: {
      background: '#121E3D', // Deep blue
      card: '#1C2D59',
      text: '#F8F9FA',
      textSecondary: '#ADB5BD',
      border: '#334975',
      borderDark: '#0D1525',
      primary: '#FF7D3D', // Warm orange
      secondary: '#FFC43D',
      accent: '#FF4D4D', // Flame red
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#F44336',
      white: '#FFFFFF',
    },
  },
  reduceMotion: false,
  soundEnabled: true,
  toggleReduceMotion: () => {},
  toggleSound: () => {},
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // The app primarily uses a dark theme for the burning effect
  const theme: Theme = {
    dark: true,
    colors: {
      background: '#121E3D', // Deep blue
      card: '#1C2D59',
      text: '#F8F9FA',
      textSecondary: '#ADB5BD',
      border: '#334975',
      borderDark: '#0D1525',
      primary: '#FF7D3D', // Warm orange
      secondary: '#FFC43D',
      accent: '#FF4D4D', // Flame red
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#F44336',
      white: '#FFFFFF',
    },
  };

  // Load settings from storage on initial render
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedReduceMotion = await AsyncStorage.getItem('reduceMotion');
        const storedSoundEnabled = await AsyncStorage.getItem('soundEnabled');
        
        if (storedReduceMotion !== null) {
          setReduceMotion(storedReduceMotion === 'true');
        }
        
        if (storedSoundEnabled !== null) {
          setSoundEnabled(storedSoundEnabled === 'true');
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Toggle reduced motion setting
  const toggleReduceMotion = async () => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    try {
      await AsyncStorage.setItem('reduceMotion', String(newValue));
    } catch (error) {
      console.error('Failed to save reduced motion setting:', error);
    }
  };

  // Toggle sound setting
  const toggleSound = async () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    try {
      await AsyncStorage.setItem('soundEnabled', String(newValue));
    } catch (error) {
      console.error('Failed to save sound setting:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, reduceMotion, soundEnabled, toggleReduceMotion, toggleSound }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);