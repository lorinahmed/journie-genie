import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, StyleSheet } from 'react-native';
import FeatherIcons from '@expo/vector-icons/Feather';
import {Picker} from '@react-native-picker/picker';
import { generateTour } from '../../intelligence';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';

const theme = require("../../theme/index.json")

const CreateScreen = (props) => {
    const [selectedType, setSelectedType] = useState("walking");
    const [selectedDuration, setSelectedDuration] = useState("1");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedInterest, setSelectedInterest] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const createMap = async () => {
        try {
            if(isLoading) return;
            setIsLoading(true);
            const prompt = `I want to have a ${selectedType} tour of ${selectedLocation} and I have ${selectedDuration} hours. I would like to learn about ${selectedInterest}`;
            const tour = await generateTour(prompt, { location: selectedLocation, duration: selectedDuration, interest: selectedInterest, type: selectedType });
            console.log("creating map ...", JSON.stringify(tour));
            const key = `${tour.title}:::${tour.imageUrl}`;
            await AsyncStorage.setItem(key, JSON.stringify(tour));
            props.onNewMapCreated(key);
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
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={props.onBack}>
                    <FeatherIcons name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Your Tour</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Form Card */}
                <View style={styles.formCard}>
                    <Text style={styles.cardTitle}>Tell us about your trip</Text>
                    
                    {/* Tour Type Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Tour Type</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedType}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSelectedType(itemValue)}
                            >
                                <Picker.Item label="🚶‍♂️ Walking Tour" value="walking" />
                                <Picker.Item label="🚗 Driving Tour" value="driving" />
                            </Picker>
                        </View>
                    </View>

                    {/* Location Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter city or destination"
                            placeholderTextColor="#9CA3AF"
                            value={selectedLocation}
                            onChangeText={setSelectedLocation}
                        />
                    </View>

                    {/* Duration Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Duration (hours)</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="e.g. 2.5"
                            placeholderTextColor="#9CA3AF"
                            value={selectedDuration}
                            onChangeText={setSelectedDuration}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    {/* Interest Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>What interests you?</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            placeholder="e.g. History, Art, Food, Architecture..."
                            placeholderTextColor="#9CA3AF"
                            value={selectedInterest}
                            onChangeText={setSelectedInterest}
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </View>

                {/* Create Button */}
                <TouchableOpacity 
                    style={[styles.createButton, isLoading && styles.createButtonDisabled]} 
                    onPress={createMap}
                    disabled={isLoading || !selectedLocation.trim() || !selectedInterest.trim()}
                >
                    <View style={styles.createButtonContent}>
                        {isLoading ? (
                            <>
                                <FeatherIcons name="loader" size={20} color="#FFFFFF" />
                                <Text style={styles.createButtonText}>Creating your tour...</Text>
                            </>
                        ) : (
                            <>
                                <FeatherIcons name="map" size={20} color="#FFFFFF" />
                                <Text style={styles.createButtonText}>Create My Tour</Text>
                            </>
                        )}
                    </View>
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#667eea',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        marginRight: 40, // Compensate for back button
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 24,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: '#1E293B',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1E293B',
        backgroundColor: '#F9FAFB',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    createButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    createButtonDisabled: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
        elevation: 0,
    },
    createButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    bottomSpacer: {
        height: 40,
    },
});

export default CreateScreen;