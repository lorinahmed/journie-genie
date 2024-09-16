import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const theme = require("../../theme/index.json")

const freeItems = [
    {"title":"\"Paris Unveiled: A Four-Hour Journey through Time and Hidden Treasures\"","imageUrl":"https://en.wikipedia.org/wiki/Paris#/media/File:Arc_de_Triomphe_HDR_2007.jpg","items":[{"name":"The Louvre Museum","description":"Hey Presto! and we're standing outside the Louvre, a royal palace turned world-class art museum. The Louvre is the world's largest art museum with a collection that would take over 100 days to view — that's if you spent 1 minute at each piece! The Louvre is also home to the enigmatic Mona Lisa, painted by da Vinci. But shh, don't tell anyone, a lesser-known fact is that there are actually three layers of different versions underneath the known image!","coordinates":{"lat":48.8606111,"lng":2.337644}},{"name":"Notre-Dame Cathedral","description":"Next stop, the Notre-Dame Cathedral. This stunning cathedral is an absolute masterpiece of French Gothic architecture. Just imagine, this cathedral took almost 200 years to build—talk about a DIY project! By the way, Notre-Dame is French for \"Our Lady,\" and with her intricate stained glass and heavenly choir, she sure knows how to make you feel welcome!","coordinates":{"lat":48.85296820000001,"lng":2.3499021}},{"name":"Montmartre","description":"From the hustle & bustle, we escape to the artistic heart of Paris, Montmartre. With its bohemian past and charming cobbled streets, you can imagine why famed artists like Picasso loved this place. And let's not forget the engraved \"I love you\" in 250 languages near the Abbesses métro station– now, that's amore! It's the perfect stop to soak up some inspiration and live life through rose-colored glasses.","coordinates":{"lat":48.8867148,"lng":2.3388895}},{"name":"The Latin Quarter","description":"Step into the vibrant labyrinth of the Latin Quarter. Once the intellectual hub of Paris where historical figures like Ernest Hemingway would discuss philosophy over a café au lait, is as vibrant as ever! Passing through narrow alleyways, medieval houses, and charming bookshops, we get a taste of Paris's rich history. Hidden Gem Alert: La Maison Marie-Curie, the former home and laboratory of Marie Curie is nestled right here!","coordinates":{"lat":48.85085369999999,"lng":2.3455566}},{"name":"Le Marais","description":"We swing by Le Marais, one of Paris's most historic and trendy districts. Think gorgeous masonry and lush courtyards dating back to the Middle Ages, punctuated by chic boutiques and street art. Stroll through Place des Vosges, the oldest planned square in Paris. And guess who lived at number 6? The famed author, Victor Hugo! Can you hear the Hunchback of Notre-Dame ringing those bells?","coordinates":{"lat":48.8612327,"lng":2.3581892}},{"name":"The Seine River","description":"And finally, an absolute must-do—a walk along the Seine River. Stroll down the banks of this iconic river, flanked by centuries-old buildings with a captivating allure. It's also the perfect place to hunt for your next read, with 'bouquinistes' setting up their green boxes to sell rare books and vintage posters. This place is so cherished by the locals, that in 1991, UNESCO declared it a World Heritage Site! Now isn't that a page-turner?","coordinates":{"lat":48.8575475,"lng":2.3513765}}]}
]

const HomeScreen = (props) => {

    const [ maps, setMaps ] = useState([]);

    const loadMaps = async () => { 
        const keys = await AsyncStorage.getAllKeys();
        setMaps(keys);
    }
    const updateFreeMaps = async () => {
        const keys = await AsyncStorage.getAllKeys();
        if (keys.length === 0) {
            freeItems.forEach(async (item) => {
                await AsyncStorage.setItem(`${item.title}:::${item.imageUrl}`, JSON.stringify(item));
            });
        }
    };
    useEffect(() => {
        console.log('Fetching maps...');
        updateFreeMaps().then(() => loadMaps());
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginTop: 24, color: theme.primaryAccent}}>Journey Genie</Text>
                <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 8, marginBottom: 24, marginLeft: 12, marginRight: 12, color: theme.primaryAccent }}>Create an audio tour for where you're travelling. Never miss interesting things on your visit. Journey Genie will talk about all the points you go past, in real time.</Text>
            </View>
            <View style={styles.gridContainer}>
                <TouchableOpacity style={styles.squareItemButton} onPress={ props.onNewMap }>
                    <Text style={styles.plusSymbol}>+</Text>
                </TouchableOpacity>

                {/*<TouchableOpacity style={styles.squareItem}>
                    <Image
                        source={require('path/to/image1.jpg')}
                        style={styles.squareBackground}
                    />
                    <Text style={styles.squareText}>Item 1</Text>
                </TouchableOpacity>
                */}
                {maps.map((map, index) => (<TouchableOpacity key={index} style={styles.squareItem} onPress={() => props.onMapSelected(map)}>
                    <Image
                        source={{ uri: map.split(":::")[1]}}
                        style={styles.squareBackground}
                    />
                    <Text style={styles.squareText}>{map.split(":::")[0]}</Text>
                </TouchableOpacity>))}
            </View>
            <View>
                <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 8, marginBottom: 24, marginLeft: 12, marginRight: 12, color: theme.primaryAccent }}>All tours on this app are generated by AI</Text>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.primaryColor,
    },
    headerImage: {
        width: '100%',
        height: 200,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    squareItem: {
        width: '50%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    squareItemButton: {
        width: '50%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.secondaryColor,
    },
    plusSymbol: {
        fontSize: 50,
        color: theme.primaryColor,
    },
    squareBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    squareText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default HomeScreen;