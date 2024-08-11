import { View, Text, ScrollView, TouchableOpacity, Button, StyleSheet, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

const FilterPlace = () => {
    const [location, setLocation] = useState('');
    const [street, setStreet] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const citiesInJordan = [
        {
            name: "Amman",
            coordinate: {
                long: 35.9271,
                lat: 31.9632,
            },
            places: [
                { name: "جبل عمان", lat: 31.9539, long: 35.9106 },
                { name: "الصويفية", lat: 31.9563, long: 35.8687 },
                { name: "خلدا", lat: 31.9744, long: 35.8436 },
            ],
        },
        {
            name: "Zarqa",
            coordinate: {
                long: 36.0230,
                lat: 32.0728,
            },
            places: [
                { name: "الرصيفة", lat: 32.0178, long: 36.0465 },
                { name: "الضليل", lat: 32.1082, long: 36.2002 },
            ],
        },
        {
            name: "Irbid",
            coordinate: {
                long: 35.8577,
                lat: 32.5568,
            },
            places: [
                { name: "الحصن", lat: 32.5574, long: 35.8525 },
                { name: "بيت راس", lat: 32.5644, long: 35.8765 },
            ],
        },
        // Add more cities and places as needed
    ];

    const filteredCities = citiesInJordan.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPlaces = location
        ? citiesInJordan
            .find((cityData) => cityData.name === location)
            .places.filter((place) =>
                place.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        : [];

    if (!location) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="ابحث عن مدينة"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Text style={styles.label}>اختر المدينة</Text>
                {filteredCities.map((cityData) => (
                    <TouchableOpacity key={cityData.name} onPress={() => setLocation(cityData.name)}>
                        <Text style={styles.item}>{cityData.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    }

    if (!street) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="ابحث عن منطقة"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Text style={styles.label}>اختر المنطقة في {location}</Text>
                {filteredPlaces.map((place) => (
                    <TouchableOpacity key={place.name} onPress={() => setStreet(place.name)}>
                        <Text style={styles.item}>{place.name}</Text>
                    </TouchableOpacity>
                ))}
                <View style={styles.buttonContainer}>
                    <Button title="الرجوع" onPress={() => setLocation('')} color={Colors.secondary} />
                    <View>
                        <Pressable onPress={() => {
                            router.navigate("/")
                        }} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>تطبيق الفلاتر</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F8F8F8',
    },
    label: {
        fontSize: 16,
        fontFamily: 'Droid Arabic Kufi',
        marginBottom: 8,
        color: '#333',
    },
    searchInput: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        fontFamily: 'Droid Arabic Kufi',
        marginBottom: 16,
        backgroundColor: '#FFF',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    spaceInput: {
        flex: 1,
        marginHorizontal: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: 'Droid Arabic Kufi',
    },
    buttonSelected: {
        backgroundColor: Colors.primary,
    },
    checkboxContainer: {
        backgroundColor: '#FFF',
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    checkboxText: {
        fontFamily: 'Droid Arabic Kufi',
        color: '#333',
    },
    item: {
        fontSize: 16,
        fontFamily: 'Droid Arabic Kufi',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    submitButtonText: {
        fontFamily: 'DroidArabicKufi',
        color: 'white',
    },
});

export default FilterPlace;
