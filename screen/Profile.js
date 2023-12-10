import React from "react";
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

export default function Profile({navigation}){
    state = {

    }
    return(
        <ImageBackground source={bg} style={styles.container}>
            <View style={{flex:1, flexDirection:"column"}}>
                <View style={styles.top}>
                    <TouchableOpacity style={styles.logoutBtn}onPress={() => {navigation.navigate('loggedIn')}} >
                        <Text style={styles.logoutText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutBtn}onPress={() => {navigation.navigate('Login')}} >
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.profile}>
                    <Image style={styles.image} source={require('../assets/temp_logo.png')} />
                    <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>Johnny</Text>
                </View>
                <View style={styles.bglight}>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Name</Text>
                        <Text style={styles.Inputtext}>John Doe</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Date of Birth</Text>
                        <Text style={styles.Inputtext}>1 September 1987</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Gender</Text>
                        <Text style={styles.Inputtext}>Male</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>E-mail</Text>
                        <Text style={styles.Inputtext}>JohnDoe@gmail.com</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Height</Text>
                        <Text style={styles.Inputtext}>None</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Width</Text>
                        <Text style={styles.Inputtext}>None</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Medical Condition</Text>
                        <Text style={styles.Inputtext}>None</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Nationality</Text>
                        <Text style={styles.Inputtext}>Thai</Text>
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
        flexDirection:"row",
        justifyContent: 'space-between',
        margin: 10,
      },
      profile:{
        flex:1,
        flexDirection:"column",
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
        padding:10,
        paddingVertical:30,
    },
      logoutBtn: {
        width: "20%",
        borderRadius: 25,
        height: 25,
        padding:5,
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
        height:50,
        width:"90%",
        marginHorizontal: 20,
        borderBottomColor: '#231E30',
        borderBottomWidth: 2,
        paddingLeft: 10,
        alignItems:"left",
        marginBottom:10,
    },
    Inputtext: {
        fontSize: 15,
        color: '#231E30',
        fontWeight: 'bold',
        marginHorizontal: 20,
        textAlign:"left",
    },
    titleText:{
        fontSize: 18,
        marginBottom:8,
        color: '#231E30',
        fontWeight: 'bold',
        textAlign:"left",
    },
});