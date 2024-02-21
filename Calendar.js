// Calendar.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const Calendar = ({ year, month, onDateSelect }) => {
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
    let daysArray = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(<View key={`empty-start-${i}`} style={styles.day} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(
        <Pressable key={`day-${day}`} style={styles.day} onPress={() => onDateSelect(day)}>
          <Text>{day}</Text>
        </Pressable>
      );
    }

    const totalCells = daysArray.length;
    const cellsToAdd = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < cellsToAdd; i++) {
      daysArray.push(<View key={`empty-end-${i}`} style={styles.day}><Text></Text></View>);
    }

    setCalendarDays(daysArray);
  }, [year, month]);

  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.calendarHeader}>January {year}</Text>
      <View style={styles.calendar}>{calendarDays}</View>
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
    width: '14%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
});

export default Calendar;
