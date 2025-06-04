import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type BurnAnimationProps = {
  text: string;
  reduceMotion: boolean;
};

const BurnAnimation: React.FC<BurnAnimationProps> = ({ text, reduceMotion }) => {
  const { theme } = useTheme();
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const animatedHeight = useRef(new Animated.Value(200)).current;
  const animatedTranslateY = useRef(new Animated.Value(0)).current;
  const animatedRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Play animation
    if (reduceMotion) {
      // Simple fade out for reduced motion
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      // Start burning animation sequence
      Animated.sequence([
        // First shrink height slightly
        Animated.timing(animatedHeight, {
          toValue: 180,
          duration: 300,
          useNativeDriver: false,
        }),
        // Then start moving up and rotating while fading
        Animated.parallel([
          Animated.timing(animatedTranslateY, {
            toValue: -100,
            duration: 1700,
            useNativeDriver: true,
          }),
          Animated.timing(animatedRotate, {
            toValue: 1,
            duration: 1700,
            useNativeDriver: true,
          }),
          Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: 1700,
            useNativeDriver: true,
          }),
        ])
      ]).start();
    }
  }, [reduceMotion]);

  // Calculate animated rotation
  const rotate = animatedRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-1deg', '10deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.white,
          height: animatedHeight,
          opacity: animatedOpacity,
          transform: [
            { translateY: animatedTranslateY },
            { rotate: rotate }
          ],
        }
      ]}
    >
      <View style={styles.noteInner}>
        <Text style={[styles.text, { color: '#333333', fontFamily: 'Inter-Regular' }]}>
          {text}
        </Text>
      </View>
      
      {!reduceMotion && (
        <View style={styles.burnEffect}>
          <View style={[styles.fire, styles.fireBottom]} />
          <View style={[styles.fire, styles.fireMiddle]} />
          <View style={[styles.fire, styles.fireTop]} />
          <View style={styles.embers}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={[styles.ember, { left: 20 + i * 50 }]} />
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    overflow: 'hidden',
  },
  noteInner: {
    padding: 24,
    minHeight: 200,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  burnEffect: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  fire: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  fireBottom: {
    backgroundColor: '#FF4500',
    height: 20,
  },
  fireMiddle: {
    backgroundColor: '#FF7F00',
    height: 30,
    bottom: 10,
  },
  fireTop: {
    backgroundColor: '#FFDD00',
    height: 20,
    bottom: 25,
  },
  embers: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 10,
  },
  ember: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFF00',
    bottom: 0,
  },
});

export default BurnAnimation;