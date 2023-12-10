import React, { useEffect } from "react";
import { Text, View, StyleSheet, Dimensions, ImageBackground, ScrollView, FlatList } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import CalendarPicker from 'react-native-calendar-picker';
import bg from '../assets/wave2layer.png';
//import recoil state
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentDate, currentUserId } from '../ApiState';
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from '@expo/vector-icons';



export default function Visualization() {
  //just mockup dataset naja
  const secondsData = [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0,
    1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0,
  ];

  const recordList = [
    {
      startTime: '12:00:00',
      calls: 7,
      duration: '10:00',
      file: 'sound'
    },
    {
      startTime: '12:00:00',
      calls: 7,
      duration: '10:00',
      file: 'sound'
    },
    {
      startTime: '12:00:00',
      calls: 7,
      duration: '10:00',
      file: 'sound'
    }
  ]


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



  const [selectedDate, setSelectedDate] = useRecoilState(currentDate);

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
                    data: secondsData,
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
          data={recordList}
          renderItem={({ item }) => (
            <View style={styles.timestampContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, justifyContent: 'space-evenly'}}>
                <Text style={{ color: 'yellow', fontSize: 20, fontWeight: 'bold' }}>{item.startTime}</Text>
                <View>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: '500' }}>duration {item.duration} mins</Text>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: '500' }}>intensity {item.calls} times</Text>
                </View>
                <TouchableOpacity style={{backgroundColor:'rgba(255,255,255,0.8)', padding:5,borderRadius:5}}>
                <AntDesign name="sound" size={24} color="black" />
                </TouchableOpacity>
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