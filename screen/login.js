import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
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

export default function LoginPage({navigation}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.root}>
                <StatusBar hidden />
                <ImageBackground
                    style={styles.container}
                    source={background}
                >
                    <Image style={styles.image} source={require("../assets/temp_logo.png")} />
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
                    <TouchableOpacity style={styles.loginBtn}onPress={() => {navigation.navigate('loggedIn')}} >
                        <Text style={styles.loginText}>Log in</Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                    <Seperator />
                    <TouchableOpacity style={styles.loginBtn} onPress={() => {navigation.navigate('loggedIn')}} >
                        <Text style={styles.loginText}>Sign up</Text>
                    </TouchableOpacity>

                </ImageBackground>


            </View>
        </TouchableWithoutFeedback>


    );
}






////////////////////////////////////////////////////////
const seperatorStyles: ViewStyle = {
    height: 1,
    width: "60%",
    backgroundColor: "#FFCE46",
};
const Seperator = () => <View style={seperatorStyles} />;
const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: null,
        height: null,
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
        fontFamily: "Helvetica",
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
        fontFamily: "Helvetica",
        fontWeight: 'bold',
    }
});
