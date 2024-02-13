import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';

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

    // Add empty cells at the end to make up 7 cells per row
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

const TaskManager = ({ tasks }) => {
  return (
    <View style={styles.taskManagerContainer}>
      <Text style={styles.title}>Tasks</Text>
      {tasks.map((task, index) => (
        <Text key={index} style={styles.task}>{task.note}</Text>
      ))}
    </View>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);

  // Defined year and month here for clarity
  const year = 2024;
  const month = 1;

  const handleDateSelect = (day) => {
    Alert.prompt(
      'Add Note',
      `Enter a note for ${day}/${month}/${year}:`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (note) => {
            const newTask = { day, month, year, note }; // Including month and year in the task object
            setTasks([...tasks, newTask]);
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <View style={styles.appContainer}>
      <Text style={styles.appTitle}>Sync-Ur-Life</Text>
      <Calendar year={year} month={month} onDateSelect={handleDateSelect} />
      <TaskManager tasks={tasks} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Combine and adjust your styles here...
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
    width: '14%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  taskManagerContainer: {
    marginTop: 20,
    // Other styles for the task manager container...
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  task: {
    // Styles for individual tasks...
  },
  // Add any additional styles you need here...
});

export default App;
