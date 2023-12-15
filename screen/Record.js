import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
//import audio for record function
import { Audio } from 'expo-av';
import {
    AndroidAudioEncoder,
    AndroidOutputFormat,
    IOSAudioQuality,
    IOSOutputFormat,
    Recording,
} from 'expo-av/build/Audio';

import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
//import axios for post api 
import axios from 'axios';
//import background image
import bg from '../assets/top-bottom-bg.png';
import waveLine from '../assets/horizontalWaveLine.png'
//import recoil state
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentDate, currentUserId } from '../RecoilState';

export default function App() {
    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);
    const [startRecord, setStartRecord] = React.useState();
    const [postedAudioFiles, setPostedAudioFiles] = React.useState([]);
    const userId = useRecoilValue(currentUserId);

    //effect for getting a latest record when recordings changed
    useEffect(() => {
        if (recordings.length > 0) {
            getLatestRec();
        }
    }, [recordings]);

    //effect for stop and play record every 10 minutes
    useEffect(() => {
        let intervalId;

        if (recording) {
            intervalId = setInterval(() => {
                cutRecord();
            }, 600000); //10minutes
        }

        return () => {
            // Cleanup the interval when the component unmounts or when recording is stopped
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [recording]);


    //function for start recording
    async function startRecording() {
        try {
            //request for permission
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") { //do if user allow permission
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });
                const { recording } = await Audio.Recording.createAsync({
                    isMeteringEnabled: true,
                    android: { //set record file type for andriod
                        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
                        extension: '.wav',
                        outputFormat: AndroidOutputFormat.DEFAULT,
                        audioEncoder: AndroidAudioEncoder.DEFAULT,
                    },
                    ios: { //set record file type for ios
                        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
                        extension: '.wav',
                        outputFormat: IOSOutputFormat.LINEARPCM,
                    },
                    web: { //set record file type for web
                        mimeType: 'audio/wav',
                        bitsPerSecond: 128000,
                    },
                });
                setRecording(recording);

                //create start record time
                let startRec = new Date();
                setStartRecord(startRec);
            }
        } catch (err) { console.error('Failed to start recording', err) }
    }

    //function for stop record
    async function stopRecording() {
        setRecording(undefined);

        //stop recording
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        //create list of previos record
        let allRecordings = [...recordings];
        //create sound from record
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        //create stop record time
        let stopAt = new Date(startRecord.getTime() + status.durationMillis);
        //push an object in to allRecording list
        allRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            milliDuration: status.durationMillis,
            file: recording.getURI(),
            date: startRecord,
            start: startRecord.toLocaleTimeString(), //record in time format string
            stop: stopAt.toLocaleTimeString(), //record in time format string
        });

        setRecordings(allRecordings);
    }

    //create duration in 0:00 format
    function getDurationFormatted(milliseconds) {
        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
    }

    //function for post recorded audio
    async function postAudio(uri, userId, date, start, stop) {
        console.log('post audio called');

        //to check if the audio already posted
        if (postedAudioFiles.includes(uri)) {
            console.log('audio already posted');
            return;
        };

        let url = 'http://Snorewise-env.eba-c5juuwae.us-east-1.elasticbeanstalk.com/send-audio';
        let filename = uri.split("/").pop();
        let nameNoWav = filename.split(".")[0];
        //encode sound for post via api
        const audioContent = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        //import form data
        const FormData = require('form-data');
        //create form data
        let data = new FormData();

        //append data to form-data
        data.append('user_id', userId);
        data.append('date', date);
        data.append('time_start', start);
        data.append('time_stop', stop);
        data.append('audioFile', {
            uri: `data:audio/wav;base64,${audioContent}`,
            name: `${userId}-${nameNoWav}.wav`,
            type: 'audio/wav',
        });
        // console.log(data);


        try {
            const response = await axios.post(url, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            //see posted result
            console.log(JSON.stringify(response.data));
            // Add the posted audio file URI to the list
            setPostedAudioFiles([...postedAudioFiles, uri]);
        } catch (error) {
            console.log(error);
        }
    }


    //function for getting latest record from recordings
    function getLatestRec() {
        // Get the latest record based on the '_key' property
        const latestRecord = recordings.reduce((latest, current) => {
            return current.sound._key > latest.sound._key ? current : latest;
        }, recordings[0]);

        console.log('_key --> ', latestRecord.sound._key);
        console.log(latestRecord.duration);

        //set post date format
        let createDate = new Date(latestRecord.date);
        let year = createDate.getFullYear();
        let month = createDate.getMonth() + 1;
        let date = createDate.getDate();
        let postDate = `${year}-${month}-${date}`;
        // console.log("date for post audio ->", postDate);
        // console.log(JSON.stringify(postData));

        postAudio(latestRecord.file, userId, postDate, latestRecord.start, latestRecord.stop);
    }

    //function to stop and then start record after 500 milliseconds
    async function cutRecord() {
        await stopRecording().then(setTimeout(() => {
            startRecording();
        }, 500));
    }

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
        <View style={{ flex: 1 }} >
            <ImageBackground style={styles.container} source={bg}>
                <ImageBackground source={waveLine} style={{ width: '100%', alignItems: 'center' }}>
                    <View style={[styles.recordButtonBack, { backgroundColor: recording ? 'rgba(79, 245, 39, 0.5)' : 'rgba(211, 190, 11, 0.5)' }]}>
                        <TouchableOpacity style={styles.recordButton} onPress={recording ? stopRecording : startRecording}>
                            <Feather name="mic" size={70} color="white" />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <Text style={styles.statusText}>
                    {recording ? 'stop record' : 'start record'}
                </Text>
                {/* {getRecordingLines()} */}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#231E30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 40
    },
    fill: {
        flex: 1,
        margin: 15
    },
    recordButton: {
        backgroundColor: 'rgba(211, 190, 11, 1)',
        padding: 20,
        borderRadius: 100,
    },
    recordButtonBack: {
        backgroundColor: 'rgba(211, 190, 11, 0.5)',
        padding: 20,
        borderRadius: 100,
        marginBottom: 10,
        alignItems: 'center',
    },
    statusText: {
        color: 'white',
        marginBottom: 10
    },
    FactorBt: {
        backgroundColor: 'yellow',
        width: 80,
        height: 80,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    bglight: {
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
});