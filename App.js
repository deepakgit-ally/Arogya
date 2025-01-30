import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import logo from './assets/images/logo.png';

import Login from './App/Scrren/Login';
import Dashboard from './App/Scrren/Dasbord';
import DoctorRegistration from './App/Scrren/DoctorRejstaion';

const Stack = createStackNavigator();

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Navigate to Login page after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <Image source={logo} style={styles.logo} />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login">
          {(props) => (
            <Login {...props} setLoggedIn={setIsLoggedIn} setUserName={setUserName} />
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Dashboard">
          {(props) => <Dashboard {...props} userName={userName} setLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="DoctorRegistration">
          {(props) => (
            <DoctorRegistration {...props} setLoggedIn={setIsLoggedIn} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});
