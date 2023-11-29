import React from "react";
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground } from "react-native";
import waveBG from '../assets/wave2layer.png';

export default function Notification() {
    return (
        <View style={{ flex: 1 }}>
            <ImageBackground style={styles.container} source={waveBG} >
                <Text style={styles.tabHeaderText}>Notification</Text>
                <View style={styles.notiBox}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFE500', marginBottom: 5 }}>Great !</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#FFE500' }}>17/11/2023</Text>
                    </View>
                    <Text style={{ color: 'white' }}>your snoring result is in normal level </Text>
                </View>
                <View style={styles.notiBox}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFE500', marginBottom: 5 }}>Great !</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#FFE500' }}>18/11/2023</Text>
                    </View>
                    <Text style={{ color: 'white' }}>your snoring result is in normal level </Text>
                </View>
                <View style={[styles.notiBox, { backgroundColor: '#8F3535' }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>Caution !</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>19/11/2023</Text>
                    </View>
                    <Text style={{ color: 'white' }}>your snoring result is in dangerous level </Text>
                </View>
            </ImageBackground>
        </View>

    )
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
        // flex:1,
        textAlign: 'center',
        marginBottom: 20
    },
    notiBox: {
        backgroundColor: '#8696BC',
        marginVertical: 10,
        marginHorizontal: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        textAlign: 'center',
        opacity: 30,

    }
});