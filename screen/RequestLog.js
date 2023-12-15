import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import waveBG from '../assets/top-bottom-bg.png';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRecoilValue } from 'recoil';
import { currentUserId } from "../RecoilState";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Audio } from "expo-av";
import { requestAudioUri } from "../Api"

export default function RequestLog() {
    const uid = useRecoilValue(currentUserId);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
    //   const [sound, setSound] = useState();
    const [uriList, setUriList] = useState([]);
    //   const [audioComponent, setAudioComponent] = useState();


    let today = new Date();

    function requestAudioList() {
        console.log('-->', uriList);
        if (uriList.length === 0) {
            return (
                <View style={{paddingVertical: 10, paddingHorizontal: 25,flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{ color: 'white' }}>No data</Text>
                </View>
            )
        } else {
            console.log('else');
            let audioUri = uriList.uri;
            let audioName = `00-00-0000 Record`
            console.log(audioUri);

            try {
                return (
                    <View style={{paddingVertical: 10, paddingHorizontal: 25,flexDirection: 'row', justifyContent: 'space-between'}}>
                        {/* <Text style={{ color: 'white' }}>{audioUri}</Text> */}
                        <Text style={{ color: 'white' }}>{audioName}</Text>
                        <TouchableOpacity onPress={() => downloadFile(audioUri, audioName)}>
                            <Text style={{ color: 'yellow' }}>Download</Text>
                        </TouchableOpacity>
                    </View>
                )
            } catch (error) {
                console.log(error);
            }

        }
    }

    const downloadFile = async (s3Url, audioName) => {

        const localFileUri = `${FileSystem.documentDirectory}${audioName}.wav`;
        try {
          const { uri } = await FileSystem.downloadAsync(s3Url, localFileUri);
          await Sharing.shareAsync(uri);
        } catch (error) {
          console.error('Error downloading file:', error.message);
        }
      };
    

    const handleSubmit = async () => {
        console.log("Submitting");
        // setUriList([]);
        try {
            const uri = await requestAudioUri(uid, startDate);
            await setUriList(uri)
            console.log('uriList : ', uriList);
        } catch (error) {
            console.error("handleSubmit error: ", error);
        }
    };

    const showStartDatePicker = () => {
        setStartDatePickerVisibility(true);
    };

    const hideStartDatePicker = () => {
        setStartDatePickerVisibility(false);
    };

    const handleStartDateConfirm = (selectedDate) => {
        hideStartDatePicker();
        if (selectedDate && selectedDate <= today) {
            setStartDate(selectedDate);
        } else {
            alert("Invalid date! Please select a valid date.");
        }
    };

    const showEndDatePicker = () => {
        setEndDatePickerVisibility(true);
    };

    const hideEndDatePicker = () => {
        setEndDatePickerVisibility(false);
    };

    const handleEndDateConfirm = (selectedDate) => {
        hideEndDatePicker();
        if (selectedDate && selectedDate >= startDate && selectedDate <= today) {
            setEndDate(selectedDate);
        } else {
            setEndDate(new Date());
            alert("Invalid date! Please select a valid date.");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground style={styles.container} source={waveBG}>
                <Text style={styles.tabHeaderText}>Request <Text style={{ color: 'yellow' }}>Sound</Text></Text>

                <Text style={styles.Inputtext}>Start Date</Text>
                <TouchableOpacity onPress={showStartDatePicker}>
                    <View style={styles.datePickerStyle}>
                        <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
                    </View>
                </TouchableOpacity>
                <DateTimePickerModal
                    themeVariant="light"
                    isVisible={isStartDatePickerVisible}
                    mode="date"
                    onConfirm={handleStartDateConfirm}
                    onCancel={hideStartDatePicker}
                />

                <Text style={styles.Inputtext}>End Date</Text>
                <TouchableOpacity onPress={showEndDatePicker}>
                    <View style={styles.datePickerStyle}>
                        <Text style={styles.dateText}>{endDate.toLocaleDateString()}</Text>
                    </View>
                </TouchableOpacity>
                <DateTimePickerModal
                    themeVariant="light"
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    onConfirm={handleEndDateConfirm}
                    onCancel={hideEndDatePicker}
                />

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <Text >Submit</Text>
                </TouchableOpacity>
                {requestAudioList()}
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
    submitBtn: {
        backgroundColor: 'yellow',
        color: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0,
        alignSelf: 'center',
        padding: 10
    },
    Inputtext: {
        color: 'white',
        fontWeight: 'bold',
        paddingLeft: 23
    }
});
