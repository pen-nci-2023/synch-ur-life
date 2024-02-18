import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import Calendar from './Calendar';

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
            <Pressable onPress={onClose} style={styles.button}><Text>Cancel</Text></Pressable>
            <Pressable onPress={handleConfirm} style={styles.button}><Text>OK</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
  const year = 2024;
  const month = 1;

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
    setIsModalVisible(false);
  };

  return (
    <View style={styles.appContainer}>
      <Text style={styles.appTitle}>Sync-Ur-Life</Text>
      <Calendar year={year} month={month} onDateSelect={handleDateSelect} />
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
