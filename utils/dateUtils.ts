// Get the day key in format YYYY-MM-DD
export const getDayKey = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

// Get the week key in format YYYY-WW
export const getWeekKey = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  
  // Create a new date object for Jan 1 of the current year
  const firstDayOfYear = new Date(year, 0, 1);
  
  // Calculate the difference in days between the given date and Jan 1
  const daysSinceFirstDay = Math.floor(
    (date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  
  // Calculate the week number (add 1 because weeks start from 1)
  const weekNumber = Math.ceil((daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7);
  
  // Format with leading zero for week numbers less than 10
  const formattedWeekNumber = weekNumber < 10 ? `0${weekNumber}` : `${weekNumber}`;
  
  return `${year}-${formattedWeekNumber}`;
};

// Format date to display in different formats
export const formatDate = (date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  if (format === 'short') {
    // E.g., "Mon"
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else if (format === 'medium') {
    // E.g., "Jun 15"
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else {
    // E.g., "June 15, 2023"
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
};

// Get a human-readable label for a week relative to the current week
export const getWeekLabel = (weekOffset: number): string => {
  if (weekOffset === 0) {
    return 'This Week';
  } else if (weekOffset === -1) {
    return 'Last Week';
  } else if (weekOffset === -2) {
    return '2 Weeks Ago';
  } else {
    const date = new Date();
    date.setDate(date.getDate() + weekOffset * 7);
    return formatDate(date, 'medium');
  }
};