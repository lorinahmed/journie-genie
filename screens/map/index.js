import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import FeatherIcons from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { getMoreDetails } from '../../intelligence';
//import { ElevenLabsClient, ElevenLabs } from "elevenlabs";

const theme = require("../../theme/index.json")


const MapScreen = (props) => {
    console.log("Map Screen",props.map);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [openLocation, setOpenLocation] = useState(null);
    const [openNarration, setOpenNarration] = useState(null);
    const [sound, setSound] = useState();
    const [played, setPlayed] = useState([]);
    const playedRef = useRef(played);
    const [isPlaying, setIsPlaying] = useState(false);
    const isPlayingRef = useRef(isPlaying);
    const [map, setMap] = useState({
        name: "",
        description: "",
        items: []
    });
    const mapRef = useRef(map);

    const [recording, setRecording] = useState(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [previousFollowons, setPreviousFollowons] = useState([]);
    const globalSound = useRef(null);


    const haversine = function (lat1, lon1, lat2, lon2) {
        // Convert latitude and longitude from degrees to radians
        const toRadians = (degrees) => degrees * (Math.PI / 180);
    
        lat1 = toRadians(lat1);
        lon1 = toRadians(lon1);
        lat2 = toRadians(lat2);
        lon2 = toRadians(lon2);
    
        // Haversine formula
        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;
        const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        // Radius of Earth in kilometers (mean radius)
        const R = 6371;
    
        // Distance in kilometers
        const distance = R * c;
    
        return distance;
    }


    const playTextToSpeech = async function(text) {
        await stopSound();
        console.log("Playing text to speech", isPlayingRef.current);
        if(isPlayingRef.current) return;
        isPlayingRef.current = true;
        try {
            console.log("Playing via google");
            //await playTextToSpeechEleven(text);
            await playTextToSpeechGoogle(text);
        }
        catch (error) {
            isPlayingRef.current = false;
        } finally {
        }


    }


    const playTextToSpeechEleven = async function(text) {

            try {
              // Generate audio file using ElevenLabs API
              const response = await axios({
                method: 'post',
                url: `https://api.elevenlabs.io/v1/text-to-speech/nPczCjzI2devNBz1zQrb`,
                headers: {
                  'Accept': 'audio/mpeg',
                  'xi-api-key': 'sk_1cfd58f57bee4a84c2fb13b1c4ee6929186872439622f039',
                  'Content-Type': 'application/json',
                },
                data: {
                  text: text,
                  model_id: 'eleven_multilingual_v2',
                  voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                  }
                },
                responseType: 'arraybuffer'
              });
              console.log("Response Received");
              // Save the audio file
              const fileUri = FileSystem.documentDirectory + 'tts_audio.mp3';
              await FileSystem.writeAsStringAsync(fileUri, response.data, { encoding: FileSystem.EncodingType.Base64 });
        
              // Load and play the audio
              globalSound.current = await Audio.Sound.createAsync({ uri: fileUri });
              
              await globalSound.current.playAsync();
            } catch (error) {
              console.error('Error generating or playing TTS:', error);
              alert('Failed to generate or play audio');
            } finally {
                console.log("Finally");
            }
    }

    const playTextToSpeechGoogle = async function(text) {
            const API_KEY = 'AIzaSyC6edean29-WhArhAyc48OtCoLUu63HNMs';
            const url = 'https://texttospeech.googleapis.com/v1/text:synthesize';
        
            try {
            // Request audio from Google TTS API
            const response = await axios.post(url, 
                {
                input: { text },
                voice: { name: 'en-US-Wavenet-J', languageCode: 'en-US' },
                audioConfig: { audioEncoding: 'MP3' },
                },
                {
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': API_KEY,
                },
                }
            );
        
            // Decode the base64 audio content
            const audioContent = response.data.audioContent;
            const audioUri = `data:audio/mp3;base64,${audioContent}`;
        
            isPlayingRef.current = true;

            await globalSound.current.loadAsync({ uri: audioUri });
            await globalSound.current.playAsync();
            globalSound.current.setOnPlaybackStatusUpdate(async (status) => {
                if (status.didJustFinish) {
                    await globalSound.current.unloadAsync();
                    isPlayingRef.current = false;
                    
                }
            });
        } catch (error) {
          console.error('Error playing text-to-speech:', error);
        }
    }


    const openNearestLocation = () => {
        (async () => {
            let map = mapRef.current;
            if(isPlayingRef.current) return;
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            for(let i = 0; i < map.items.length; i++) {
                const item = map.items[i];
                const distance = haversine(location.coords.latitude, location.coords.longitude, item.coordinates.lat, item.coordinates.lng);
                if (distance < 0.025 && !playedRef.current.includes(item.name)) {
                    setOpenLocation(item);
                    playTextToSpeech(item.description);
                    playedRef.current.push(item.name);
                    break;
                }
            }
        })();
    }

    const loadMap = async () => {

        try {
            const mapStr = await AsyncStorage.getItem(props.map);
            console.log("Map loaded", mapStr);
            setMap(JSON.parse(mapStr));
            mapRef.current = JSON.parse(mapStr);
            openNearestLocation();


            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }
        catch (error) {
            props.onBack();
        }
    
    };

    async function startListening() {
        setQuestion('');
        setAnswer('');
        try {
          await Audio.requestPermissionsAsync();
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
          console.log("Recording...", Audio.RecordingOptionsPresets.HighQuality);
          const { recording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HighQuality
          );
    
          setRecording(recording);
          setIsRecording(true);
        } catch (err) {
          console.error('Failed to start recording', err);
        }
      }
    
      async function stopListening() {
        setRecording(undefined);
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        await processAudio(uri);
      }
    
      async function processAudio(uri) {
        console.log('Processing audio', uri);
        try {
          const audioBytes = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          const response = await axios({
            method: 'post',
            url: `https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyC6edean29-WhArhAyc48OtCoLUu63HNMs`,
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
                config: {
                    encoding: 'AMR',
                    sampleRateHertz: 8000,
                    audioChannelCount: 1,
                    languageCode: 'en-US',
                  },
                  audio: {
                    content: audioBytes,
                  },
            },
          });
    
          console.log('API Response:', JSON.stringify(response.data));
          const data = response.data;
            console.log('Transcription:', JSON.stringify(data));

          if (data.results && data.results.length > 0) {
            const transcription = data.results
              .map(result => result.alternatives[0].transcript)
              .join('\n');
              console.log('Transcription:', transcription);
            setQuestion(transcription);
            const answer = await getMoreDetails(openLocation.description, transcription, previousFollowons);
            setAnswer(answer);
            playTextToSpeech(answer);
            setPreviousFollowons([...previousFollowons, { question: transcription, answer }]);
          } else {
            setQuestion('Unable to process your question. Please try again');
          }
        } catch (error) {
          setQuestion('Unable to process your question. Please try again.');
        }
      }

    const stopSound = async () => {
        try{
            await globalSound.current.unloadAsync();
            isPlayingRef.current = false;
        } catch (error) {

        }
    }

    useEffect(() => {
        loadMap();
        globalSound.current = new Audio.Sound();
        const interval = setInterval(() => {
            openNearestLocation();
        }, 10000);

        return () => {
            clearInterval(interval);
            stopSound();
        }

    }, []);

    console.log("Map", map);    

    return (
        <View style={styles.container}>
            
            {location && map && (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: map.items[0].coordinates.lat,
                        longitude: map.items[0].coordinates.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    
                    {map.items.map((item, index) => (
                        <Marker
                            coordinate={{
                            latitude: item.coordinates.lat,
                            longitude: item.coordinates.lng,
                            }}
                            title={item.name}
                            onPress={() => {
                                setOpenLocation(item);
                                playTextToSpeech(item.description);
                            }}
                        />                
                    ))}
                    
                    <Circle
                        center={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        }}
                        radius={50}
                        strokeWidth={1}
                        strokeColor="#fff"
                        fillColor="rgba(223, 3, 252, 0.5)"
                    />
                </MapView>
            )}
            <TouchableOpacity style={{ padding: 24, position: 'absolute', top: 0, left: 0, backgroundColor: "#fff",  }} onPress={() => {
                sound && sound.unloadAsync();
                props.onBack();
            }
            }>
                <FeatherIcons name="arrow-left" size={24} color={theme.primaryTextColor} />
            </TouchableOpacity>
            {openLocation ? (
                <ScrollView style={{ padding: 10, position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', backgroundColor: "#fff", borderTopColor: theme.primaryColor, borderTopWidth: 4 }}>
                    <TouchableOpacity  onPress={() => {
                        isPlayingRef.current = false;
                        try{ 
                            stopSound();
                        } catch (error) {
                        }
                        setOpenLocation(null);
                        setQuestion('');
                        setAnswer('');
                        setPreviousFollowons([]);
                    }}>
                        <FeatherIcons name="x" size={24} color={theme.primaryTextColor} />
                    </TouchableOpacity>
                    <Text style={{  fontSize: 32, fontWeight: 'bold', color: theme.primaryTextColor, borderTop: 10 }}> {openLocation.name} </Text>
                    <Text style={{  fontSize: 16, color: theme.primaryTextColor, borderTop: 5 }}> {openLocation.description} </Text>
                    <TouchableOpacity style={{ backgroundColor: theme.primaryColor, padding: 10, marginTop: 10, flexDirection: 'row' }} 
                    onPressIn={() => {
                        console.log("Listening...");
                        startListening();
                    }}
                    onPressOut={() => {
                        console.log("Stop listening...");
                        stopListening();
                    }}
                    >
                        <FeatherIcons name="headphones" size={24} color="#fff" />
                        <Text style={{ color: "#fff", marginLeft: 10 }}>Tap and hold to ask a follow on question</Text>
                    </TouchableOpacity>
                    {question && (
                        <Text style={{  fontSize: 16, color: theme.primaryTextColor, marginTop: 8, fontWeight: 'bold' }}> {question} </Text>
                    )}
                    {answer && (
                        <Text style={{  fontSize: 16, color: theme.primaryTextColor }}> {answer} </Text>
                    )}
                    <TouchableOpacity onPress={stopSound} style={{ borderColor: theme.primaryColor, padding: 8, borderWidth: 1, marginTop: 12, flexDirection: 'row'}}>
                        <FeatherIcons name="pause" size={24} color={theme.primaryColor} />
                        <Text style={{ color: theme.primaryColor, marginLeft: 12 }}>Shut up</Text>
                    </TouchableOpacity>

                    <View style={{ height: 100 }}></View>
                </ScrollView>
            ): null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default MapScreen;