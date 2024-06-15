// REPO: synch-ur-life
// App.js
console.log("START: App.js [x4]"); // Logging the start of the App component execution
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput, Platform } from 'react-native';
import { db } from './firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import DatePicker from '@react-native-community/datetimepicker'; // Note: This is not supported on web
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
    const [currentDate, setCurrentDate] = useState(new Date());  // Manage the current date for the calendar

    // Navigate to the previous month
    const goToPreviousMonth = () => {
        console.log("Going to previous month from", currentDate);
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Navigate to the next month
    const goToNextMonth = () => {
        console.log("Going to next month from", currentDate);
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Reference to Firestore collection
    const tasksCollectionRef = collection(db, 'tasks');

    // Effect hook to listen to Firestore updates
    useEffect(() => {
        const unsubscribe = onSnapshot(tasksCollectionRef, (querySnapshot) => {
            const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(tasksData);
        });
        return () => unsubscribe();  // Cleanup subscription on component unmount
    }, []);

    // Debugging current date changes
    useEffect(() => {
        console.log("Calendar updated with new date:", currentDate);
    }, [currentDate]);

    // Function to handle adding a new task
    const handleAddTask = async (taskDetails) => {
        await addDoc(tasksCollectionRef, taskDetails);
    };

    // Function to handle deleting a task
    const handleDeleteTask = async (id) => {
        const taskDoc = doc(db, 'tasks', id);
        await deleteDoc(taskDoc);
    };

    // Function to handle updating a task
    const handleUpdateTask = async (taskId, taskDetails) => {
        const taskDoc = doc(db, 'tasks', taskId);
        try {
            await updateDoc(taskDoc, taskDetails);
            console.log('Task updated successfully'); // Logging success
        } catch (error) {
            console.error('Error updating task:', error); // Logging errors
        }
    };

    // Function to confirm and handle modal submission
    const handleConfirm = () => {
        const taskDetails = { description, startDate, endDate, tags };
        handleAddTask(taskDetails);
        setIsModalVisible(false);
    };

    // Main component rendering
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
                <form>
                    <label htmlFor="freeform">Speak to your Virtual Assistance</label>
                    <br />
                    <textarea id="freeform" name="freeform" rows="4" cols="50">
                        Enter text here...
                    </textarea>
                    <br />
                    <br />
                    <input type="submit" value="Submit" />
                </form>
                <div className='va-dialog-output'>
                </div>
            </div>
        </View>
    );
};

// Styles for the components
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
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    navButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    task: {
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderRadius: 5,
    },
    button: {
        marginLeft: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
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

export default App; // Export the App component as the default

console.log("END: App.js [x4]"); // Logging the end of the App component execution
