import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
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
import ky from 'ky';

export default function App() {
    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);
    

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
        allRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        });

        setRecordings(allRecordings);
        // getLatestRec()
    }

    function getDurationFormatted(milliseconds) {
        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
    }

    async function postAudio(uri) {
        console.log('post audio called');
        let url = 'http://test-snorwise-env.eba-iz52pgnf.us-east-1.elasticbeanstalk.com/send-audio';
        let filename = uri.split("/").pop();
        let nameNoWav = filename.split(".")[0];

        const FormData = require('form-data');
        const audioContent = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        let data = new FormData();
        data.append('audioFile', {
            uri: `data:audio/wav;base64,${audioContent}`,
            name: `userID-${nameNoWav}.wav`,
            type: 'audio/wav',
        });

        try {
            const response = await axios.post(url, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(JSON.stringify(response.data));
        } catch (error) {
            console.log(error);
        }
    }


    function getLatestRec(){
        // Get the latest record based on the '_key' property
        const latestRecord = recordings.reduce((latest, current) => {
            return current.sound._key > latest.sound._key ? current : latest;
        }, recordings[0]);
        console.log('_key --> ' ,latestRecord.sound._key);
        console.log(JSON.stringify(latestRecord.file));
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
        <View style={styles.container}>
            <Button title={recording ? 'Stop Recording' : 'Start Recording\n\n\n'} onPress={recording ? stopRecording : startRecording} />
            {getRecordingLines()}
            <Button title={recordings.length > 0 ? '\n\n\nClear Recordings' : ''} onPress={clearRecordings} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    }
});