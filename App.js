// App.js
console.log("START: App.js [x4]");
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import Calendar from './Calendar';
import { db } from './firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import DatePicker from '@react-native-community/datetimepicker'; // Make sure to install this package

const InputModal = ({ visible, onClose, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tags, setTags] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);




  const handleConfirm = () => {
    onSubmit({ description, startDate, endDate, tags });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            onChangeText={setDescription}
            value={description}
            placeholder="Enter task description"
          />
          
<Pressable onPress={() => setShowStartDatePicker(true)} style={styles.button}>
            <Text>Select Start Date</Text>
          </Pressable>
          {showStartDatePicker && (
            <DatePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                setStartDate(selectedDate || startDate);
              }}
            />
          )}
          <Pressable onPress={() => setShowEndDatePicker(true)} style={styles.button}>
            <Text>Select End Date</Text>
          </Pressable>
          {showEndDatePicker && (
            <DatePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                setEndDate(selectedDate || endDate);
              }}
            />
          )}
          <TextInput
            style={styles.input}
            onChangeText={setTags}
            value={tags}
            placeholder="Enter tags, separated by commas"
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

const TaskManager = ({ tasks, onDelete, onUpdate }) => {
  return (
    <View style={styles.taskManagerContainer}>
      <Text style={styles.title}>Tasks</Text>
      {tasks.map((task, index) => (
        <View key={task.id} style={styles.task}>
          <Text>{task.description}</Text>
          <Pressable onPress={() => onUpdate(task.id, task.description)} style={styles.button}><Text>Edit</Text></Pressable>
          <Pressable onPress={() => onDelete(task.id)} style={styles.button}><Text>Delete</Text></Pressable>
        </View>
      ))}
    </View>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tasksCollectionRef = collection(db, 'tasks');

  useEffect(() => {
    const unsubscribe = onSnapshot(tasksCollectionRef, (querySnapshot) => {
      const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async ({ description, startDate, endDate, tags }) => {
    await addDoc(tasksCollectionRef, { description, startDate, endDate, tags });
  };


  const handleDeleteTask = async (id) => {
    const taskDoc = doc(db, 'tasks', id);
    await deleteDoc(taskDoc);
  };

  handleUpdateTask(taskId, {
    description: "New description",
    startDate: newStartDate,
    endDate: newEndDate,
    tags: newTags
  });

  return (
    <View style={styles.appContainer}>
      <Text style={styles.appTitle}>Sync-Ur-Life</Text>
      <Calendar year={2024} month={1} />
      <TaskManager tasks={tasks} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
      <Pressable onPress={() => setIsModalVisible(true)} style={styles.addButton}><Text>Add Task</Text></Pressable>
      <InputModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={(inputValue) => {
          handleAddTask(inputValue);
          setIsModalVisible(false);
        }}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
});

export default App;

console.log("END: App.js [x4]");