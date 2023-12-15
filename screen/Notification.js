import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground } from "react-native";
import waveBG from '../assets/wave2layer.png';
import { requestNotification } from "../Api";
import { useRecoilState,useRecoilValue } from "recoil";
import { currentUserId, totalNotification } from "../RecoilState";

export default function Notification() {
    let uid = useRecoilValue(currentUserId);
    const [totalNoti, setTotalNoti] = useRecoilState(totalNotification);
    const [noti, setNoti] = useState([]);

    let threshold = 20; //mock up threadhold for identify dangerous level

    useEffect(() => {
        const fetchData = async () => {
            try {
                const notiData = await requestNotification(uid);
                setNoti(notiData);
                setTotalNoti(notiData?.length);
                // console.log('noti page',noti);
            } catch (error) {
                console.log('request noti error');
            }
        };

        fetchData(); // Fetch data when the component mounts

    }, [uid])

    function creatNotibox(){
        return (
            noti.map((item, index) => {
                return(
                    <View style={[styles.notiBox, { backgroundColor: item.intensity >= threshold ? 'rgba(187, 45, 45, 0.8)' : 'rgba(201,201,201,0.8)' }]} key={index}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: item.intensity >= threshold ? 'white' : 'yellow', marginBottom: 5 }}>{item.intensity >= threshold ? 'Caution !':'Great !'}</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: item.intensity >= threshold ? 'white' : 'yellow' }}>{item.date}</Text>
                    </View>
                    <Text style={{ color: 'white' }}>your snoring result is in {item.intensity >= threshold ? 'dangerous' : 'normal'} level </Text>
                </View>
                )
            })
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground style={styles.container} source={waveBG} >
                <Text style={styles.tabHeaderText}>Notification</Text>
                {creatNotibox()}
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
        backgroundColor: 'rgba(201,201,201,0.8)',
        marginVertical: 10,
        marginHorizontal: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        textAlign: 'center',
        opacity: 30,

    }
});