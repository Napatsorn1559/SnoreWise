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
import background from "../assets/background.png";

export default function Register({ navigation }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.title}>Step 1: Account Information</Text>
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
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Confirm Password"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                onChangeText={(confirmPassword) =>
                  setConfirmPassword(confirmPassword)
                }
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.title}>Step 2: Personal Information</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="First Name"
                placeholderTextColor="#fff"
                onChangeText={(firstName) => setFirstName(firstName)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Last Name"
                placeholderTextColor="#fff"
                onChangeText={(lastName) => setLastName(lastName)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Gender"
                placeholderTextColor="#fff"
                onChangeText={(gender) => setGender(gender)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Date of Birth"
                placeholderTextColor="#fff"
                onChangeText={(dateOfBirth) => setDateOfBirth(dateOfBirth)}
              />
            </View>
            <View style={styles.buttonContainer}>
            {/* <TouchableOpacity
              style={styles.button}
              onPress={handlePrevious}
            >
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>
                {step === 2 ? "Finish" : "Next"}
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      );
    default:
      return null;
  }
};
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.root}>
        <StatusBar hidden />
        <ImageBackground style={styles.container} source={background}>
          {renderStepContent()}

          <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
                if (step === 1) {
                // If it's step 1, proceed to step 2
                setStep(2);
                } else {
                // If it's step 2, navigate to the "loggedIn" screen
                navigation.navigate('loggedIn');
                }
            }}
            >
            <Text style={styles.buttonText}>{step === 1 ? 'Next' : 'Finish'}</Text>
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
    width: null,
    height: null,
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
    marginBottom: 20,
  },
  inputView: {
    width: "90%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#FFCE46",
  },
  TextInput: {
    height: 50,
   
    textAlign: "center",
    flex: 1,
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",

    justifyContent: "space-between",
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
});
