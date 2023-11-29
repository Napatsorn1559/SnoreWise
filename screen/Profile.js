import React from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
  } from "react-native";
import bg from '../assets/wave2layer.png';

export default function Profile({navigation}){
    return(
        <ImageBackground source={bg} style={styles.container}>
            <TouchableOpacity style={styles.logoutBtn}onPress={() => {navigation.navigate('Login')}} >
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
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
      bglight: {
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
      },
      logoutBtn: {
        width: "50%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#FFCE46",
    },
    logoutText: {
        fontSize: 16,
        // fontFamily: "Helvetica",
        fontWeight: 'bold',
    }
});