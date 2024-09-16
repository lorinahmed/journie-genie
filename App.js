import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/home';
import CreateScreen from './screens/create';
import MapScreen from './screens/map';

export default function App() {
  const [ screen, setScreen ] = useState('home');
  const [ map, setMap ] = useState(null);
  return (
    <View style={{flex : 1}}>
      {screen == "home"? <HomeScreen onNewMap={() => setScreen("create")} onMapSelected={(map) =>  { 
        setMap(map); 
        setScreen("map")
        }} />: null}
      {screen == "create"? <CreateScreen onBack={() => setScreen("home")} onNewMapCreated={(_map) => setScreen("map") && setMap(_map)} />: null}
      {screen == "map" && map? <MapScreen map={map} onBack={() => setScreen("home")}/>: null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
