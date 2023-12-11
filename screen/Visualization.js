import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, ImageBackground, ScrollView, FlatList } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, FontAwesome } from '@expo/vector-icons';
//import backgroung image
import bg from '../assets/wave2layer.png';
//import recoil state
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentDate, currentUserId, totalCalls, totalSleeptime } from "../ApiState";
//import axios for using api method
import axios from "axios";
//import audio fot soundplay
import { Audio } from "expo-av";


export default function Visualization() {
  const uid = useRecoilValue(currentUserId);
  const selectedDate = useRecoilValue(currentDate);
  const [visualData, setVisualData] = React.useState([]);
  const [chartData, setChartData] = useState([]);

  //function for playing recorded sound 
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
        <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: 5, borderRadius: 5 }} onPress={playSound}>
          <AntDesign name="sound" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  //use effect when selected date or user id changed
  useFocusEffect(
    React.useCallback(() => {
    //reformat date for api post method
    let createDate = new Date(selectedDate);
    let year = createDate.getFullYear();
    let month = createDate.getMonth() + 1;
    let date = createDate.getDate();
    let postDate = `${year}-${month}-${date}`;

    //fetch api
    const fetchData = async () => {
      setVisualData([]);
      setChartData([]);
      const http = 'http://Snorewise-env.eba-c5juuwae.us-east-1.elasticbeanstalk.com/getpredict';
      let jsonPayload = {
        'user_id': uid,
        'date': postDate
      };

      try {
        const response = await axios.post(http, jsonPayload);
        if (response.data.response.length > 0) {
          //set data format
          const modelResults = response.data.response.map(item => JSON.parse(item.model_result));
          const cleanChartData = modelResults.flat().filter(value => !isNaN(value) && isFinite(value));

          setVisualData([response.data.response]);
          setChartData(cleanChartData);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    //check if it's not  defualt user id before fetchdata
    if (uid !== 0) { fetchData() };

  }, [selectedDate, uid])
  );

  //default dataset for line chart
  const secondsData = [0]

  // console.log('chart data : ', chartData);
  // console.log('visual data : ', visualData);

  //set chart range
  const totalSeconds = chartData.length;
  const secondsInAnHour = 3600;

  // Adjust the interval based on data length
  let xLabelInterval;
  if (totalSeconds <= 60) {
    xLabelInterval = 10; // Display every 10 seconds if data is less than or equal to 60 seconds
  } else if (totalSeconds <= 3600) {
    xLabelInterval = 60; // Display every 1 minute if data is less than or equal to 1 hour
  } else {
    xLabelInterval = 1800; // Display every 30 minutes if data is longer than 1 hour
  }

  //label for x axis
  const xLabels = Array.from({ length: totalSeconds }).map((_, index) => {
    return index % xLabelInterval === 0 ? `${Math.floor(index / secondsInAnHour)}:${index % secondsInAnHour}s` : '';
  });

  //set chart configure
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

  //function for calculate daration in minutes
  const calculateDuration = (timeStart, timeStop) => {
    const start = new Date(`1970-01-01T${timeStart}`);
    const stop = new Date(`1970-01-01T${timeStop}`);
    const durationInMilliseconds = stop - start;
    const durationInMinutes = durationInMilliseconds / (1000 * 60);
    return Math.round(durationInMinutes);
  };

  return (
    <ImageBackground source={bg} style={styles.container}>
      <View style={[styles.bglight, { height: 30, marginTop: 10, marginHorizontal: 10, flexDirection: 'row' }]}>
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
              style={{ paddingTop: 10, paddingBottom:10 }}
              formatYLabel={(value) => (value === 1 ? 'Snoring' : '')}
              yAxisInterval={1}
            />
          </View>
        </ScrollView>

        <FlatList
          style={{ marginBottom: 40 }}
          data={visualData[0]}
          renderItem={({ item }) => (
            <View style={styles.timestampContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, justifyContent: 'space-evenly' }}>
                <Text style={{ color: 'yellow', fontSize: 20, fontWeight: 'bold' }}>{item.time_start}</Text>
                <View>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: '500' }}>duration {calculateDuration(item.time_start, item.time_stop)} mins</Text>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: '500' }}>intensity {item.calls == null ? 0 : item.calls} times</Text>
                </View>
                {/* <SoundPlayer soundFileUri={item.path} /> */}
              </View>
              <View style={styles.separator} />
            </View>
          )}
        />
      </View>
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
    flexDirection: 'column',
    marginTop: 10,
    alignItems: 'stretch',
  },
  timestampText: {
    color: '#FFCE46',
    fontSize: 24,
    marginLeft: 50,
    padding: 3,
    justifyContent: 'space-around',
  },
  durationText: {
    color: '#fff',
    fontSize: 24,
    padding: 3,
    justifyContent: 'space-around',
  },
});