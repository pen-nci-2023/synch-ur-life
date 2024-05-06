// Calendar.js

console.log("START: Calendar.js [x1]") ;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const Calendar = ({ onDateSelect }) => {
  const [calendarDays, setCalendarDays] = useState([]);

  // dynamically fetch current year
  const [year, setYear] = useState(new Date().getFullYear()); 

  //dynamically fetch current month (adding 1 as JavaScript months are 0-indexed)
  const [month, setMonth] = useState(new Date().getMonth() + 1); 

  // map month number to month names
  const monthNames = [ 
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // show days of the week
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


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
      <Text style={styles.calendarHeader}>{monthNames[month - 1]} {year}</Text> 
      <View style={styles.dayLabels}> 
        {dayNames.map((name, idx) => (
          <Text key={`day-label-${idx}`} style={styles.dayLabel}>{name}</Text> // New Text to display each day name
        ))}
      </View>
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

  dayLabels: { // New style added for day labels row
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dayLabel: { // New style added for individual day labels
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
