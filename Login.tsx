import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ImageBackground 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  ForgotPassword: undefined;
  Information: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      const userId = auth().currentUser?.uid;

      if (userId) {
        const userRef = database().ref(`/users/${userId}`);
        const snapshot = await userRef.once('value');
        const profileCompleted = snapshot.val()?.profileCompleted;

        if (profileCompleted) {
          navigation.navigate('Dashboard'); // Navigate to Dashboard if profile is completed
        } else {
          navigation.navigate('Information'); // Navigate to Information if profile is incomplete
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/back4.webp')} // Replace with your image path
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Speed - Donor</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <Text style={styles.or}>or</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
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
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 45, textAlign: 'center' },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#fff', borderRadius: 15, padding: 20, marginBottom: 25 },
  button: { backgroundColor: '#fff', padding: 15, borderRadius: 50, alignItems: 'center', marginBottom: 35 },
  buttonText: { color: '#8A0917', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#fff', textAlign: 'center', marginBottom: 0 },
  or: { color: '#fff', textAlign: 'center', marginBottom: 0 },
});

export default Login;
