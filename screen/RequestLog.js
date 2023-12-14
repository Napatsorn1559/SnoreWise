import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TextInput, Button, TouchableWithoutFeedback } from "react-native";
import waveBG from '../assets/top-bottom-bg.png';
import * as Sharing from 'expo-sharing';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function RequestLog() {
    const [date, setDate] = useState(new Date());
    const [reqRecord, setReqrecord] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate) => {
        hideDatePicker();
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

        //funtion for test recording result
        function getRecordingLines() {
            return recordings.map((recordingLine, index) => {
                return (
                    <View key={index} style={styles.row}>
                        <Text style={styles.fill}>
                            Recording #{index + 1} | {recordingLine.duration}
                        </Text>
                        <Button onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
                        <Button onPress={() => postAudio(recordingLine.file)} title="post"></Button>
                        <Button onPress={() => Sharing.shareAsync(recordingLine.file)} title="share"></Button>
                    </View>
                );
            });
        }

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground style={styles.container} source={waveBG} >
                <Text style={styles.tabHeaderText}>Request <Text style={{ color: 'yellow' }}>Log</Text></Text>
                <TextInput style={styles.inputBox} placeholder="File type (audio file for now)" placeholderTextColor="#fff" />
                <Text style={styles.Inputtext}>Start Date</Text>
                <TouchableWithoutFeedback onPress={showDatePicker}>
                    <View style={styles.datePickerStyle}>
                        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                <Text style={styles.Inputtext}>End Date</Text>
                <TouchableWithoutFeedback onPress={showDatePicker}>
                    <View style={styles.datePickerStyle}>
                        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                {/* <TextInput style={styles.inputBox} placeholder="Purpose" placeholderTextColor="#fff" /> */}
                <Button title='Submit' color='#03A9F4' onPress={() => { alert('Submitted') }} />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#231E30',
        alignItems: 'stretch',
        paddingTop: 80,
    },
    tabHeaderText: {
        fontSize: 45,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    },
    datePickerStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        height: 50,
        marginHorizontal: 20,
        borderBottomColor: 'rgba(255, 229, 0, 1)',
        borderBottomWidth: 2,
        justifyContent: 'center',
        paddingLeft: 10,
        fontSize: 18,
        marginBottom: 15
    },
    dateText: {
        fontSize: 18,
        color: 'white',
    },
    inputBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        height: 50,
        marginHorizontal: 20,
        borderBottomColor: 'rgba(255, 229, 0, 1)',
        borderBottomWidth: 2,
        paddingLeft: 10,
        fontSize: 18,
        marginBottom: 15
    },
    Inputtext: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginHorizontal: 20,
    },
});
