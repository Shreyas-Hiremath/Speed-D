import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Information: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Information'>;

const { width } = Dimensions.get('window');

const diseasesList = [
  { id: '1', name: 'Diabetes' },
  { id: '2', name: 'Hypertension' },
  { id: '3', name: 'Cardiovascular Issues' },
  { id: '4', name: 'Hepatitis' },
  { id: '5', name: 'Other Chronic Diseases' },
];

const Information = () => {
  const navigation = useNavigation<NavigationProp>();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    weight: '',
    phone: '',
    bloodGroup: '',
    location: '',
    diseases: {} as { [key: string]: boolean },
    hasTattoo: false,
  });

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleDisease = (diseaseId: string) => {
    setFormData((prevState) => ({
      ...prevState,
      diseases: {
        ...prevState.diseases,
        [diseaseId]: !prevState.diseases[diseaseId],
      },
    }));
  };

  const toggleTattoo = () => {
    setFormData((prevState) => ({
      ...prevState,
      hasTattoo: !prevState.hasTattoo,
    }));
  };

  const handleSubmit = async () => {
    const userId = auth().currentUser?.uid;

    if (!userId) {
      Alert.alert('Error', 'Unable to get user information. Please log in again.');
      return;
    }

    try {
      await database()
        .ref(`/users/${userId}/profile`)
        .set(formData);

      await database()
        .ref(`/users/${userId}`)
        .update({ profileCompleted: true });

      Alert.alert('Success', 'Your information has been saved!');
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Database Error:', error);
      Alert.alert('Error', 'Failed to save data. Please try again later.');
    }
  };

  return (
    <ImageBackground
    source={require('./assets/back4.webp')}
    style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Complete Your Profile</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="First Name"
            placeholderTextColor="#FFF"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
          />
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="Middle Name"
            placeholderTextColor="#FFF"
            value={formData.middleName}
            onChangeText={(value) => handleInputChange('middleName', value)}
          />
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="Last Name"
            placeholderTextColor="#FFF"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Date of Birth (DD/MM/YYYY)"
          placeholderTextColor="#FFF"
          value={formData.dob}
          onChangeText={(value) => handleInputChange('dob', value)}
        />

        <View style={styles.genderRow}>
          <Text style={styles.genderText}>Gender</Text>
          <TouchableOpacity
            style={[styles.genderOption, formData.gender === 'Male' && styles.selectedOption]}
            onPress={() => handleInputChange('gender', 'Male')}
          >
            <Text style={styles.genderOptionText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderOption, formData.gender === 'Female' && styles.selectedOption]}
            onPress={() => handleInputChange('gender', 'Female')}
          >
            <Text style={styles.genderOptionText}>Female</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Weight (in Kgs)"
          placeholderTextColor="#FFF"
          keyboardType="numeric"
          value={formData.weight}
          onChangeText={(value) => handleInputChange('weight', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#FFF"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Blood Group (e.g., O+, A-)"
          placeholderTextColor="#FFF"
          value={formData.bloodGroup}
          onChangeText={(value) => handleInputChange('bloodGroup', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="City/Location"
          placeholderTextColor="#FFF"
          value={formData.location}
          onChangeText={(value) => handleInputChange('location', value)}
        />

        <Text style={styles.subHeader}>Select Diseases (if any):</Text>
        {diseasesList.map((disease) => (
          <View key={disease.id} style={styles.checkboxContainer}>
            <BouncyCheckbox
              isChecked={formData.diseases[disease.id] || false}
              text={disease.name}
              fillColor="#FFF"
              textStyle={styles.checkboxText}
              onPress={() => toggleDisease(disease.id)}
            />
          </View>
        ))}

        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={formData.hasTattoo}
            text="Do you have a tattoo?"
            fillColor="#FFF"
            textStyle={styles.checkboxText}
            onPress={toggleTattoo}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional overlay
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 15,
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
  smallInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 15,
  },
  genderText: {
    color: '#FFF',
    fontSize: 16,
    marginRight: 20,
  },
  genderOption: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFF',
    marginHorizontal: 10,
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  genderOptionText: {
    color: '#FFF',
  },
  checkboxContainer: {
    marginBottom: 10,
  },
  checkboxText: {
    color: '#FFF',
    textDecorationLine: 'none',
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

export default Information;
