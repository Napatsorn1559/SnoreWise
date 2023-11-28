import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, ImageBackground, TouchableOpacity, Image } from 'react-native';
import bg from '../assets/background.png';
import CalendarPicker from 'react-native-calendar-picker';
import { MaterialCommunityIcons, Octicons, Entypo, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: null,
        };
        this.onDateChange = this.onDateChange.bind(this);
    }

    onDateChange(date) {
        this.setState({
            selectedStartDate: date,
        });

        this.props.onDateChange(date);
    }

    render() {
        const { selectedStartDate } = this.state;

        return (
            <View style={{ marginBottom: 10 }}>
                <CalendarPicker textStyle={{ color: 'white' }} onDateChange={this.onDateChange} />
            </View>
        )
    }
}


export default function Home({ navigation }) {
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    return (
        <View style={{ flex: 1 }}>

            <ImageBackground source={bg} style={styles.container}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                    <Text style={{ color: 'yellow', fontSize: 70, }}>Hi !</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>Jonh Doe</Text>
                      <TouchableOpacity
                        style={{marginLeft:10, paddingTop: 10, alignItems: 'center', backgroundColor: 'white', borderRadius: 60, height: 60, width: 60 }}
                        onPress={() => { navigation.navigate('Login') }} >
                        <Image style={{ height: 40, width: 40 }} source={require('../assets/temp_logo.png')} />
                    </TouchableOpacity>  
                    </View>
                    
                </View>

                <Calendar onDateChange={handleDateChange} />
                <View style={[styles.bglight, { height: 30,}]}>
                    <Text style={{ color: 'white' }}>{selectedDate ? selectedDate.toString() : 'None'}</Text>
                </View>

                <View style={{ paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <MaterialCommunityIcons name="sleep" size={50} color="yellow" />
                            <View style={{ marginLeft: 20, justifyContent: 'space-evenly' }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>14 min</Text>
                                <Text style={{ color: 'white' }}>snoring </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 10, paddingRight: 30 }}>
                            <MaterialCommunityIcons name="power-sleep" size={50} color="yellow" />
                            <View style={{ marginLeft: 20, justifyContent: 'space-evenly' }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>8.7 hr</Text>
                                <Text style={{ color: 'white' }}>sleep time </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <MaterialCommunityIcons name="sleep-off" size={50} color="yellow" />
                            <View style={{ marginLeft: 20, justifyContent: 'space-evenly' }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>35 min</Text>
                                <Text style={{ color: 'white' }}>not snoring </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 10, paddingRight: 30 }}>
                            <Octicons name="graph" size={45} color="yellow" />
                            <View style={{ marginLeft: 20, justifyContent: 'space-evenly' }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>level 1</Text>
                                <Text style={{ color: 'white' }}>index </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View  style={[{flexDirection: 'row', justifyContent: 'space-evenly', height:100}, styles.bglight]}>
                    <Text style={{color: 'white', fontSize: 20, fontWeight: 700 , paddingLeft: 10}}>other ?</Text>
                    <TouchableOpacity style={styles.FactorBt} onPress={()=>{console.log("addData-drink")}} >
                    <MaterialIcons name="wine-bar" size={45} color="black" />
                        <Text>drinks</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.FactorBt} onPress={()=>{console.log("addData-stress")}} >
                    <FontAwesome5 name="tired" size={40} color="black" />
                        <Text>stress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.FactorBt} onPress={()=>{console.log("addData-exercise")}} >
                    <MaterialIcons name="directions-run" size={45} color="black" />
                        <Text>exercise</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#231E30',
        paddingTop: 40,
        paddingHorizontal: 20,
        flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    bglight: {
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    rowSum: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    FactorBt: {
        backgroundColor: 'yellow',
        width: 80,
        height: 80,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    }
});