import React , { useState} from "react";
import { View, Text, StyleSheet, ImageBackground,TextInput, Button } from "react-native";
import waveBG from '../assets/top-bottom-bg.png';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function RequestLog(){
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    return(
        <View style={{ flex: 1 }}>
        <ImageBackground style={styles.container} source={waveBG} >
            <Text style={styles.tabHeaderText}>Request <Text style={{color: 'yellow'}}>Log</Text></Text>
            <TextInput style={styles.inputBox} placeholder="File type" placeholderTextColor="#fff"></TextInput>
            <TextInput style={styles.inputBox} placeholder="Start Date" placeholderTextColor="#fff"></TextInput>
            <TextInput style={styles.inputBox} placeholder="End Date" placeholderTextColor="#fff"></TextInput>
            <TextInput style={styles.inputBox} placeholder="Purpose" placeholderTextColor="#fff"></TextInput>
            { showPicker && (
                <DateTimePicker mode='date' display='spinner' value={date} />
            )}
            <Button title='Submit' color='#03A9F4' onPress={()=>{alert('Submitted')}} />
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
    inputBox : {
        backgroundColor:'rgba(255, 255, 255, 0.3)', 
        height: 50, 
        marginHorizontal: 20,
        borderBottomColor: 'rgba(255, 229, 0, 1)',
        borderBottomWidth: 2,
        paddingLeft: 10,
        fontSize: 18,
        marginBottom: 15
    }
});