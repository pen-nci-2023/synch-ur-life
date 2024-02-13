import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput, Button } from 'react-native';

const InputModal = ({ visible, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    onSubmit(inputValue);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="Enter your note here"
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="OK" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDateSelect = (day) => {
    setSelectedDay(day);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalSubmit = (note) => {
    const newTask = { day: selectedDay, month, year, note };
    setTasks([...tasks, newTask]);
  };

  return (
    <View style={styles.appContainer}>
      <Text style={styles.appTitle}>Sync-Ur-Life</Text>
      <Calendar year={2024} month={1} onDateSelect={handleDateSelect} />
      <TaskManager tasks={tasks} />
      <InputModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
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
    width: '14%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  taskManagerContainer: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  task: {
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default App;
