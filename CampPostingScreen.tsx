import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import database from '@react-native-firebase/database';

const CampPostingScreen = () => {
  const [formData, setFormData] = useState({
    campName: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    contact: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (
      !formData.campName ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.organizer ||
      !formData.contact
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await database()
        .ref('/user-camps')
        .push(formData);
      Alert.alert('Success', 'Blood donation camp posted successfully!');
      setFormData({
        campName: '',
        date: '',
        time: '',
        location: '',
        organizer: '',
        contact: '',
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to post camp. Please try again later.');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/back3.jpg')} // Replace with your image path
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Post a Blood Donation Camp</Text>

        <TextInput
          style={styles.input}
          placeholder="Camp Name"
          placeholderTextColor="#FFF"
          value={formData.campName}
          onChangeText={(value) => handleInputChange('campName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (e.g., 2024-12-31)"
          placeholderTextColor="#FFF"
          value={formData.date}
          onChangeText={(value) => handleInputChange('date', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Time (e.g., 10:00 AM)"
          placeholderTextColor="#FFF"
          value={formData.time}
          onChangeText={(value) => handleInputChange('time', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="#FFF"
          value={formData.location}
          onChangeText={(value) => handleInputChange('location', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Organizer"
          placeholderTextColor="#FFF"
          value={formData.organizer}
          onChangeText={(value) => handleInputChange('organizer', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          placeholderTextColor="#FFF"
          keyboardType="phone-pad"
          value={formData.contact}
          onChangeText={(value) => handleInputChange('contact', value)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Post Camp</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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

export default CampPostingScreen;
