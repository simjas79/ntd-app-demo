import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDayKey, getWeekKey } from '@/utils/dateUtils';

// Interface for daily data
interface DailyData {
  date: string; // Format: YYYY-MM-DD
  count: number;
}

// Interface for weekly data
interface WeeklyData {
  week: string; // Format: YYYY-WW (year-week number)
  count: number;
}

// Interface for analytics data
interface AnalyticsData {
  daily: DailyData[];
  weekly: WeeklyData[];
}

// Initialize analytics data
const initializeAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    const storedData = await AsyncStorage.getItem('ntd_analytics');
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // If no data exists, create initial structure
    const initialData: AnalyticsData = {
      daily: [],
      weekly: []
    };
    
    await AsyncStorage.setItem('ntd_analytics', JSON.stringify(initialData));
    return initialData;
  } catch (error) {
    console.error('Error initializing analytics data:', error);
    return { daily: [], weekly: [] };
  }
};

// Record a thought burn
export const recordThought = async (): Promise<void> => {
  try {
    // Get current data
    const data = await initializeAnalyticsData();
    
    // Get today's key
    const todayKey = getDayKey();
    
    // Get this week's key
    const weekKey = getWeekKey();
    
    // Update daily count
    const todayIndex = data.daily.findIndex(day => day.date === todayKey);
    if (todayIndex >= 0) {
      data.daily[todayIndex].count += 1;
    } else {
      data.daily.push({ date: todayKey, count: 1 });
    }
    
    // Update weekly count
    const weekIndex = data.weekly.findIndex(week => week.week === weekKey);
    if (weekIndex >= 0) {
      data.weekly[weekIndex].count += 1;
    } else {
      data.weekly.push({ week: weekKey, count: 1 });
    }
    
    // Save updated data
    await AsyncStorage.setItem('ntd_analytics', JSON.stringify(data));
  } catch (error) {
    console.error('Error recording thought:', error);
  }
};

// Get today's burn count
export const getTodayCount = async (): Promise<number> => {
  try {
    const data = await initializeAnalyticsData();
    const todayKey = getDayKey();
    
    const todayData = data.daily.find(day => day.date === todayKey);
    return todayData ? todayData.count : 0;
  } catch (error) {
    console.error('Error getting today count:', error);
    return 0;
  }
};

// Get analytics data
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    return await initializeAnalyticsData();
  } catch (error) {
    console.error('Error getting analytics data:', error);
    return { daily: [], weekly: [] };
  }
};

// Get weekly progress comparison
export const getWeeklyProgress = async (): Promise<{ currentWeek: number; previousWeek: number }> => {
  try {
    const data = await initializeAnalyticsData();
    
    // Current week
    const currentWeekKey = getWeekKey();
    const currentWeekData = data.weekly.find(week => week.week === currentWeekKey);
    const currentWeekCount = currentWeekData ? currentWeekData.count : 0;
    
    // Previous week
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 7);
    const prevWeekKey = getWeekKey(prevDate);
    const prevWeekData = data.weekly.find(week => week.week === prevWeekKey);
    const prevWeekCount = prevWeekData ? prevWeekData.count : 0;
    
    return {
      currentWeek: currentWeekCount,
      previousWeek: prevWeekCount
    };
  } catch (error) {
    console.error('Error getting weekly progress:', error);
    return { currentWeek: 0, previousWeek: 0 };
  }
};