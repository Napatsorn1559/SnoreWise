import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import background from "../assets/background.png";
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function Register({ navigation }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    gender: "",
    birthday: "",
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  

  
  const handleNext = () => {

    // Check if any required field is empty
  // if ( !formData.username || !formData.password || !formData.email) {
  //   alert("Please fill in all required fields");
  //   return;
  // }

    const getEmptyFields = () => {
      const requiredFields = ["username", "email", "password", "confirmPassword"];
      return requiredFields.filter(field => !formData[field]);
    };

    const emptyFields = getEmptyFields();

    if (emptyFields.length > 0) {
      alert(`Please fill in the ${emptyFields.join(", ")}`);
      return;
    }

    // check confirm password
    if (step === 1 && formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password must match");
      return;
    }

    setStep(step + 1);

    // Clear the corresponding value in formData
    const nextStepField = getStepField(step + 1);
    if (nextStepField) {
      setFormData({ ...formData, [nextStepField]: "" });
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };
    const showDatePicker = () => {
      setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
      setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    hideDatePicker();
    setDate(selectedDate);
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    setFormData({ ...formData, birthday: formattedDate });

  };
  const handleFinish = () => {

      // Check if any required field is empty
    const getEmptyFields = () => {
      const requiredFields = ["username", "email", "password", "confirmPassword"];
      if (step === 2) {
        requiredFields.push("firstname", "lastname", "gender", "birthday");
      }
      return requiredFields.filter(field => !formData[field]);
    };

    const emptyFields = getEmptyFields();

    if (emptyFields.length > 0) {
      alert(`Please fill in the ${emptyFields.join(", ")}`);
      return;
    }
 
    console.log("Form Data:", formData);
    alert("Registration Sucessful \nPlease login with created account");
    //postRegis(username, email, password, firstName, lastName, gender, dateOfBirth);
    postRegis(formData);
    navigation.navigate("Login");
  };

  const getStepField = (currentStep) => {
    switch (currentStep) {
      case 1:
        return "username";
      case 2:
        return "firstname";
      default:
        return null;
    }
  };

  const renderStepContent = () => {

    const { goBack } = useNavigation();

    switch (step) {
      case 1:
        return (
          <View style={styles.root}>

            <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.title}>Step 1: Account Information</Text>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>Username</Text>
              <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Username"
                autoCapitalize='none'
                placeholderTextColor="'rgba(255, 255, 255, 0.7)'"
                onChangeText={(username) =>
                  setFormData({ ...formData, username })
                }
                value={formData.username}
              />
            </View>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>E-mail</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="email@example.com"
                autoCapitalize='none'
                placeholderTextColor="'rgba(255, 255, 255, 0.7)'"
                onChangeText={(email) =>
                  setFormData({ ...formData, email })
                }
                value={formData.email}
              />
            </View>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>Password</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Password"
                placeholderTextColor="'rgba(255, 255, 255, 0.7)'"
                secureTextEntry={true}
                
                onChangeText={(password) =>
                  setFormData({ ...formData, password })
                }
                value={formData.password}
              />
            </View>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>Confirm Password</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Confirm Password"
                placeholderTextColor="'rgba(255, 255, 255, 0.7)'"
                secureTextEntry={true}
                onChangeText={(confirmPassword) =>
                  setFormData({ ...formData, confirmPassword })
                }
                value={formData.confirmPassword}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.root}> 
            <Text style={styles.title}>Step 2: Personal Information</Text>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>First Name</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="First Name"
                placeholderTextColor="'rgba(255, 255, 255, 0.7)'"
                onChangeText={(firstname) =>
                  setFormData({ ...formData, firstname })
                }
                value={formData.firstname}
              />
            </View>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>Last Name</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Last Name"
                placeholderTextColor="'rgba(255, 255, 255, 0.7)'"
                onChangeText={(lastname) =>
                  setFormData({ ...formData, lastname })
                }
                value={formData.lastname}
              />
            </View>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>Gender</Text>
            <View style={styles.inputView}>
              <RNPickerSelect
                placeholder={{
                  label: 'Select Gender', // Set your custom placeholder text here
                  value: null,
                }}
                placeholderTextColor="'rgba(255, 255, 255, 0.7)'"
                onValueChange={(gender) => setFormData({ ...formData, gender })}
                items={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Prefer not to say', value: 'preferNotToSay' },
                ]}
                textInputProps={{
                  style: {
                    padding: 10,
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "'rgba(255, 255, 255, 0.7)'",
                    width: "100%",
                  },
                }}
              />
            </View>

            <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>Date of Birth</Text>
              <View style={styles.inputView}>
                <TouchableWithoutFeedback onPress={showDatePicker}>
                  <View style={styles.datePickerStyle}>
                    <Text style={[styles.dateText, { color: "'rgba(255, 255, 255, 0.7)'"}]}>{formData.birthday || 'Select Date'}</Text>
                  </View>
                </TouchableWithoutFeedback>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>
            <View style={styles.buttonContainer}>
          </View>
        </View>
      );
      default:
        return null;
    }
  };

  async function postRegis(data) {

    let url = 'http://Snorewise-env.eba-c5juuwae.us-east-1.elasticbeanstalk.com/create-user';

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        console.error("Registration failed:", response.status, response.statusText);
        const responseData = await response.text(); // Log the full response
        console.error("Full response:", responseData);
        return;
      }

      const responseData = await response.json();
      console.log("Registration successful:", responseData);

      // Navigate to "LogIn" page
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error:", error.message);
    }

  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.root}>
        <StatusBar hidden />
        <ImageBackground style={styles.container} source={background}>
          {renderStepContent()}

          <View style={styles.buttonContainer}>
            {step > 1 && (
              <TouchableOpacity style={styles.button} onPress={handlePrevious}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={step === 2 ? handleFinish : handleNext}
            >
              <Text style={styles.buttonText}>
                {step === 2 ? "Finish" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent:"center",
  },
  container: {
    flex: 1,
    backgroundColor: "#1F1B3C",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 50,
  },
  inputView: {
    // width: "70%",
    // height: 45,

    marginBottom: 20,
    alignItems: 'stretch',
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#FFCE46",
  },
  TextInput: {
    //  height: "auto",
    // textAlign: "center",
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    margin:50,
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
  },
  button: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FFCE46",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    position: 'absolute',
    top: 75,
    left: 0,
    zIndex: 1,
  },
  dateText:{
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    width: "100%",
    color: "'rgba(255, 255, 255, 0.7)'",
  },
  datePickerStyle:{
    color:"black",
  },
});
