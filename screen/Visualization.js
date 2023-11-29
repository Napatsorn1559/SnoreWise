import React from "react";
import { Text, View, StyleSheet, Dimensions, ImageBackground, ScrollView } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import CalendarPicker from 'react-native-calendar-picker';
import bg from '../assets/wave2layer.png';

class Calendar extends React.Component {
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

      this.props.onDateChange(date);
  }

  render() {
      const { selectedStartDate } = this.state;

      return (
          <View style={{ marginBottom: 10 }}>
              <CalendarPicker textStyle={{ color: 'white' }} onDateChange={this.onDateChange} />
          </View>
      )
  }
}

export default function Visualization() {
  
  const secondsData = [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0,
    // 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0,0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
    // 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //  0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0,
  ];

  const totalSeconds = secondsData.length;
  const secondsInAnHour = 3600;
  const calculateTimestamp = (index) => {
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
    },
  };

  const [selectedDate, setSelectedDate] = React.useState(new Date());
    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

  return (
    <ImageBackground source={bg} style={styles.container}>
      <View>
      <View style={[styles.bglight, { height: 30 }]}>
        <Text style={{ color: 'white',fontSize: 16,fontWeight: 'bold',}}>
          {selectedDate ? selectedDate.toLocaleDateString() : 'None'}
        </Text>
      </View>
      {/* linechart */}
      <ScrollView horizontal={true}>
        <View style={styles.chartContainer}>
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
          height={220}
          chartConfig={chartConfig}
          style={{ paddingVertical: 10 }}
          formatYLabel={(value) => (value === 1 ? 'Snoring' : '')}
          yAxisInterval={1}
        />
        </View>
      </ScrollView>
      {/* Snore timestamp  ex. everytime dataset identify as snore sound*/}
      <View style={styles.timestampContainer}>
        {secondsData.map((value, index) => (
          value === 1 && (
            <View>
              <Text key={index} style={styles.timestampText}>
                {calculateTimestamp(index)}
              </Text>
              <View style={styles.seperator}/>
            </View>
          )
        ))}
      </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#231E30',
    alignItems: 'stretch',
    paddingTop: 80,
  },
    seperator: {
    height: 1,
    width: "60%",
    backgroundColor: "#FFCE46",
  },
  chartContainer: {
    flex: 1,
    alignItems: 'stretch',
    margin: 10,
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
    justifyContent: 'space-around', // Adjust spacing between timestamps
    marginTop: 10,
  },
  timestampText: {
    color: 'white',
    fontSize: 24,
    margin: 'auto',
    justifyContent: 'space-around',
  },
});