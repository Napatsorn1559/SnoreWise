import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ViewStyle,
    Image,
    TextInput,
    Button,
    TouchableOpacity,
    ImageBackground,
    Keyboard,
    TouchableWithoutFeedback
} from "react-native";
import background from '../assets/background.png';
import axios from 'axios';
import { useRecoilState } from "recoil";
import { currentUserId, currentUsername } from "../RecoilState";
import { requestLogin } from "../Api";

export default function LoginPage({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useRecoilState(currentUserId);
    const [usernameR, setUsernameR] = useRecoilState(currentUsername);

    const handleLogin = async () => {
        try {
            const response = await requestLogin(username, password);

            if (response.result == 'success') {
                console.log("Login successful");
                setUserId(response.userId);
                setUsernameR(response.username);

                setTimeout(() => {
                    console.log('user id ',userId, 'is logged in')
                    navigation.navigate('loggedIn');
                }, 200);
            } else {
                // console.error("error",response.status,"Login failed : username or password is not correct");
                alert('wrong username or password')

            }

        } catch (error) {
            console.error("Login failed :", error.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.root}>
                <StatusBar hidden />
                <ImageBackground
                    style={styles.container}
                    source={background}
                >
                    <Image
                        style={styles.image}
                        source={require("../assets/temp_logo.png")}
                    />
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Username"
                            placeholderTextColor="#fff"
                            onChangeText={(username) => setUsername(username)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Password"
                            placeholderTextColor="#fff"
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => handleLogin()}>
                        {/* onPress={() => {navigation.navigate('loggedIn')}}> */}
                        <Text style={styles.loginText}>Log in</Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                    <View style={styles.separator} />
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => {
                            navigation.navigate('Register');
                        }}
                    >
                        <Text style={styles.loginText}>Sign up</Text>
                    </TouchableOpacity>

                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>


    );
}






////////////////////////////////////////////////////////

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: null,
        height: null,
    },
    separator: {
        height: 2,
        width: "80%",
        alignSelf: 'center',
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#1F1B3C",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        marginBottom: 40,
    },
    inputView: {
        // backgroundColor: "#B7B3D2",
        // opacity: 0.5,
        // borderRadius: 10,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#FFCE46",
    },
    TextInput: {
        // width: "100%",
        height: 50,
        textAlign: "center",
        flex: 1,
        padding: 10,
        fontSize: 16,
        // fontFamily: "Helvetica",
        fontWeight: 'bold',
        color: 'white'
    },

    loginBtn: {
        width: "50%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#FFCE46",
    },
    loginText: {
        fontSize: 16,
        // fontFamily: "Helvetica",
        fontWeight: 'bold',
    }
});