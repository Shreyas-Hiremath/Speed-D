import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

type DiseasesType = {
  [key: string]: boolean;
};

const diseasesList = [
  { id: '1', name: 'Diabetes' },
  { id: '2', name: 'Hypertension' },
  { id: '3', name: 'Cardiovascular Issues' },
  { id: '4', name: 'Hepatitis' },
  { id: '5', name: 'Other Chronic Diseases' },
];

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    middleName: string;
    dob: string;
    gender: string;
    bloodGroup: string;
    location: string;
    phone: string;
    weight: string;
    availableForDonation: boolean;
    diseases: DiseasesType;
    sickLast30Days: boolean;
    hasTattoo: boolean;
  }>({
    firstName: '',
    lastName: '',
    middleName: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    location: '',
    phone: '',
    weight: '',
    availableForDonation: false,
    diseases: {},
    sickLast30Days: false,
    hasTattoo: false,
  });

  const userId = auth().currentUser?.uid;

  useEffect(() => {
    if (userId) {
      const userRef = database().ref(`/users/${userId}`);
      userRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.profile) {
          setUserData(data.profile);
        }
      });
    }
  }, [userId]);

  const updateProfile = () => {
    if (userId) {
      const userRef = database().ref(`/users/${userId}/profile`);
      userRef
        .update(userData)
        .then(() => {
          Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          Alert.alert('Update Failed', 'An error occurred while updating your profile.');
        });
    }
  };

  const toggleDonationAvailability = () => {
    const hasAnyDisease = Object.values(userData.diseases || {}).some((value) => value);

    if (hasAnyDisease || userData.sickLast30Days || userData.hasTattoo) {
      Alert.alert(
        'Not Allowed',
        'You cannot enable donation availability under the current conditions.'
      );
      return;
    }

    setUserData((prevState) => ({
      ...prevState,
      availableForDonation: !prevState.availableForDonation,
    }));
  };

  const toggleDisease = (diseaseId: string) => {
    setUserData((prevState) => {
      const updatedDiseases = {
        ...(prevState.diseases || {}),
        [diseaseId]: !prevState.diseases?.[diseaseId],
      };

      const hasAnyDisease = Object.values(updatedDiseases).some((value) => value);

      return {
        ...prevState,
        diseases: updatedDiseases,
        availableForDonation:
          hasAnyDisease || prevState.sickLast30Days || prevState.hasTattoo
            ? false
            : prevState.availableForDonation,
      };
    });
  };

  const toggleSickLast30Days = () => {
    setUserData((prevState) => ({
      ...prevState,
      sickLast30Days: !prevState.sickLast30Days,
      availableForDonation: !prevState.sickLast30Days
        ? false
        : prevState.availableForDonation,
    }));
  };

  const toggleHasTattoo = () => {
    setUserData((prevState) => ({
      ...prevState,
      hasTattoo: !prevState.hasTattoo,
      availableForDonation: !prevState.hasTattoo
        ? false
        : prevState.availableForDonation,
    }));
  };

  return (
    <ImageBackground
      source={require('./assets/white.webp')} // Replace with the path to your image
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={userData.firstName}
          onChangeText={(text) => setUserData({ ...userData, firstName: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Middle Name"
          value={userData.middleName}
          onChangeText={(text) => setUserData({ ...userData, middleName: text })}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={userData.lastName}
          onChangeText={(text) => setUserData({ ...userData, lastName: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Date of Birth"
          value={userData.dob}
          onChangeText={(text) => setUserData({ ...userData, dob: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={userData.gender}
          onChangeText={(text) => setUserData({ ...userData, gender: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Blood Group"
          value={userData.bloodGroup}
          onChangeText={(text) => setUserData({ ...userData, bloodGroup: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={userData.location}
          onChangeText={(text) => setUserData({ ...userData, location: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={userData.phone}
          onChangeText={(text) => setUserData({ ...userData, phone: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Weight"
          value={userData.weight}
          onChangeText={(text) => setUserData({ ...userData, weight: text })}
        />

        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={userData.sickLast30Days}
            text="Have you been sick in the last 30 days?"
            fillColor="#8A0917"
            textStyle={styles.checkboxText}
            onPress={toggleSickLast30Days}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={userData.hasTattoo}
            text="Do you have a tattoo?"
            fillColor="#8A0917"
            textStyle={styles.checkboxText}
            onPress={toggleHasTattoo}
          />
        </View>

        <Text style={styles.subTitle}>Select Diseases (if any):</Text>
        {diseasesList.map((disease) => (
          <View key={disease.id} style={styles.checkboxContainer}>
            <BouncyCheckbox
              isChecked={userData.diseases?.[disease.id] || false}
              text={disease.name}
              fillColor="#8A0917"
              textStyle={styles.checkboxText}
              onPress={() => toggleDisease(disease.id)}
            />
          </View>
        ))}

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Available for Donation:</Text>
          <Switch
            value={userData.availableForDonation}
            onValueChange={toggleDonationAvailability}
            thumbColor={userData.availableForDonation ? '#8A0917' : '#F2F2F2'}
            trackColor={{ false: '#D3D3D3', true: '#8A0917' }}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={updateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adds a semi-transparent overlay for readability
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#FFF',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 18,
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 25,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginVertical: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 16,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#520203',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;