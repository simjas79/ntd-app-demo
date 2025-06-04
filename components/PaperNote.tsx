import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type PaperNoteProps = {
  text: string;
};

const PaperNote: React.FC<PaperNoteProps> = ({ text }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.white }]}>
      <View style={styles.noteInner}>
        <Text style={[styles.text, { color: '#333333', fontFamily: 'Inter-Regular' }]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    minHeight: 200,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    transform: [{ rotate: '-1deg' }],
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
});

export default PaperNote;