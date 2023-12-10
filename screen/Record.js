import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground } from 'react-native';
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
import axios from 'axios';
import bg from '../assets/top-bottom-bg.png';
import waveLine from '../assets/horizontalWaveLine.png'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
//import recoil state
import { useRecoilState } from 'recoil';
import { currentDate, currentUserId } from '../ApiState';

export default function App() {
    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);
    const [startRecord, setStartRecord] = React.useState();
    const [postedAudioFiles, setPostedAudioFiles] = React.useState([]);
    const [date, setDate] = useRecoilState(currentDate);
    const [userId, setUserId] = useRecoilState(currentUserId);

    useEffect(() => {
        if (recordings.length > 0) {
            getLatestRec();
        }
    }, [recordings]);

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


    async function startRecording() {
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });
                const { recording } = await Audio.Recording.createAsync({
                    isMeteringEnabled: true,
                    android: {
                        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
                        extension: '.wav',
                        outputFormat: AndroidOutputFormat.DEFAULT,
                        audioEncoder: AndroidAudioEncoder.DEFAULT,
                    },
                    ios: {
                        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
                        extension: '.wav',
                        outputFormat: IOSOutputFormat.LINEARPCM,
                    },
                    web: {
                        mimeType: 'audio/wav',
                        bitsPerSecond: 128000,
                    },
                });
                setRecording(recording);
                let startRec = new Date();
                setStartRecord(startRec);
            }
        } catch (err) { console.error('Failed to start recording', err) }
    }

    async function stopRecording() {
        setRecording(undefined);

        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });

        let allRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        let stopAt = new Date(startRecord.getTime() + status.durationMillis);
        let recordDate = startRecord.toLocaleDateString();
        allRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            milliDuration: status.durationMillis,
            file: recording.getURI(),
            date: recordDate.slice(0,-3),
            start: startRecord.toLocaleTimeString(),
            stop: stopAt.toLocaleTimeString(),
        });

        setRecordings(allRecordings);
        // getLatestRec()
    }

    function getDurationFormatted(milliseconds) {
        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
    }

    async function postAudio(uri,userId,date,start,stop) {
        console.log('post audio called');

        if(postedAudioFiles.includes(uri)){
            console.log('audio already posted');
            return;
        };

        let url = 'http://Snorewise-env.eba-c5juuwae.us-east-1.elasticbeanstalk.com/send-audio';
        let filename = uri.split("/").pop();
        let nameNoWav = filename.split(".")[0];

        const FormData = require('form-data');
        const audioContent = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        let data = new FormData();
        data.append('user_id', userId);
        data.append('date', date);
        data.append('time_start', start);
        data.append('time_stop', stop);
        data.append('audioFile', {
            uri: `data:audio/wav;base64,${audioContent}`,
            name: `userID-${nameNoWav}.wav`,
            type: 'audio/wav',
        });
        console.log(data);
        try {
            const response = await axios.post(url, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(JSON.stringify(response.data));
            // Add the posted audio file URI to the list
            setPostedAudioFiles([...postedAudioFiles, uri]);
        } catch (error) {
            console.log(error);
        }
    }


    function getLatestRec() {
        // Get the latest record based on the '_key' property
        const latestRecord = recordings.reduce((latest, current) => {
            return current.sound._key > latest.sound._key ? current : latest;
        }, recordings[0]);
        console.log('_key --> ', latestRecord.sound._key);
        console.log(latestRecord.duration);

        let postData = {
            'user_id' : userId,
            'date': latestRecord.date,
            'time_start' : latestRecord.start,
            'time_stop' : latestRecord.stop,
            'audioFile' : latestRecord.file
        }

        console.log(JSON.stringify(postData));
        postAudio(latestRecord.file,userId, latestRecord.date, latestRecord.start, latestRecord.stop);
    }

    async function cutRecord() {
        await stopRecording().then(setTimeout(() => {
            startRecording();
        }, 500));
    }



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

    function clearRecordings() {
        setRecordings([])
    }

    return (
        <View style={{ flex: 1 }} >
            <ImageBackground style={styles.container} source={bg}>
                {/* <Button title={recording ? 'Stop Recording' : 'Start Recording\n\n\n'} onPress={recording ? stopRecording : startRecording} /> */}
                {/* {getRecordingLines()}
                <Button title={recordings.length > 0 ? '\n\n\nClear Recordings' : ''} onPress={clearRecordings} /> */}
                <View style={[styles.bglight,{padding: 5, marginBottom:10}]}>
                <Text style={styles.statusText}>{date.toLocaleDateString().slice(0, -2)}</Text>
                </View>
                <ImageBackground source={waveLine} style={{ width: '100%', alignItems: 'center' }}>
                    <View style={[styles.recordButtonBack,{backgroundColor: recording? 'rgba(79, 245, 39, 0.5)': 'rgba(211, 190, 11, 0.5)'}]}>
                        <TouchableOpacity style={styles.recordButton} onPress={recording ? stopRecording : startRecording}>
                            <Feather name="mic" size={70} color="white" />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <Text style={styles.statusText}>
                    {recording ? 'click to stop record' : 'click to start record'}
                </Text>
  

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
        // color:'yellow',
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
        marginBottom:10
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