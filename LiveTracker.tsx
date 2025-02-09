import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';

const LiveTracker = ({ route }: { route: any }) => {
  const { donorLocation: initialDonorLocation, patientLocation } = route.params;
  const [donorLocation, setDonorLocation] = useState(initialDonorLocation);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    // Track donor's live location
    const watchId = Geolocation.watchPosition(
      (position) => {
        const updatedDonorLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setDonorLocation(updatedDonorLocation);

        // Update distance to the patient
        const calculatedDistance =
          getDistance(updatedDonorLocation, patientLocation) / 1000; // Convert to km
        setDistance(calculatedDistance);
      },
      (error) => {
        console.error('Error tracking donor location:', error);
        Alert.alert('Error', 'Failed to track donor location.');
      },
      { enableHighAccuracy: true, distanceFilter: 10 }
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [patientLocation]);

  if (!donorLocation) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Fetching donor location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: donorLocation.latitude,
          longitude: donorLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* Donor's Location Marker */}
        <Marker
          coordinate={donorLocation}
          title="Donor"
          description="Donor's Current Location"
          pinColor="green"
        />
        {/* Patient's Location Marker */}
        <Marker
          coordinate={patientLocation}
          title="Patient"
          description="Patient's Location"
          pinColor="red"
        />
        {/* Polyline for path between donor and patient */}
        <Polyline
          coordinates={[donorLocation, patientLocation]}
          strokeColor="blue" // Path color
          strokeWidth={4} // Path thickness
        />
      </MapView>
      {distance !== null && (
        <Text style={styles.text}>
          Distance to patient: {distance.toFixed(2)} km
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  text: {
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#FFF',
  },
});

export default LiveTracker;