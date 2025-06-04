# NTD - Negative Thought Destroyer

NTD (Negative Thought Destroyer) is a cross-platform mobile application built with React Native and Expo that helps users process and release negative thoughts through a symbolic burning ritual.

## Features

- Text and voice input for capturing negative thoughts
- Realistic paper burning animation that permanently erases thoughts
- Analytics dashboard tracking your progress over time
- Accessibility features including reduced motion and voice-to-text
- Local, secure storage with no cloud sync for maximum privacy

## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/ntd-app.git
```

2. Navigate to the project directory:
```
cd ntd-app
```

3. Install dependencies:
```
npm install
```

4. Start the development server:
```
npm run dev
```

## Project Structure

- `/app` - Contains all routes and screens
- `/components` - Reusable UI components
- `/context` - Application state management
- `/hooks` - Custom React hooks
- `/services` - Business logic and data handling
- `/utils` - Utility functions

## Analytics Calculation

The app tracks several analytics metrics:

- **Daily Burns**: Counts the number of negative thoughts burned each day
- **Weekly Totals**: Aggregates daily counts into weekly totals
- **Progress Calculation**: Compares the current week's total with the previous week's

### Reset Schedule

- Daily counts reset at midnight (local time)
- Weekly counts roll over at the beginning of each week (Sunday or Monday depending on locale)

All analytics data is stored locally using AsyncStorage with no cloud sync by default.

## Accessibility

The application is designed with accessibility in mind:

- High contrast text
- WCAG-compliant animations
- Reduced motion option
- Voice input with captions
- Haptic feedback

## Dependencies

- `expo` - Base framework
- `expo-router` - Navigation and routing
- `react-native-reanimated` - Advanced animations
- `expo-haptics` - Haptic feedback
- `react-native-chart-kit` - Data visualization
- `@react-native-async-storage/async-storage` - Local storage
- `expo-speech` - Text-to-speech capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.