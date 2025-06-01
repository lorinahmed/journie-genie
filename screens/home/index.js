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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Journey Genie</Text>
                    <Text style={styles.headerSubtitle}>
                        Discover amazing stories with AI-powered audio tours
                    </Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                {/* Create New Tour Card */}
                <TouchableOpacity style={styles.createCard} onPress={props.onNewMap}>
                    <View style={styles.createCardContent}>
                        <View style={styles.createIconContainer}>
                            <Text style={styles.createIcon}>+</Text>
                        </View>
                        <Text style={styles.createTitle}>Create New Tour</Text>
                        <Text style={styles.createSubtitle}>Build your custom audio experience</Text>
                    </View>
                </TouchableOpacity>

                {/* Tours Section */}
                {maps.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Your Tours</Text>
                        <View style={styles.toursContainer}>
                            {maps.map((map, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={styles.tourCard} 
                                    onPress={() => props.onMapSelected(map)}
                                >
                                    <Image
                                        source={{ uri: map.split(":::")[1] }}
                                        style={styles.tourImage}
                                    />
                                    <View style={styles.tourOverlay} />
                                    <View style={styles.tourContent}>
                                        <Text style={styles.tourTitle} numberOfLines={2}>
                                            {map.split(":::")[0]}
                                        </Text>
                                        <Text style={styles.tourLabel}>🎧 AI Generated</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>✨ All tours are powered by AI</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#667eea',
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 24,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 280,
    },
    content: {
        padding: 20,
        marginTop: -15,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: 600,
    },
    createCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    createCardContent: {
        padding: 24,
        alignItems: 'center',
        minHeight: 120,
        justifyContent: 'center',
    },
    createIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    createIcon: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '300',
    },
    createTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4,
    },
    createSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 16,
        marginTop: 8,
    },
    toursContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tourCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        position: 'relative',
    },
    tourImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    tourOverlay: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    tourContent: {
        padding: 12,
    },
    tourTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E293B',
        lineHeight: 17,
        marginBottom: 6,
    },
    tourLabel: {
        fontSize: 11,
        color: '#64748B',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: 16,
    },
    footerText: {
        fontSize: 14,
        color: '#64748B',
    },
});

export default HomeScreen;