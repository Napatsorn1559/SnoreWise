import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Home, Notification, Record, RequestLog, Visualization, LoginPage, Register, Profile } from './screen';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, PrivateValueStore } from '@react-navigation/native';
import { MaterialIcons, Foundation, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { RecoilRoot } from 'recoil';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const iconSize = 38;

const LoggedIn = () => {
  return (
    <Tab.Navigator screenOptions={styles.screenOption}>
      <Tab.Screen name="Home" component={Home}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {/* <MaterialIcons name="home-filled" size={iconSize} color={ focused ? 'white': 'black'} /> */}
                <MaterialCommunityIcons name="home-outline" size={iconSize} color={focused ? 'white' : 'black'} />
              </View>
            )
          }
        }} />
      {/* <Tab.Screen name="Visualization" component={Visualization}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Foundation name="graph-bar" size={iconSize} color={focused ? 'white' : 'black'} />
              </View>
            )
          }
        }} /> */}
      <Tab.Screen name="Record" component={Record}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={styles.RecordButtonBg}>
                <View style={styles.RecordButton}>
                  <MaterialCommunityIcons name="microphone" size={iconSize} color={focused ? 'white' : 'black'} />
                </View>
              </View>
            )
          }
        }} />
      {/* <Tab.Screen name="Request Log" component={RequestLog}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="list-alt" size={iconSize} color={focused ? 'white' : 'black'} />
              </View>
            )
          }
        }} /> */}
         <Tab.Screen name="profile" component={Profile}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="account-circle-outline" size={iconSize} color={focused ? 'white' : 'black'} />
              </View>
            )
          }
        }} />
      {/* <Tab.Screen name="Notification" component={Notification}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="bell-outline" size={iconSize} color={focused ? 'white' : 'black'} />
              </View>
            )
          },
          tabBarBadge: 3
        }}
      /> */}
    </Tab.Navigator>
  )
}
export default function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }} >
          <Stack.Screen name='Login' component={LoginPage} />
          <Stack.Screen name='loggedIn' component={LoggedIn} />
          <Stack.Screen name='Register' component={Register} />
          <Stack.Screen name='Profile' component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RecordButton: {
    top: 0,
    width: Platform.OS == "ios" ? 65 : 60,
    height: Platform.OS == "ios" ? 65 : 60,
    borderRadius: Platform.OS == "ios" ? 70 : 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7D539',
    shadowColor: 'white',
    shadowOffset: { width: 2, height: -2 },
  },
  RecordButtonBg: {
    top: Platform.OS == "ios" ? -10 : -20,
    width: Platform.OS == "ios" ? 80 : 90,
    height: Platform.OS == "ios" ? 80 : 90,
    borderRadius: Platform.OS == "ios" ? 80 : 40,
    // position:'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(211, 190, 11, 0.8)'
  },
  screenOption: {
    borderTopColor:'none',
    border: 'none',
    tabBarShowLabel: false,
    headerShown: false,
    margin:10,
    tabBarStyle: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 0,
      height: 75,
      backgroundColor: 'rgba(231, 213, 57, 0.8)',
      borderTopLeftRadius:20,
      borderTopRightRadius:20,
    }
  }
});
