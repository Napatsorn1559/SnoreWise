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
    ScrollView,
} from "react-native";
import bg from '../assets/wave2layer.png';
import { currentUserId, currentUsername } from "../ApiState";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";

export default function Profile({ navigation }) {
    // const [userId, setUserId] = useRecoilState(currentUserId);
    const uid = useRecoilValue(currentUserId);
    const [profile, setProfile] = useState([]);
    const [editableProfile, setEditableProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false); // track edit mode

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

        if(uid !== 0){ fetchData(); }
    }, [uid]); // Only run the effect when userId changes

    let bdate = new Date(profile.birthday)

    // editable
    const handleEdit = (field, value) => {
        setEditableProfile({
            ...editableProfile,
            [field]: value,
        });
        console.log("you are in handleEdit");
        setIsEditing(true); 
        console.log(isEditing);
    };


    // save & update data
    const handleSave = async () => {
        try {
            const post_url = 'http://Snorewise-env.eba-c5juuwae.us-east-1.elasticbeanstalk.com/update-user/${uid}';

            console.log("you are in handleSave");
            console.log("user id =", uid);
            console.log(isEditing); // should be true

            // if (isEditing) {
            //     const response = await axios.post(post_url, editableProfile);
            // // update the local state with the saved information.
            //     setProfile(response.data);
            // }

            if (isEditing) {
                response = await fetch(post_url, {
                    method: "PUT",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editableProfile),
                });
            }

            if (isEditing && !response.ok) {
                console.error("Update failed:", response.status, response.statusText);
                const responseData = await response.text(); // Log the full response
                console.error("Full response:", responseData);
                return;
            }

            setIsEditing(false); 
            console.log("update success");
        } catch (error) {
            console.error("Error updating data:", error.message);
        }
    };


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
                    <View style={styles.profileInfo}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>{profile.username}</Text>
                    </View>
                </View>

                <View style={styles.bglight}>
                    <View style={styles.inlineContainer}>
                        <View style={[styles.inputBox, styles.inlineBox]}>
                            <Text style={styles.titleText}>Firstname</Text>
                            {/* <Text style={styles.Inputtext}>{profile.firstname}</Text> */}
                            {isEditing ? (
                                <TextInput
                                    style={styles.Inputtext}
                                    value={editableProfile.firstname || profile.firstname}
                                    onChangeText={(text) => handleEdit("firstname", text)}
                                />
                            ) : (
                                <Text style={styles.Inputtext}>{profile.firstname}</Text>
                            )}
                        </View>
                        <View style={[styles.inputBox, styles.inlineBox]}>
                            <Text style={styles.titleText}>Lastname</Text>
                            <Text style={styles.Inputtext}>{profile.lastname}</Text>
                        </View>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>E-mail</Text>
                        <Text style={styles.Inputtext}>{profile.email}</Text>
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
                        <Text style={styles.titleText}>Nationality</Text>
                        <Text style={styles.Inputtext}>{profile.nationality}</Text>
                    </View>
                    <View style={styles.inlineContainer}>
                        <View style={[styles.inputBox, styles.inlineBox]}>
                            <Text style={styles.titleText}>Height</Text>
                            <Text style={styles.Inputtext}>{profile.height}</Text>
                        </View>
                        <View style={[styles.inputBox, styles.inlineBox]}>
                            <Text style={styles.titleText}>Weight</Text>
                            <Text style={styles.Inputtext}>{profile.weight}</Text>
                        </View>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Medical Condition</Text>
                        <Text style={styles.Inputtext}>{profile.medical_condition}</Text>
                    </View>
                    <TouchableOpacity style={[styles.saveBtn, !isEditing ? styles.editBtn : styles.saveBtn,]} 
                    onPress={!isEditing ? handleEdit : handleSave} >
                        <Text style={!isEditing ? styles.editText : styles.saveText}> 
                            {!isEditing ? 'Edit' : 'Save'}
                        </Text>
                    </TouchableOpacity>
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
        //marginBottom: "15%",
        marginBottom: "8it seems that both imge%",
    },
    profileInfo: {
        alignItems: 'center',
        marginTop: 15, 
    },
    bglight: {
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.6)',
        alignItems: 'stretch',
        justifyContent: 'center',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        padding: 10,
        paddingTop:30,
        paddingBottom:30,
        marginHorizontal: 15,
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
        // marginBottom: 10,
    },
    inputBox: {
        // backgroundColor: 'rgba(255, 255, 255, 0.3)',
        height: 50,
        width: "90%",
        marginHorizontal: 20,
        borderBottomColor: '#838996',
        borderBottomWidth: 1.5,
        paddingLeft: 5,
        alignItems: "left",
        marginBottom: 25,
    },
    Inputtext: {
        fontSize: 15,
        color: '#231E30',
        fontWeight: 'bold',
        marginHorizontal: 20,
        textAlign: "left",
    },
    titleText: {
        fontSize: 17,
        marginBottom: 8,
        color: '#313168',
        fontWeight: 'bold',
        textAlign: "left",
    },
    inlineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inlineBox: {
        width: '40%',
    },
    saveBtn: {
        width: '65%',
        borderRadius: 25,
        height: 40,
        marginTop: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#4CAF50",
    },
    saveText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    editBtn: {
        backgroundColor: '#FFCE46',
    },
    editText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
});