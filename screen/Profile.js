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

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [bday, setBday] = useState('');
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [medCondition, setMedCondition] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            console.log(uid);
            const http = 'http://Snorewise-mobile-env.eba-chmvh2mv.us-east-1.elasticbeanstalk.com/getuser';
            let jsonPayload = {
                'user_id': uid,
            };

            try {
                const response = await axios.post(http, jsonPayload);
                // console.log(JSON.stringify(response.data));
                setFirstName(response.data.firstname);
                setLastName(response.data.lastname);
                setBday(response.data.birthday);
                setEmail(response.data.email);
                setGender(response.data.gender);
                setNationality(response.data.nationality);
                setHeight(response.data.height);
                setWeight(response.data.weight);
                setMedCondition(response.data.medical_condition);

                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };

        if (uid !== 0) { fetchData(); }
    }, [uid, isEditing]); // Only run the effect when userId changes


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
            const post_url = `http://Snorewise-mobile-env.eba-chmvh2mv.us-east-1.elasticbeanstalk.com/update-user/${uid}`;

            console.log("you are in handleSave");
            console.log("user id =", uid);
            console.log(isEditing); // should be true

            // if (isEditing) {
            //     const response = await axios.post(post_url, editableProfile);
            // // update the local state with the saved information.
            //     setProfile(response.data);
            // }
            let payload = {
                "birthday": bday, 
                "email": email, 
                "firstname": firstName, 
                "gender": gender, 
                "height": height, 
                "lastname": lastName, 
                "medical_condition": medCondition,
                "nationality": nationality,
                "weight": weight
            }

            if (isEditing) {
                const response = await axios.put(post_url, payload)
                    .then((response) => { console.log(response.data) })
                    .catch((error) => { console.error("update profile fail", error); })
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
                                    value={firstName}
                                    onChangeText={(text) => setFirstName(text)}
                                />
                            ) : (
                                <Text style={styles.Inputtext}>{firstName}</Text>
                            )}
                        </View>
                        <View style={[styles.inputBox, styles.inlineBox]}>
                            <Text style={styles.titleText}>Lastname</Text>
                            {isEditing ? (<TextInput
                                style={styles.Inputtext}
                                value={lastName}
                                onChangeText={(text) => setLastName(text)}
                            />) :( <Text style={styles.Inputtext}>{lastName}</Text>)}
                        </View>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>E-mail</Text>
                        {isEditing ? <TextInput
                            style={styles.Inputtext}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        /> : <Text style={styles.Inputtext}>{email}</Text>}
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Date of Birth</Text>
                        {isEditing ? <TextInput
                            style={styles.Inputtext}
                            value={bday}
                            onChangeText={(text) => setBday(text)}
                        /> : <Text style={styles.Inputtext}>{bday.toString()}</Text>}
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Gender</Text>
                        {isEditing ? (<TextInput
                            style={styles.Inputtext}
                            value={gender}
                            onChangeText={(text) => setGender(text)}
                        />) : <Text style={styles.Inputtext}>{gender}</Text>}
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Nationality</Text>
                        { isEditing? (<TextInput
                            style={styles.Inputtext}
                            value={nationality}
                            onChangeText={(text) => setNationality(text)}
                        />) : <Text style={styles.Inputtext}>{nationality}</Text>}
                    </View>
                    <View style={styles.inlineContainer}>
                        <View style={[styles.inputBox, styles.inlineBox]}>
                            <Text style={styles.titleText}>Height</Text>
                            {isEditing ? (<TextInput
                                style={styles.Inputtext}
                                value={height}
                                onChangeText={(text) => setHeight(text)}
                            />) : <Text style={styles.Inputtext}>{height}</Text>}
                        </View>
                        <View style={[styles.inputBox, styles.inlineBox]}>
                            <Text style={styles.titleText}>Weight</Text>
                          {isEditing ? (<TextInput
                                style={styles.Inputtext}
                                value={weight}
                                onChangeText={(text) => setWeight(text)}
                            />) : <Text style={styles.Inputtext}>{weight}</Text>}
                        </View>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.titleText}>Medical Condition</Text>
                        { isEditing ? ( <TextInput
                            style={styles.Inputtext}
                            value={medCondition}
                            onChangeText={(text) => setMedCondition(text)}
                        />) : <Text style={styles.Inputtext}>{medCondition}</Text>}
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
        paddingTop: 30,
        paddingBottom: 30,
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