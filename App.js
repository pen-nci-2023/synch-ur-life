import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import Calendar from './Calendar'; // Import Calendar component
import firebase from 'firebase/app'; // Import Firebase core
import 'firebase/firestore'; // Import Firestore service

// Import the Firebase configuration from a separate file
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); // Initialize Firebase with your config
} else {
  firebase.app(); // Use the already initialized Firebase app
}

// Input modal component for adding tasks
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

// Task manager component to display tasks
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

// Main app component
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const year = 2024;
  const month = 1;

  useEffect(() => {
    // Firestore query to listen to 'YourCollection' collection
    const subscriber = firebase.firestore()
      .collection('YourCollection') // Replace 'YourCollection' with your actual collection name
      .onSnapshot(querySnapshot => {
        const documents = [];

        // Iterate through each document and push to the documents array
        querySnapshot.forEach(documentSnapshot => {
          documents.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        console.log(documents); // Log fetched documents to console
      });

    // Clean up the listener when the component unmounts
    return () => subscriber();
  }, []);

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
  // Add other styles as needed...
});

export default App;
