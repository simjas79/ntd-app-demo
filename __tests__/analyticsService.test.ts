import AsyncStorage from '@react-native-async-storage/async-storage';
import { recordThought, getTodayCount, getWeeklyProgress } from '@/services/analyticsService';
import { getDayKey, getWeekKey } from '@/utils/dateUtils';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock date utils
jest.mock('@/utils/dateUtils', () => ({
  getDayKey: jest.fn(() => '2023-06-15'),
  getWeekKey: jest.fn(() => '2023-24'),
}));

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should record a thought burn correctly', async () => {
    // Mock initial empty data
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({
      daily: [],
      weekly: []
    }));

    await recordThought();

    // Check that the data was saved correctly
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'ntd_analytics',
      JSON.stringify({
        daily: [{ date: '2023-06-15', count: 1 }],
        weekly: [{ week: '2023-24', count: 1 }]
      })
    );
  });

  it('should increment existing counts when recording a thought', async () => {
    // Mock data with existing counts
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({
      daily: [{ date: '2023-06-15', count: 3 }],
      weekly: [{ week: '2023-24', count: 10 }]
    }));

    await recordThought();

    // Check that the counts were incremented
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'ntd_analytics',
      JSON.stringify({
        daily: [{ date: '2023-06-15', count: 4 }],
        weekly: [{ week: '2023-24', count: 11 }]
      })
    );
  });

  it('should return the correct today count', async () => {
    // Mock data with today's count
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({
      daily: [{ date: '2023-06-15', count: 5 }],
      weekly: [{ week: '2023-24', count: 15 }]
    }));

    const count = await getTodayCount();

    // Check that the correct count was returned
    expect(count).toBe(5);
  });

  it('should return 0 for today count if no data exists', async () => {
    // Mock empty data
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({
      daily: [],
      weekly: []
    }));

    const count = await getTodayCount();

    // Check that 0 was returned
    expect(count).toBe(0);
  });

  it('should calculate weekly progress correctly', async () => {
    // Current week: '2023-24', Previous week would be '2023-23'
    // Mock getWeekKey for previous week
    (getWeekKey as jest.Mock).mockImplementation((date) => {
      if (date) return '2023-23';
      return '2023-24';
    });

    // Mock data with current and previous week
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({
      daily: [],
      weekly: [
        { week: '2023-23', count: 20 },
        { week: '2023-24', count: 15 }
      ]
    }));

    const progress = await getWeeklyProgress();

    // Check that the progress calculation is correct
    expect(progress).toEqual({
      currentWeek: 15,
      previousWeek: 20
    });
  });
});