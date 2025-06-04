import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/context/ThemeContext';
import { getAnalyticsData, getTodayCount, getWeeklyProgress } from '@/services/analyticsService';
import { formatDate, getWeekLabel } from '@/utils/dateUtils';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const [todayCount, setTodayCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [monthlyData, setMonthlyData] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [progressMessage, setProgressMessage] = useState('');
  const screenWidth = Dimensions.get('window').width - 40;

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    // Get today's count
    const today = await getTodayCount();
    setTodayCount(today);

    // Get analytics data
    const data = await getAnalyticsData();
    
    // Process data for weekly chart (last 7 days)
    const weekData = data.daily.slice(-7).map(day => day.count);
    setWeeklyData(weekData);

    // Process data for monthly chart (last 8 weeks)
    const monthData = data.weekly.slice(-8).map(week => week.count);
    setMonthlyData(monthData);

    // Calculate progress message
    const progress = await getWeeklyProgress();
    if (progress.currentWeek < progress.previousWeek) {
      const percentDecrease = Math.round(
        ((progress.previousWeek - progress.currentWeek) / progress.previousWeek) * 100
      );
      setProgressMessage(
        `Great progress! Your negative thoughts are down ${percentDecrease}% from last week.`
      );
    } else if (progress.currentWeek > 0) {
      setProgressMessage(
        "Keep going! Remember that identifying negative thoughts is the first step to overcoming them."
      );
    } else {
      setProgressMessage("Welcome to your journey of mental wellness.");
    }
  };

  // Generate labels for the weekly chart
  const weeklyLabels = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    return formatDate(date, 'short');
  });

  // Generate labels for the monthly chart
  const monthlyLabels = [...Array(8)].map((_, i) => {
    return getWeekLabel(i - 7);
  });

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    color: (opacity = 1) => `rgba(255, 140, 66, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    decimalPlaces: 0,
    labelColor: () => theme.colors.text,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: 'Inter-Bold' }]}>
          Your Progress
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: 'Inter-Medium' }]}>
            Today's Burns
          </Text>
          <Text style={[styles.countText, { color: theme.colors.primary, fontFamily: 'Inter-Bold' }]}>
            {todayCount}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: 'Inter-Medium' }]}>
            Daily Activity (Last 7 Days)
          </Text>
          {weeklyData.some(count => count > 0) ? (
            <BarChart
              data={{
                labels: weeklyLabels,
                datasets: [
                  {
                    data: weeklyData,
                  },
                ],
              }}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero
              showValuesOnTopOfBars
            />
          ) : (
            <Text style={[styles.noDataText, { color: theme.colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
              No data available yet. Start burning negative thoughts!
            </Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: 'Inter-Medium' }]}>
            Weekly Totals (Last 8 Weeks)
          </Text>
          {monthlyData.some(count => count > 0) ? (
            <LineChart
              data={{
                labels: monthlyLabels,
                datasets: [
                  {
                    data: monthlyData,
                  },
                ],
              }}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              fromZero
            />
          ) : (
            <Text style={[styles.noDataText, { color: theme.colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
              No weekly data available yet.
            </Text>
          )}
        </View>

        <View style={[styles.messageCard, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.messageText, { color: theme.colors.white, fontFamily: 'Inter-Medium' }]}>
            {progressMessage}
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 30,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  countText: {
    fontSize: 48,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    padding: 30,
    fontSize: 16,
  },
  messageCard: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});