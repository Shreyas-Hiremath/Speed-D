import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Linking, 
  ImageBackground 
} from 'react-native';
import database from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';

interface BloodRequest {
  id: string;
  patientName: string;
  hospitalName: string;
  bloodGroup: string;
  unitsRequired: string;
  contactNumber: string;
  location: string;
  patientLocation: { latitude: number; longitude: number };
  successfullyDonated?: boolean;
}

interface Camp {
  id: string;
  campName: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  contact: string;
}

const DonateScreen = ({ navigation }: { navigation: any }) => {
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);

  useEffect(() => {
    const fetchBloodRequests = database()
      .ref('/requests')
      .on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedData = Object.keys(data)
            .map((key) => ({ id: key, ...data[key] }))
            .filter((request) => !request.successfullyDonated); // Filter pending requests
          setBloodRequests(formattedData);
        } else {
          setBloodRequests([]);
        }
      });

    return () => {
      database().ref('/requests').off('value', fetchBloodRequests);
    };
  }, []);

  useEffect(() => {
    const fetchCamps = database()
      .ref('/user-camps')
      .on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setCamps(formattedData);
        } else {
          setCamps([]);
        }
      });

    return () => {
      database().ref('/user-camps').off('value', fetchCamps);
    };
  }, []);

  const handleDonorLocation = (patientLocation: { latitude: number; longitude: number }) => {
    if (!patientLocation) {
      Alert.alert('Error', 'Patient location not available.');
      return;
    }
  
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          const donorLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
  
          // Set unavailableUntil to 30 days from now
          const unavailableUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;
  
          // Save donor, patient locations, and unavailableUntil to database
          const locationData = {
            donorLocation,
            patientLocation,
            unavailableUntil,
            timestamp: new Date().toISOString(),
          };
  
          await database().ref('/donations').push(locationData);
  
          // Redirect to Google Maps
          const { latitude, longitude } = patientLocation;
          const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
  
          Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'Unable to open maps. Please try again.')
          );
        } catch (error) {
          console.error('Error saving location:', error);
          Alert.alert('Error', 'Failed to save location. Please try again.');
        }
      },
      (error) => {
        console.error('Error fetching donor location:', error);
        Alert.alert('Error', 'Failed to fetch donor location. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  

  const markAsDonated = (id: string) => {
    database()
      .ref(`/requests/${id}`)
      .update({ successfullyDonated: true })
      .then(() => {
        Alert.alert('Success', 'Donation marked as successful.');
      })
      .catch((error) => {
        console.error('Error updating donation status:', error);
        Alert.alert('Error', 'Failed to mark as donated. Please try again.');
      });
  };

  const renderBloodRequest = ({ item }: { item: BloodRequest }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Request for {item.bloodGroup} Blood</Text>
      <Text style={styles.cardText}>Patient: {item.patientName}</Text>
      <Text style={styles.cardText}>Hospital: {item.hospitalName}</Text>
      <Text style={styles.cardText}>Units Required: {item.unitsRequired}</Text>
      <Text style={styles.cardText}>Contact: {item.contactNumber}</Text>
      <Text style={styles.cardText}>Location: {item.location}</Text>
  
      <TouchableOpacity onPress={() => handleDonorLocation(item.patientLocation)}>
        <Text style={[styles.cardText, { color: '#FF1' }]}>Donate Here</Text>
      </TouchableOpacity>
  
      <TouchableOpacity
        onPress={async () => {
          try {
            const snapshot = await database()
              .ref('/donations')
              .orderByChild('patientLocation/latitude')
              .equalTo(item.patientLocation.latitude)
              .once('value');
            const data = snapshot.val();
  
            if (data) {
              const donation = Object.values(data)[0] as {
                donorLocation: { latitude: number; longitude: number };
                patientLocation: { latitude: number; longitude: number };
              };
  
              navigation.navigate('LiveTracker', {
                donorLocation: donation.donorLocation,
                patientLocation: item.patientLocation,
              });
            } else {
              Alert.alert('Error', 'No donor location found for this request.');
            }
          } catch (error) {
            console.error('Error fetching donor location:', error);
            Alert.alert('Error', 'Failed to fetch donor location.');
          }
        }}
      >
        <Text style={[styles.cardText, { color: '#00F', marginTop: 10 }]}>
          Track Live
        </Text>
      </TouchableOpacity>
  
      {/* Mark as Donated Button */}
      <TouchableOpacity onPress={() => markAsDonated(item.id)}>
        <Text style={[styles.cardText, { color: '#4CAF50', marginTop: 10 }]}>
          Mark as Donated
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCamp = ({ item }: { item: Camp }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.campName}</Text>
      <Text style={styles.cardText}>Date: {item.date}</Text>
      <Text style={styles.cardText}>Time: {item.time}</Text>
      <Text style={styles.cardText}>Location: {item.location}</Text>
      <Text style={styles.cardText}>Organizer: {item.organizer}</Text>
      <Text style={styles.cardText}>Contact: {item.contact}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('./assets/back3.jpg')} // Replace with your image path
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Blood Donation Requests</Text>
        <FlatList
          data={bloodRequests}
          renderItem={renderBloodRequest}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No requests available.</Text>}
        />

        <Text style={[styles.header, { marginTop: 30 }]}>Blood Donation Camps</Text>
        <FlatList
          data={camps}
          renderItem={renderCamp}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No camps available.</Text>}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: { flex: 1, padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.15)' },
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 10, marginLeft: 5, color: '#FFF' },
  card: { padding: 10, marginVertical: 5, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  cardText: { fontSize: 14, color: '#FFF', fontWeight: '500', marginBottom: 5 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#FFF' },
});

export default DonateScreen;
