import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import FeatherIcons from '@expo/vector-icons/Feather';
import {Picker} from '@react-native-picker/picker';
import { generateTour } from '../../intelligence';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';

const theme = require("../../theme/index.json")

const CreateScreen = (props) => {
    const [selectedType, setSelectedType] = useState("walking");
    const [selectedDuration, setSelectedDuration] = useState(1);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedInterest, setSelectedInterest] = useState("");


    const [ isLoading, setIsLoading ] = useState(false);
    const createMap = async () => {
        try {
            
            /*try {
                const products = await Purchases.getProducts(["com.journeygenie_tour_v1"]);
                console.log("products", products);  
                const { transaction } = await Purchases.purchaseStoreProduct(products[0]);
            } catch (e) {
                console.log("error", e);
                alert("Purchase failed. Please try again.");
                return;
            }*/
            if(isLoading) return;
            setIsLoading(true);
            const prompt = `I want to have a ${selectedType} tour of ${selectedLocation} and I have ${selectedDuration} hours. I would like to learn about ${selectedInterest}`;
            const tour = await generateTour(prompt, { location: selectedLocation, duration: selectedDuration, interest: selectedInterest, type: selectedType });
            console.log("creating map ...", JSON.stringify(tour));
            const key = `${tour.title}:::${tour.imageUrl}`;
            await AsyncStorage.setItem(key, JSON.stringify(tour));
            props.onMapCreated(key);
            setIsLoading(false);
        } catch (e) {
            alert("Error creating tour. Please try again.");
            console.log("error", e);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (Platform.OS === 'ios') {
            //Purchases.configure({apiKey: "<revenuecat_project_apple_api_key>"});
         } else if (Platform.OS === 'android') {
            Purchases.configure({apiKey: "fd52ef4ad70b9ed372941bd03db6b0d957483608"});
         }
    }, [])


    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <TouchableOpacity style={{ paddingLeft: 10, paddingBottom: 24, paddingTop: 24 }} onPress={props.onBack}>
                    <FeatherIcons name="arrow-left" size={24} color={theme.primaryTextColor} />
                </TouchableOpacity>
                <View style={{ paddingLeft: 10, paddingRight: 10}}>
                    <Text style={{ fontSize: 48, fontWeight: 'bold', color: theme.primaryTextColor }}>I want to have a </Text>
                    <Picker
                        style={{ color: theme.primaryColor, fontSize: 48, fontWeight: 'bold', padding: 0, margin: 0 }}
                        selectedValue={selectedType}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedType(itemValue)
                        }>
                        <Picker.Item label="Walking" value="walking" style={{ fontSize: 48, fontWeight: 'bold', color: theme.primaryColor, padding: 0, margin: 0 }}/>
                        <Picker.Item label="Driving" value="driving" style={{ fontSize: 48, fontWeight: 'bold', color: theme.primaryColor }}/>
                    </Picker>
                    <Text style={{ fontSize: 48, fontWeight: 'bold', color: theme.primaryTextColor }}>tour of</Text>
                    <TextInput style={{ fontSize: 48, color: theme.primaryColor, borderBottomWidth: 1, borderBottomColor: theme.primaryColor }} onChangeText={(text) => setSelectedLocation(text)}/>
                    <Text style={{ fontSize: 48, fontWeight: 'bold', color: theme.primaryTextColor }}>and i have</Text>
                    <TextInput style={{ fontSize: 48, color: theme.primaryColor, borderBottomWidth: 1, borderBottomColor: theme.primaryColor }} keyboardType='decimal-pad' onChangeText={(text) => setSelectedDuration(text)}/>
                    <Text style={{ fontSize: 48, fontWeight: 'bold', color: theme.primaryTextColor }}>hours.</Text>
                    <Text style={{ fontSize: 48, fontWeight: 'bold', color: theme.primaryTextColor }}>I would like to learn about</Text>
                    <TextInput style={{ fontSize: 48, color: theme.primaryColor, borderBottomWidth: 1, borderBottomColor: theme.primaryColor }} onChangeText={(text) => setSelectedInterest(text)}/>

                </View>
                <TouchableOpacity style={{ backgroundColor: theme.primaryColor, padding: 10, marginTop: 24 }} onPress={createMap}>
                    {!isLoading?(<Text style={{ color: theme.primaryAccent, fontSize: 24, textAlign: 'center' }}>Make me a tour</Text>): (<Text style={{ color: theme.primaryAccent, fontSize: 24, textAlign: 'center' }}>Making a tour...</Text>)}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default CreateScreen;