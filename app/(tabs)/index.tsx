import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import PaperNote from '@/components/PaperNote';
import BurnButton from '@/components/BurnButton';
import BurnAnimation from '@/components/BurnAnimation';
import { recordThought } from '@/services/analyticsService';
import { useSpeechToText } from '@/hooks/useSpeechToText';

export default function HomeScreen() {
  const { theme, reduceMotion } = useTheme();
  const [thought, setThought] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const burnOpacity = useRef(new Animated.Value(1)).current;
  const { isListening, startListening, stopListening, transcript, error } = useSpeechToText();

  const handleBurn = () => {
    if (!thought.trim()) return;
    
    // Trigger haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsBurning(true);
    
    // Record the thought burn for analytics
    recordThought();
    
    // If reduced motion is enabled, simply fade out
    if (reduceMotion) {
      Animated.timing(burnOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setThought('');
        setIsBurning(false);
        burnOpacity.setValue(1);
      });
    } else {
      // Full animation will be handled by BurnAnimation component
      // Reset after animation completes
      setTimeout(() => {
        setThought('');
        setIsBurning(false);
      }, 2000);
    }
  };

  const handleMicPress = () => {
    if (Platform.OS !== 'web') {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    } else {
      // Web fallback message
      alert('Voice input is not available on web. Please type your thought instead.');
    }
  };

  // Update thought when speech recognition results come in
  React.useEffect(() => {
    if (transcript) {
      setThought(transcript);
    }
  }, [transcript]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: 'Inter-Bold' }]}>
          Negative Thought Destroyer
        </Text>
      </View>

      <View style={styles.contentContainer}>
        {thought && !isBurning ? (
          <Animated.View style={{ opacity: burnOpacity }}>
            <PaperNote text={thought} />
          </Animated.View>
        ) : isBurning ? (
          <BurnAnimation text={thought} reduceMotion={reduceMotion} />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
              Enter a negative thought to burn
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
              fontFamily: 'Inter-Regular',
            }
          ]}
          placeholder="Type your thought..."
          placeholderTextColor={theme.colors.textSecondary}
          value={thought}
          onChangeText={setThought}
          editable={!isBurning}
        />
        
        <TouchableOpacity
          style={[
            styles.micButton,
            { backgroundColor: isListening ? theme.colors.primary : theme.colors.card }
          ]}
          onPress={handleMicPress}
          disabled={isBurning}
        >
          <Mic size={20} color={isListening ? theme.colors.white : theme.colors.text} />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error, fontFamily: 'Inter-Regular' }]}>
          {error}
        </Text>
      ) : null}

      {isListening && (
        <Text style={[styles.captionText, { color: theme.colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
          Listening...
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <BurnButton onPress={handleBurn} disabled={!thought.trim() || isBurning} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    fontSize: 16,
  },
  micButton: {
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  errorText: {
    marginBottom: 10,
    textAlign: 'center',
  },
  captionText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});