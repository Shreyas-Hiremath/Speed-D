import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ImageBackground,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Profile from './profile';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  RequestBloodScreen: undefined;
  DonateScreen: undefined;
  BloodBankScreen: undefined;
  CampPostingScreen: undefined;
  Profile: undefined;
  Onlineinfo: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const Tab = createBottomTabNavigator<RootStackParamList>();

const Dashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unavailableUntil, setUnavailableUntil] = useState<Date | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth().currentUser?.uid;

        if (userId) {
          const userRef = database().ref(`/users/${userId}`);
          const snapshot = await userRef.once('value');
          const userData = snapshot.val();
          setUserFirstName(userData?.profile?.firstName || 'User');
          if (userData?.profile?.unavailableUntil) {
            setUnavailableUntil(new Date(userData.profile.unavailableUntil));
          }
        } else {
          setUserFirstName('User');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Unable to fetch user data. Please try again later.');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleDaysLeftPress = () => {
    if (unavailableUntil) {
      const currentDate = new Date();
      const timeDiff = unavailableUntil.getTime() - currentDate.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysLeft > 0) {
        Alert.alert(
          'Days Left',
          `You will be available for donation in 30 day(s).`
        );
      } else {
        Alert.alert('Info', 'You are already available for donation.');
      }
    } else {
      Alert.alert('Info', 'You are currently available for donation.');
    }
  };

  const openGoogleMaps = () => {
    const mapsUrl = 'https://www.google.com/maps/search/blood+banks+near+me/';
    Linking.openURL(mapsUrl).catch(err =>
      console.error('Failed to open Google Maps:', err)
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#FFF',
        tabBarStyle: {
          paddingBottom: 15,
          paddingTop: 5,
          height: 70,
          backgroundColor: '#520203',
          borderTopWidth: 2,
          borderTopColor: '#8A0917',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <Image
              source={require('./assets/home.png')}
              style={styles.tabIcon}
            />
          ),
        }}
      >
        {() => (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                Welcome , {userFirstName || 'User'}
              </Text>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : (
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ImageBackground
                  source={require('./assets/back5.jpg')}
                  style={styles.card}
                  imageStyle={styles.cardBackgroundImage}
                >
                  <TouchableOpacity
                    style={styles.touchableCardContent}
                    onPress={() => navigation.navigate('RequestBloodScreen')}
                  >
                    <Image
                      source={require('./assets/image2.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.cardText}>Request for Blood</Text>
                  </TouchableOpacity>
                </ImageBackground>

                <ImageBackground
                  source={require('./assets/back5.jpg')}
                  style={styles.card}
                  imageStyle={styles.cardBackgroundImage}
                >
                  <TouchableOpacity
                    style={styles.touchableCardContent}
                    onPress={() => navigation.navigate('DonateScreen')}
                  >
                    <Image
                      source={require('./assets/image4.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.cardText}>Donate</Text>
                  </TouchableOpacity>
                </ImageBackground>

                <ImageBackground
                  source={require('./assets/back5.jpg')}
                  style={styles.card}
                  imageStyle={styles.cardBackgroundImage}
                >
                  <TouchableOpacity
                    style={styles.touchableCardContent}
                    onPress={() => openGoogleMaps()}
                  >
                    <Image
                      source={require('./assets/image.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.cardText}>Blood Banks Near Me</Text>
                  </TouchableOpacity>
                </ImageBackground>

                <ImageBackground
                  source={require('./assets/back5.jpg')}
                  style={styles.card}
                  imageStyle={styles.cardBackgroundImage}
                >
                  <TouchableOpacity
                    style={styles.touchableCardContent}
                    onPress={handleDaysLeftPress}
                  >
                    <Image
                      source={require('./assets/image1.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.cardText}>
                      Days left before next Donation
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>

                <ImageBackground
                  source={require('./assets/back5.jpg')}
                  style={styles.card}
                  imageStyle={styles.cardBackgroundImage}
                >
                  <TouchableOpacity
                    style={styles.touchableCardContent}
                    onPress={() => navigation.navigate('CampPostingScreen')}
                  >
                    <Image
                      source={require('./assets/image5.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.cardText}>Blood Donation Camps</Text>
                  </TouchableOpacity>
                </ImageBackground>

                <ImageBackground
                  source={require('./assets/back5.jpg')}
                  style={styles.card}
                  imageStyle={styles.cardBackgroundImage}
                >
                  <TouchableOpacity
                    style={styles.touchableCardContent}
                    onPress={() => navigation.navigate('Onlineinfo')}
                  >
                    <Image
                      source={require('./assets/image7.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.cardText}>
                      Blood Type and Compatibility
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              </ScrollView>
            )}
          </View>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => (
            <Image
              source={require('./assets/person.png')}
              style={styles.tabIcon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#520203',
    padding: 17,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 20,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: '#8A0917',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  card: {
    width: '98%',
    height: 180,
    marginBottom: 5,
    marginLeft: 7,
    borderRadius: 10,
    alignSelf: 'center',
    overflow: 'hidden',
    elevation: 0,
  },
  cardBackgroundImage: {
    borderRadius: 10,
    opacity: 1,
  },
  touchableCardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  cardText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    margin: 5,
    lineHeight: 18,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
});

export default Dashboard;
