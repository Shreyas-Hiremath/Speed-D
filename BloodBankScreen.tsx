import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

interface BloodBank {
  id: string;
  name: string;
  address: string;
  location: { latitude: number; longitude: number };
}

const BloodBankScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);

  useEffect(() => {
    // Fetch current location
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error fetching current location:', error);
        Alert.alert('Error', 'Unable to fetch current location.');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  useEffect(() => {
    if (!currentLocation) return;

    // Dummy data for blood banks
    const allBloodBanks: BloodBank[] = [
      { id: '1', name: 'City Blood Bank', address: '123 Main St', location: { latitude: 40.7128, longitude: -74.0060 } },
      { id: '2', name: 'Downtown Blood Bank', address: '456 Elm St', location: { latitude: 40.7306, longitude: -73.9352 } },
      { id: '3', name: 'Uptown Blood Bank', address: '789 Oak St', location: { latitude: 40.7061, longitude: -74.0115 } },
      // Additional blood banks can be added here
    ];

    // Filter blood banks by proximity to the current location
    const filteredBloodBanks = allBloodBanks.filter(bank => {
      const distance = getDistance(
        { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
        bank.location
      );
      return distance <= 5000; // show only blood banks within 5 km
    });

    setBloodBanks(filteredBloodBanks);
  }, [currentLocation]);

  // Function to calculate distance between two coordinates
  const getDistance = (start: { latitude: number, longitude: number }, end: { latitude: number, longitude: number }): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = toRadians(end.latitude - start.latitude);
    const dLon = toRadians(end.longitude - start.longitude);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(start.latitude)) * Math.cos(toRadians(end.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const toRadians = (angle: number) => {
    return angle * (Math.PI / 180);
  };

  const renderBloodBank = ({ item }: { item: BloodBank }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardText}>{item.address}</Text>
      <TouchableOpacity
        onPress={() => {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${item.location.latitude},${item.location.longitude}&travelmode=driving`;
          Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open maps.'));
        }}
      >
        <Text style={[styles.cardText, { color: '#00F', marginTop: 10 }]}>Navigate to Location</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: currentLocation?.latitude || 0,
        longitude: currentLocation?.longitude || 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {bloodBanks.map((bank) => (
        <Marker
          key={bank.id}
          coordinate={bank.location}
          title={bank.name}
          description={bank.address}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  card: { padding: 10, marginVertical: 5, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  cardText: { fontSize: 14, color: '#FFF', fontWeight: '500', marginBottom: 5 },
});

export default BloodBankScreen;
