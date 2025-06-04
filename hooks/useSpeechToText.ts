import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Mock implementation for web since expo-speech doesn't support speech recognition
  // In a real app, you would use the Web Speech API directly for web
  const mockWebSpeechRecognition = () => {
    // Set a timeout to simulate speech recognition
    const timeout = setTimeout(() => {
      setTranscript('This is a simulated thought for web testing');
      setIsListening(false);
    }, 2000);
    
    return () => clearTimeout(timeout);
  };

  const startListening = async () => {
    setError(null);
    setTranscript('');
    setIsListening(true);
    
    try {
      if (Platform.OS === 'web') {
        // For web, we use our mock implementation
        mockWebSpeechRecognition();
      } else {
        // In a real implementation, we would use the native speech recognition APIs
        // This is a simplified mock for demo purposes
        setTimeout(() => {
          setTranscript('I will never be good enough');
          setIsListening(false);
        }, 2000);
      }
    } catch (err) {
      setError('Failed to start listening. Please try again.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      // Clean up any resources when component unmounts
      stopListening();
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  };
};