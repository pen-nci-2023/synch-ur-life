// App.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Calendar = ({ year, month }) => {
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    console.log("START: CreateCalendar");

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
    const daysArray = [];

    // Add empty cells at the start if the first day of the month is not Sunday
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(<View key={`empty-${i}`} style={styles.day}><Text></Text></View>);
    }

    // Create a cell for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(<View key={`day-${day}`} style={styles.day}><Text>{day}</Text></View>);
    }
    
    // Add empty cells at the end to make up 7 cells per row
    const totalCells = daysArray.length; // Total cells including days and starting empty cells
    const cellsToAdd = (7 - (totalCells % 7)) % 7; // Calculate how many empty cells to add at the end
    for (let i = 0; i < cellsToAdd; i++) {
      daysArray.push(<View key={`empty-end-${i}`} style={styles.day}><Text></Text></View>); // Added empty cells at the end
    }


    setCalendarDays(daysArray);
    console.log("END: CreateCalendar");
  }, [year, month]);

  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.calendarHeader}>January 2024</Text>
      <View style={styles.calendar}>
        {calendarDays}
      </View>
    </View>
  );
};

const App = () => {
  return (
    <View style={styles.appContainer}>
      <Text style={styles.appTitle}>Sync-Ur-Life</Text>
      <Calendar year={2024} month={1} />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendarContainer: {
    margin: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  calendarHeader: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  day: {
    width: '14%', // 100 / 7 days in a week
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
});

export default App;
