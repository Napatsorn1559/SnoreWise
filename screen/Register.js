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

  const handleNext = () => {
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

  const handleFinish = () => {
    // Send formData to your API or perform any required action
    console.log("Form Data:", formData);
    //postRegis(username, email, password, firstName, lastName, gender, dateOfBirth);
    postRegis(formData);
    // navigation.navigate("loggedIn");
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
    switch (step) {
      case 1:
        return (
          <View style={styles.root}>
            <Text style={styles.title}>Step 1: Account Information</Text>
            
            <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>Username</Text>
              <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Username"
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
            <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>Gender</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Gender"
                placeholderTextColor="'rgba(255, 255, 255, 0.7)'"
                onChangeText={(gender) =>
                  setFormData({ ...formData, gender })
                }
                value={formData.gender}
              />
            </View>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>Date of Birth</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Date of Birth"
                placeholderTextColor="'rgba(255, 255, 255, 0.7)'"
                onChangeText={(birthday) =>
                  setFormData({ ...formData, birthday })
                }
                value={formData.birthday}
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

    // const data = JSON.stringify({
    //   username: us,
    //   email: e,
    //   password: pwd,
    //   firstname: fn,
    //   lastname: ln,
    //   gender: gd,
    //   dateOfBirth: dob,
    // });

    // try {
    //   const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: data,
    //   });

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

      // Navigate to "LoggedIn" page or perform other actions
      navigation.navigate('loggedIn');
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
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#FFCE46",
  },
  TextInput: {
     height: "auto",
    textAlign: "center",
    flex: 1,
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    margin:50,
    alignItems: "center",
    justifyContent: "center",
    // width: "70%",
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
