// App.js
console.log("START: App.js [x4]");
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import { db } from './firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import DatePicker from '@react-native-community/datetimepicker';
import Calendar from './Calendar';  

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tags, setTags] = useState('');
    const [showDatePicker, setShowDatePicker] = useState({ start: false, end: false });

    const tasksCollectionRef = collection(db, 'tasks');

    useEffect(() => {
        const unsubscribe = onSnapshot(tasksCollectionRef, (querySnapshot) => {
            const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(tasksData);
        });
        return () => unsubscribe();
    }, []);

    const handleAddTask = async (taskDetails) => {
        await addDoc(tasksCollectionRef, taskDetails);
    };

    const handleDeleteTask = async (id) => {
        const taskDoc = doc(db, 'tasks', id);
        await deleteDoc(taskDoc);
    };

    const handleUpdateTask = async (taskId, taskDetails) => {
        const taskDoc = doc(db, 'tasks', taskId);
        try {
            await updateDoc(taskDoc, taskDetail);
            console.log('Task updated successfully');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleConfirm = () => {
        const taskDetails = { description, startDate, endDate, tags };
        handleAddTask(taskDetails);
        setIsModalVisible(false);
    };

    return (
        <View style={styles.appContainer}>
            <Text style={styles.appTitle}>Sync-Ur-Life</Text>
            <Calendar /> 
            <Pressable onPress={() => setIsModalVisible(true)} style={styles.addButton}>
                <Text>Add Task</Text>
            </Pressable>
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
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setDescription}
                            value={description}
                            placeholder="Enter task description"
                        />
                        <Pressable onPress={() => setShowDatePicker({...showDatePicker, start: true})} style={styles.button}>
                            <Text>Select Start Date</Text>
                        </Pressable>
                        {showDatePicker.start && (
                            <DatePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker({...showDatePicker, start: false});
                                    setStartDate(selectedDate || startDate);
                                }}
                            />
                        )}
                        <Pressable onPress={() => setShowDatePicker({...showDatePicker, end: true})} style={styles.button}>
                            <Text>Select End Date</Text>
                        </Pressable>
                        {showDatePicker.end && (
                            <DatePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker({...showDatePicker, end: false});
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

export default App;

console.log("END: App.js [x4]");