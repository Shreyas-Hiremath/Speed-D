import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ImageBackground 
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';

const { width } = Dimensions.get('window');

const RequestBloodScreen = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    hospitalName: '',
    bloodGroup: '',
    unitsRequired: '',
    contactNumber: '',
    location: '',
  });

  const [patientLocation, setPatientLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const requestPatientLocation = async () => {
    setLoading(true);

    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPatientLocation({ latitude, longitude });
          handleInputChange('location', `Lat: ${latitude}, Long: ${longitude}`);
          Alert.alert('Location captured successfully.');
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error.code, error.message);
          switch (error.code) {
            case 1:
              Alert.alert('Permission Denied', 'Please enable location permissions.');
              break;
            case 2:
              Alert.alert('Position Unavailable', 'Unable to detect location.');
              break;
            case 3:
              Alert.alert('Timeout', 'Location request timed out.');
              break;
            default:
              Alert.alert('Error', 'Failed to capture location.');
          }
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.error('Error requesting location authorization:', error);
      Alert.alert('Error', 'Failed to request location authorization.');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.patientName ||
      !formData.hospitalName ||
      !formData.bloodGroup ||
      !formData.unitsRequired ||
      !formData.contactNumber ||
      !formData.location ||
      !patientLocation
    ) {
      Alert.alert('Error', 'Please fill in all fields and capture your location.');
      return;
    }

    try {
      const newRequestRef = database().ref('/requests').push();
      await newRequestRef.set({
        ...formData,
        patientLocation,
        timestamp: database.ServerValue.TIMESTAMP,
      });

      Alert.alert('Success', 'Your blood request has been submitted!');
      setFormData({
        patientName: '',
        hospitalName: '',
        bloodGroup: '',
        unitsRequired: '',
        contactNumber: '',
        location: '',
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/back3.jpg')} // Replace with your image path
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.header}>Request for Blood</Text>

        <TextInput
          style={styles.input}
          placeholder="Patient Name"
          placeholderTextColor="#FFF"
          value={formData.patientName}
          onChangeText={(value) => handleInputChange('patientName', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Hospital Name"
          placeholderTextColor="#FFF"
          value={formData.hospitalName}
          onChangeText={(value) => handleInputChange('hospitalName', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Blood Group"
          placeholderTextColor="#FFF"
          value={formData.bloodGroup}
          onChangeText={(value) => handleInputChange('bloodGroup', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Units Required"
          placeholderTextColor="#FFF"
          keyboardType="numeric"
          value={formData.unitsRequired}
          onChangeText={(value) => handleInputChange('unitsRequired', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          placeholderTextColor="#FFF"
          keyboardType="phone-pad"
          value={formData.contactNumber}
          onChangeText={(value) => handleInputChange('contactNumber', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="#FFF"
          value={formData.location}
          editable={false}
        />

        <TouchableOpacity style={styles.button} onPress={requestPatientLocation} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Capturing...' : 'Capture Location'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Request</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#8A0917',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RequestBloodScreen;
