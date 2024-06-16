// App.js
console.log("START: App.js [x4]"); // Logging the start of the App component execution

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput, Platform } from 'react-native';
import { db } from './firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import DatePicker from '@react-native-community/datetimepicker';  // Note: This is not supported on web
import Calendar from './Calendar';  // Ensure the Calendar component is properly set up

// Main App component
const App = () => {
    // State hooks for task management, modal visibility, and calendar navigation
    const [tasks, setTasks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tags, setTags] = useState('');
    const [showDatePicker, setShowDatePicker] = useState({ start: false, end: false });
    const [currentDate, setCurrentDate] = useState(new Date()); // Manage the current date for the calendar
    const [dialogflowResponse, setDialogflowResponse] = useState(''); // State for Dialogflow response
    const [userInput, setUserInput] = useState(''); // State for user input

    // Navigation functions for the calendar
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Navigate to the next month
    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Firestore reference for tasks collection
    const tasksCollectionRef = collection(db, 'tasks');

    // Fetch tasks from Firestore in real-time
    useEffect(() => {
        const unsubscribe = onSnapshot(tasksCollectionRef, (querySnapshot) => {
            const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(tasksData);
        });
        return () => unsubscribe(); // Cleanup subscription on component unmount
    }, []);

    // Debugging current date changes
    useEffect(() => {
      console.log("Calendar updated with new date:", currentDate);
    }, [currentDate]);

// Function to add a new task to Firestore
    const handleAddTask = async (taskDetails) => {
        await addDoc(tasksCollectionRef, taskDetails);
    };

    // Function to delete a task from Firestore
    const handleDeleteTask = async (id) => {
        const taskDoc = doc(db, 'tasks', id);
        await deleteDoc(taskDoc);
    };

    // Function to update an existing task in Firestore
    const handleUpdateTask = async (taskId, taskDetails) => {
        const taskDoc = doc(db, 'tasks', taskId);  
        try {
          await updateDoc(taskDoc, taskDetails);
          console.log('Task updated successfully'); // Logging success
      } catch (error) {
          console.error('Error updating task:', error); // Logging errors
      }
  };


    // Function to confirm adding a new task
    const handleConfirm = () => {
        const taskDetails = { description, startDate, endDate, tags };
        handleAddTask(taskDetails);
        setIsModalVisible(false);
    };

    // Function to handle form submission to Dialogflow
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://strong-mature-tick.ngrok-free.app/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    queryResult: {
                        queryText: userInput
                    }
                })
            });
            const data = await response.json();
            setDialogflowResponse(data.fulfillmentText);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Debug function for testing
    const debugTest = () => {
        console.log('Tasks:', tasks);
    };

    return (
        <View style={styles.appContainer}>
            <Text style={styles.appTitle}>Sync-Ur-Life</Text>
            <Calendar currentDate={currentDate} />
            <View style={styles.navigationContainer}>
                <Pressable onPress={goToPreviousMonth} style={styles.navButton}>
                    <Text>Previous Month</Text>
                </Pressable>
                <Pressable onPress={goToNextMonth} style={styles.navButton}>
                    <Text>Next Month</Text>
                </Pressable>
            </View>
            <Pressable onPress={() => setIsModalVisible(true)} style={styles.addButton}>
                <Text>Add Task</Text>
            </Pressable>
            <div className="task-items">
                {tasks.map((task) => (
                    <View key={task.id} style={styles.task}>
                        <Text>{task.description}</Text>
                        <Pressable onPress={() => handleUpdateTask(task.id, { description: "Updated description" })} style={styles.button}>
                            <Text>Edit</Text>
                        </Pressable>
                        <Pressable onPress={() => handleDeleteTask(task.id)} style={styles.button}>
                            <Text>Delete</Text>
                        </Pressable>
                    </View>
                ))}
            </div>
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setDescription}
                            value={description}
                            placeholder="Enter task description"
                        />
                        {/* Conditional rendering for Start Date Picker based on platform */}
                        {Platform.OS !== 'web' ? (
                            <DatePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker({...showDatePicker, start: false});
                                    setStartDate(selectedDate || startDate);
                                }}
                            />
                        ) : (
                            <input // Fallback for web using standard HTML input for start date
                                type="date"
                                value={startDate.toISOString().substring(0, 10)}
                                onChange={(event) => setStartDate(new Date(event.target.value))}
                            />
                        )}
                        <Pressable onPress={() => setShowDatePicker({...showDatePicker, end: true})} style={styles.button}>
                            <Text>Select End Date</Text>
                        </Pressable>
                         {/* Conditional rendering for End Date Picker based on platform */}
                         {showDatePicker.end && (
                            Platform.OS !== 'web' ? (
                                <DatePicker
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker({...showDatePicker, end: false});
                                        setEndDate(selectedDate || endDate);
                                    }}
                                />
                            ) : (
                                <input // Fallback for web using standard HTML input for end date
                                    type="date"
                                    value={endDate.toISOString().substring(0, 10)}
                                    onChange={(event) => setEndDate(new Date(event.target.value))}
                                />
                            )
                        )}
                        <TextInput
                            style={styles.input}
                            onChangeText={setTags}
                            value={tags}
                            placeholder="Enter tags, separated by commas"
                        />
                        <View style={styles.modalButtons}>
                            <Pressable onPress={() => setIsModalVisible(false)} style={styles.button}>
                                <Text>Cancel</Text>
                            </Pressable>
                            <Pressable onPress={handleConfirm} style={styles.button}>
                                <Text>OK</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <div className="va-dialog" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="freeform">Speak to your Virtual Assistance</label>
                    <br />
                    <textarea
                        className="freeform"
                        name="freeform"
                        rows="4"
                        cols="50"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    >
                    </textarea>
                    <br />
                    <br />
                    <input type="submit" value="Submit" />
                </form>
                <div className="va-dialog-output" style={{ marginTop: '20px' }}>
                    {/* This div is where the response from the AI agent will be output */}
                    <p>{dialogflowResponse}</p>
                </div>
            </div>
        </View>
    );
};

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    appTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    navButton: {
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    addButton: {
        padding: 10,
        backgroundColor: '#28a745',
        borderRadius: 5,
        marginBottom: 20,
    },
    task: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    button: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: '100%',
        marginBottom: 10,
        borderRadius: 5,
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

export default App; // Export the App component as the default

console.log("END: App.js [x4]"); // Logging the end of the App component execution
