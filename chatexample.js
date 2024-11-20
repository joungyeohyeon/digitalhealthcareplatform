//"Package.json" @React native, Snacks-Expo
//Before use this code, please install these package on the package.json.
/*{
  "dependencies": {
    "react-native-chart-kit": "6.12.0",
    "react-native-svg": "15.2.0"
  }
}*/

import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Dimensions, FlatList, ScrollView } from 'react-native';
import {LineChart} from "react-native-chart-kit";

const App = () => {
  const [data, setData] = useState(null);

  // Fetch JSON data from GitHub on load
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Drkisong/Digital.Healthcare.Platform.PKNU/refs/heads/main/server_data/healthdata_vital.JSON')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  // Function to format heart rate data for the chart
  const getHeartRateData = () => {
    if (!data) return { labels: [], datasets: [{ data: [] }] };

    const heartRateValues = data.patients[1].vitalSigns.heartRate; // Get data from the first patient as an example
    return {
      labels: heartRateValues.map((_, index) => `Day ${index + 1}`),
      datasets: [
        {
          data: heartRateValues,
        },
      ],
    };
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name} </Text>
      <Text style={styles.subtitle}>Age: {item.age}, Gender: {item.gender}</Text>
      <Text style={styles.paragraph}> Heartrate:
        {item.vitalSigns.heartRate[0]}, {item.vitalSigns.heartRate[1]}, {item.vitalSigns.heartRate[2]}, {item.vitalSigns.heartRate[3]}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: 'lightgreen' }}>
        <Text style={styles.title}>Healthcare Data with Chart</Text>
      </View>

      <ScrollView>
        <FlatList
          data={data ? data.patients : []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </ScrollView>

      {data ? (
        <View style={styles.card}>
          <Text style={styles.title}>Heart Rate Line Chart</Text>
          <Text style={styles.subtitle}>Patient: {data.patients[1].name}</Text> 

          <LineChart
            data={getHeartRateData()}
            width={Dimensions.get('window').width}
            height={220}
            yAxisSuffix="bpm"
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.loading}>Loading data...</Text>
      )}

    <View>
    <Text style={{padding: 5, backgroundColor:'aqua', textAlign:'center'}}>Copyright 2024 'Slab@PKNU' All Right Reserved.</Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  paragraph: {
    margin: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    padding: 10,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'blue',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  chart: {         
    borderRadius: 5,
    margin:10,
    alignItems:'center'
  },
  loading: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  card: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 10,
    margin:3,
    borderWidth: 2,
    elevation: 3,
  },
});

export default App;
