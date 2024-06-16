// REPO: synch-ur-life
// Calendar.js

import { getCurrentDateTime} from './Utilities';

console.log("START: Calendar.js [x1] ", getCurrentDateTime()) ;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const Calendar = ({ currentDate, onDateSelect }) => {
  const [calendarDays, setCalendarDays] = useState([]);
  
  // Extract year and month from currentDate
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;  // +1 because JavaScript months are 0-indexed

  // Calculate days for the calendar
  useEffect(() => {
    console.log("Updating calendar for:", year, month);
    
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
    let daysArray = [];

    // Pad start days of the week
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(<View key={`empty-start-${i}`} style={styles.day} />);
    }

    // Create day components
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(
        <Pressable key={`day-${day}`} style={styles.day} onPress={() => onDateSelect(year, month - 1, day)}>
          <Text>{day}</Text>
        </Pressable>
      );
    }

    // Pad empty end days to complete the week
    const totalCells = daysArray.length;
    const cellsToAdd = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < cellsToAdd; i++) {
      daysArray.push(<View key={`empty-end-${i}`} style={styles.day} />);
    }

    setCalendarDays(daysArray);
  }, [year, month]);  // Dependency on year and month derived from currentDate

  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.calendarHeader}>{month}/{year}</Text>
      <View style={styles.dayLabels}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
          <Text key={index} style={styles.dayLabel}>{dayName}</Text>
        ))}
      </View>
      <View style={styles.calendar}>
        {calendarDays}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    margin: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  calendarHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dayLabel: {
    width: '14%',
    textAlign: 'center',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  day: {
    width: '14%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
});

export default Calendar;

console.log("END: Calendar.js [x2]") ;
