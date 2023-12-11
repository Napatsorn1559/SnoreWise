import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, ImageBackground, ScrollView, FlatList } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import CalendarPicker from 'react-native-calendar-picker';
import bg from '../assets/wave2layer.png';
//import recoil state
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentDate, currentUserId } from '../ApiState';
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from '@expo/vector-icons';
import axios from "axios";
import { Audio } from "expo-av";


export default function Visualization() {
  const uid = useRecoilValue(currentUserId);
  const [selectedDate, setSelectedDate] = useRecoilState(currentDate);
  const [visualData, setVisualData] = React.useState([]);
  const [chartData, setChartData] = useState([]);

  const SoundPlayer = ({ soundFileUri }) => {
    const [sound, setSound] = useState();
    // console.log(soundFileUri);
    async function playSound() {
      console.log("playSound click");
      const { sound } = await Audio.Sound.createAsync(
        { uri: soundFileUri },
        { shouldPlay: true }
      );
      setSound(sound);
    }

    useEffect(() => {
      return sound ? () => sound.unloadAsync() : undefined;
    }, [sound]);

    return (
      <View>
        <TouchableOpacity  style={{backgroundColor:'rgba(255,255,255,0.8)', padding:5,borderRadius:5}} onPress={playSound}>
          <AntDesign name="sound" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {

    let createDate = new Date(selectedDate);
    let year = createDate.getFullYear();
    let month = createDate.getMonth()+1;
    let date = createDate.getDate();
    let postDate = `${year}-${month}-${date}`;
    console.log("date for post get predict ->",postDate);

    const fetchData = async () => {
      setVisualData([]);
      setChartData([]);
        const http = 'http://Snorewise-env.eba-c5juuwae.us-east-1.elasticbeanstalk.com/getpredict';
        let jsonPayload = {
            'user_id': 2,
            'date': postDate
        };

        try {
            const response = await axios.post(http, jsonPayload);
            console.log(response.data.response.length);
            if(response.data.response.length > 0){
              const modelResults = response.data.response.map(item => JSON.parse(item.model_result));
              const cleanChartData = modelResults.flat().filter(value => !isNaN(value) && isFinite(value));
              
              setVisualData([response.data.response]);
              setChartData(cleanChartData);
            }
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    if(uid !== 0){fetchData()};
}, [selectedDate]);
  //just mockup dataset naja
  const secondsData = [ 0 ];
  console.log('chart data : ', chartData);
  // console.log('visual data : ',visualData);
 
  const totalSeconds = secondsData.length;
  const secondsInAnHour = 3600;
  const calculateTimestamp = (index) => {
    let d = new Date();
    const timestamp = new Date(selectedDate.getTime() + index * 1000);
    return timestamp.toLocaleTimeString();
  };
  // Adjust the interval based on data length
  let xLabelInterval;
  if (totalSeconds <= 60) {
    xLabelInterval = 10; // Display every 10 seconds if data is less than or equal to 60 seconds
  } else if (totalSeconds <= 3600) {
    xLabelInterval = 60; // Display every 1 minute if data is less than or equal to 1 hour
  } else {
    xLabelInterval = 1800; // Display every 30 minutes if data is longer than 1 hour
  }

  const xLabels = Array.from({ length: totalSeconds }).map((_, index) => {
    return index % xLabelInterval === 0 ? `${Math.floor(index / secondsInAnHour)}:${index % secondsInAnHour}s` : '';
  });

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(255, 208, 0, ${opacity})`,
    strokeWidth: 2,
    style: {
      paddingBottom: 0,
      paddingTop: 0,
    },
  };

  const calculateDuration = (timeStart, timeStop) => {
    const start = new Date(`1970-01-01T${timeStart}`);
    const stop = new Date(`1970-01-01T${timeStop}`);
    const durationInMilliseconds = stop - start;
    const durationInMinutes = durationInMilliseconds / (1000 * 60);
    return Math.round(durationInMinutes);
  };
  

  return (
    <ImageBackground source={bg} style={styles.container}>
      <View style={[styles.bglight, { height: 30, marginTop: 10, marginHorizontal: 10 }]}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', }}>
          {selectedDate ? selectedDate.toString().slice(0, -17) : 'None'}
        </Text>
      </View>
      <View >
        {/* linechart */}
        <ScrollView horizontal={true}>
          <View>
            <LineChart
              data={{
                labels: xLabels,
                datasets: [
                  {
                    data: chartData == 0 ? secondsData : chartData,
                    color: (opacity = 1) => `rgba(255, 208, 0, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={Math.max(Dimensions.get('window').width, totalSeconds * 10)}
              height={200}
              chartConfig={chartConfig}
              style={{ paddingTop: 10 }}
              formatYLabel={(value) => (value === 1 ? 'Snoring' : '')}
              yAxisInterval={1}
            />
          </View>
        </ScrollView>
        <FlatList
          style={{  marginBottom: 40 }}
          data={visualData[0]}
          renderItem={({ item }) => (
            <View style={styles.timestampContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, justifyContent: 'space-evenly'}}>
                <Text style={{ color: 'yellow', fontSize: 20, fontWeight: 'bold' }}>{item.time_start}</Text>
                <View>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: '500' }}>duration {calculateDuration(item.time_start, item.time_stop)} mins</Text>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: '500' }}>intensity {item.calls == null ? 0 : item.calls} times</Text>
                </View>
                {/* <TouchableOpacity style={{backgroundColor:'rgba(255,255,255,0.8)', padding:5,borderRadius:5}} onPress={SoundPlayer(item.path)}>
                <AntDesign name="sound" size={24} color="black" />
                </TouchableOpacity> */}
                <SoundPlayer soundFileUri={item.path} />
              </View>
              <View style={styles.separator} />
            </View>
          )}
        />
      </View>

      {/* Snore timestamp  ex. everytime dataset identify as snore sound*/}
      {/* <View style={styles.timestampContainer}>
          {secondsData.map((value, index) => {
            if (value === 1 && (index === 0 || secondsData[index - 1] === 0)) {
              // If it's the start of a continuous sequence of '1'
              const startTime = calculateTimestamp(index);
              let duration = 1;

              // Loop through subsequent elements to calculate the duration
              for (let i = index + 1; i < secondsData.length; i++) {
                if (secondsData[i] === 1) {
                  duration += 1;
                } else {
                  break;
                }
              }
              // if (duration > 1) { //if wwe want to show anything more than 1 sec
              return (
                <View>
                  <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={styles.timestampText}>{startTime}</Text>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={styles.durationText}>Duration: {duration} sec</Text>
                    </View>
                  </View>
                  <View style={styles.separator} />
                </View>
              );
              //}
            }
            return null; // If the current value is not 1 or the start of a sequence, return null
          })}
        </View> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#231E30',
    alignItems: 'stretch',
    paddingTop: 30,
  },
  separator: {
    height: 2,
    width: "90%",
    alignSelf: 'center',
    backgroundColor: "#fff",
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    margin: 10,
    height: '100%'
  },
  bglight: {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  timestampContainer: {
    flexDirection: 'column', // Arrange timestamps horizontally
    marginTop: 10,
    alignItems: 'stretch',
  },
  timestampText: {
    color: '#FFCE46',
    fontSize: 24,
    // textAlign:'left',
    marginLeft: 50,
    padding: 3,
    justifyContent: 'space-around',
  },
  durationText: {
    color: '#fff',
    fontSize: 24,
    // textAlign:'left',
    padding: 3,
    justifyContent: 'space-around',
  },
});