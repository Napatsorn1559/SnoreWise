import * as React from 'react';
import { Text, View, StyleSheet, Button, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarPicker from 'react-native-calendar-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

function Record() {
  const [recording, setRecording] = React.useState();
  const [sound, setSound] = React.useState();
  const [uri, seturi] = React.useState();
  this.state = {
    uri: null
  }

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri: recording.getURI() });
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    this.setState({
      uri: uri
    })
    console.log('Recording stopped and stored at', uri);
  }

}

class HomeScreen extends React.Component {
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
  }

  render() {
    const { selectedStartDate } = this.state;
    let today = new Date();
    const startDate = selectedStartDate ? selectedStartDate.toString() : today.toString();
    return (
      <View style={{ flex: 1, backgroundColor: '#1F1B3C' }}>
        <View style={styles.homeheader}>
          <Text style={styles.hi}>Hi!</Text>
          <View  >
            {/* <Button title='profile'/> */}
            <Icon.Button name="user" size={30} color="white" />
          </View>
        </View>
        <CalendarPicker textStyle={{
          color: 'white',
        }}
          onDateChange={this.onDateChange} />
        <Text style={styles.boxBg}>{startDate}</Text>

        <View style={{ flexDirection: 'col' }}>
          <View style={styles.sumGrid}>
            <Text style={styles.sumSymbol}>total snoring </Text>
            {/* <Icon name='g-translate'color='#00aced' /> */}
            <Text style={styles.sumSymbol}>total sleep</Text>
          </View>
          <View style={styles.sumGrid}>
            <Text style={styles.sumSymbol}>total none-snoring</Text>
            <Text style={styles.sumSymbol}>index level</Text>
          </View>
        </View>


      </View>
    )
  }
}

class RecordSound extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.boxBg}>Record</Text>
        {/* <Text>{Record}</Text>
        <View style={{backgroundColor:'white'}}>
          <Button
              title={Record.recording ? 'Stop Recording' : 'Start Recording'}
              onPress={Record.recording ? stopRecording : startRecording}
            />
        </View> */}
      </View>
    )
  }
}

class Visualization extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.boxBg}>graph</Text>
      </View>
    )
  }
}

class Logs extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.boxBg}>logs</Text> */}
        <Text style={styles.tabHeaderText}>Request log</Text>
      </View>
    )
  }
}

class Notification extends React.Component {
  notiContent = [
    {
      title: 'Great !',
      date: '19/11/2023',
      status: 'Good',
      content: 'your snoring result is in normal level !'
    },
    {
      title: 'Caution !',
      Date: '18/11/2023',
      status: 'Bad',
      content: 'your snoring result is in dangerous level !'
    },
  ]

  // renderNoti = this.notiContent.map((item) => {
  //     return (
  //       <View style={styles.notiBox}>
  //         <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
  //           <Text style={{fontSize: 20, fontWeight:'bold', color:'#FFE500'}}>item</Text>
  //           <Text style={{fontSize: 15, fontWeight:'bold', color:'#FFE500'}}>item.date</Text>
  //         </View>
  //         <Text>item.content</Text>
  //       </View>
  //     )
  //   })
  // };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.tabHeaderText}>Notification</Text>
        <View style={styles.notiBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, fontWeight:'bold', color:'#FFE500', marginBottom: 5}}>Great !</Text>
            <Text style={{fontSize: 15, fontWeight:'bold', color:'#FFE500'}}>17/11/2023</Text>
          </View>
          <Text style={{color: 'white'}}>your snoring result is in normal level </Text>
        </View>
        <View style={styles.notiBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, fontWeight:'bold', color:'#FFE500', marginBottom: 5}}>Great !</Text>
            <Text style={{fontSize: 15, fontWeight:'bold', color:'#FFE500'}}>18/11/2023</Text>
          </View>
          <Text style={{color: 'white'}}>your snoring result is in normal level </Text>
        </View>
        <View style={[styles.notiBox, { backgroundColor: '#8F3535'}]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, fontWeight:'bold', color:'white', marginBottom: 5}}>Caution !</Text>
            <Text style={{fontSize: 15, fontWeight:'bold', color:'white'}}>19/11/2023</Text>
          </View>
          <Text style={{color: 'white'}}>your snoring result is in dangerous level </Text>
        </View>
          {/* {this.renderNoti} */}
      </View>
    )
  }
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="noti" screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="visual" component={Visualization} />
            <Tab.Screen name="record" component={RecordSound} />
            <Tab.Screen name="logs" component={Logs} />
            <Tab.Screen name="noti" component={Notification} />
          </Tab.Navigator>
        </NavigationContainer>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    // justifyContent: 'center',
    backgroundColor: '#1F1B3C',
  }, 
  homeheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  }, 
  hi: {
    fontSize: 50,
    color: 'yellow'
  }, 
  profileButton: {
    backgroundColor: 'white',
  }, 
  boxBg: {
    backgroundColor: '#8696BC',
    opacity: 55,
    margin: 10,
    padding: 10,
    borderRadius: 30,
    // justifyContent: 'center',
    textAlign: 'center'
  }, 
  sumSymbol: {
    margin: 10,
    color: 'yellow',
    fontSize: 20,
    textAlign: 'center',
  },
  sumGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tabHeaderText: {
    fontSize: 45,
    color: 'white',
    fontWeight: 'bold',
    // flex:1,
    textAlign: 'center',
    marginBottom: 20
  },
  notiBox: {
    backgroundColor: '#8696BC',
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    textAlign: 'center',
    opacity: 30
  }
});
