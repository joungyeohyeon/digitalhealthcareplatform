//Fetch API was used for loading JSON file.

import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, FlatList, StyleSheet } from 'react-native';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Drkisong/Digital.Healthcare.Platform.PKNU/refs/heads/main/server_data/sampledata.json')
    .then((response) => response.json())
    .then((json) => setData(json))
    .catch((error) => console.error(error));   
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
    <View>
    <Text style={[styles.title ,{color :'blue', backgroundColor:'gold', padding:10,textAlign:'center'}]}>Healthcare data from JSON </Text>
    </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    <View>
    <Text style={{padding: 5, backgroundColor:'aqua', textAlign:'center'}}>Copyright 2024 'Slab@PKNU' All Right Reserved.</Text>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'pink',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 5,
    borderWidth: 2,
    elevation: 3,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default App;
