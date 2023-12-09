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

    const handleLogin = async () => {
        try{
            const response = await fetch("localhost:9000", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                email: username,
                password: password,
            }),
        });
        const data = await response.json();
        if(response.ok){
            navigation.navigate("loggedIn");
        }else{
            console.error(data.error || "Login failed");
        }
    }catch(error){
        console.error("Error", error.message);
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
                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                        <Text style={styles.loginText}>Log in</Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                    <View style={styles.separator} />
                    <TouchableOpacity 
                        style={styles.loginBtn} 
                        onPress={() => {navigation.navigate('Register');
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
        width:"80%",
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
