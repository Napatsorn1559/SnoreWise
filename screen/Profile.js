import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import bg from '../assets/wave2layer.png';
import { currentUserId, currentUsername } from "../ApiState";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";

export default function Profile({ navigation }) {
    // const [userId, setUserId] = useRecoilState(currentUserId);
    const uid = useRecoilValue(currentUserId);
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log(uid);
            const http = 'http://Snorewise-env.eba-c5juuwae.us-east-1.elasticbeanstalk.com/getuser';
            let jsonPayload = {
                'user_id': uid,
            };

            try {
                const response = await axios.post(http, jsonPayload);
                // console.log(JSON.stringify(response.data));
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };

        if(uid != 0){fetchData();}
    }, [uid]); // Only run the effect when userId changes

    let bdate = new Date(profile.birthday)

    return (
        <ImageBackground source={bg} style={styles.container}>
            <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={styles.top}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={() => { navigation.navigate('loggedIn') }} >
                        <Text style={styles.logoutText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutBtn} onPress={() => { navigation.navigate('Login') }} >
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.profile}>
                    <Image style={styles.image} source={require('../assets/temp_logo.png')} />
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>{profile.username}</Text>
                </View>
                <View style={styles.bglight}>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Name</Text>
                        <Text style={styles.Inputtext}>{profile.firstname} {profile.lastname}</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Date of Birth</Text>
                        <Text style={styles.Inputtext}>{bdate.toUTCString().slice(0,-12)}</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Gender</Text>
                        <Text style={styles.Inputtext}>{profile.gender}</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>E-mail</Text>
                        <Text style={styles.Inputtext}>{profile.email}</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Height</Text>
                        <Text style={styles.Inputtext}>{profile.height}</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Weight</Text>
                        <Text style={styles.Inputtext}>{profile.weight}</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Medical Condition</Text>
                        <Text style={styles.Inputtext}>{profile.medical_condition}</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Nationality</Text>
                        <Text style={styles.Inputtext}>{profile.nationality}</Text>
                    </View>
                </View>
            </View>


        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#231E30',
        alignItems: 'stretch',
        paddingTop: 30,
    },
    top: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        margin: 10,
    },
    profile: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: "10%",
    },
    bglight: {
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.6)',
        alignItems: 'stretch',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 10,
        paddingVertical: 30,
    },
    logoutBtn: {
        width: "20%",
        borderRadius: 25,
        height: 25,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: "#FFCE46",
    },
    logoutText: {
        fontSize: 13,
        // fontFamily: "Helvetica",
        fontWeight: 'bold',
    },
    image: {
        marginBottom: 10,
    },
    inputBox: {
        // backgroundColor: 'rgba(255, 255, 255, 0.3)',
        height: 50,
        width: "90%",
        marginHorizontal: 20,
        borderBottomColor: '#231E30',
        borderBottomWidth: 2,
        paddingLeft: 10,
        alignItems: "left",
        marginBottom: 10,
    },
    Inputtext: {
        fontSize: 15,
        color: '#231E30',
        fontWeight: 'bold',
        marginHorizontal: 20,
        textAlign: "left",
    },
    titleText: {
        fontSize: 18,
        marginBottom: 8,
        color: '#231E30',
        fontWeight: 'bold',
        textAlign: "left",
    },
});