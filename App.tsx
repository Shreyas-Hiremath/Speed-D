import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Register from './RegisterScreen';
import Dashboard from './Dashboard';
import RequestBloodScreen from './RequestBloodScreen';
import DonateScreen from './DonateScreen';
import LiveTracker from './LiveTracker';
import ForgotPassword from './ForgotPassword';
import Information from './Information';
import CampPostingScreen from './CampPostingScreen';
import { enableScreens } from 'react-native-screens';
import Profile from './profile';
import Onlineinfo from './onlineinfo';
import BloodBankScreen from './BloodBankScreen';
import VideoSplashScreen from './VideoSplashScreen';

enableScreens(); // Enable screens for better performance

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  RequestBloodScreen: undefined;
  DonateScreen: undefined;
  LiveTracker: undefined;
  ForgotPassword: undefined;
  Information: undefined;
  CampPostingScreen: undefined;
  Profile: undefined;
  Onlineinfo: undefined;
  BloodBankScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  const handleSplashFinish = () => {
    setIsSplashFinished(true); // Mark the splash screen as finished
  };

  if (!isSplashFinished) {
    return <VideoSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="RequestBloodScreen" component={RequestBloodScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonateScreen" component={DonateScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LiveTracker" component={LiveTracker} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Information" component={Information} options={{ headerShown: false }} />
        <Stack.Screen name="CampPostingScreen" component={CampPostingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Onlineinfo" component={Onlineinfo} options={{ headerShown: false }} />
        <Stack.Screen name="BloodBankScreen" component={BloodBankScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
