import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard({ userName = 'User', setLoggedIn, navigation  }) {
  const [slideAnim] = useState(new Animated.Value(-500)); // Initial off-screen position for menu
  const [menuVisible, setMenuVisible] = useState(false);

  // Slide-in animation for menu
  useEffect(() => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to 0 (fully visible)
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -500, // Slide back off-screen
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [menuVisible]);

  // Handle Logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setLoggedIn(false); // Set logged-in status to false
            navigation.replace('Login'); // Navigate to the Login screen
          },
        },
      ]
    );
  };
  

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => setMenuVisible(!menuVisible)}>
          <Ionicons name="menu-outline" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="notifications-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Sliding Menu */}
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.menuItem}>
          <Ionicons name="medkit-outline" size={30} color="#000" />
          <Text style={styles.menuText}>Doctor Consultation</Text>
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="car-sport-outline" size={30} color="#000" />
          <Text style={styles.menuText}>Ambulance</Text>
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="flask-outline" size={30} color="#000" />
          <Text style={styles.menuText}>Labs</Text>
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="medical-outline" size={30} color="#000" />
          <Text style={styles.menuText}>Medicine</Text>
        </View>
        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>

      {/* Service Boxes */}
      <View style={styles.serviceBoxContainer}>
        <View style={styles.serviceBox}>
          <Ionicons name="medkit-outline" size={40} color="#000" />
          <Text style={styles.serviceText}>Doctor Consultation</Text>
        </View>
        <View style={styles.serviceBox}>
          <Ionicons name="car-sport-outline" size={40} color="#000" />
          <Text style={styles.serviceText}>Ambulance</Text>
        </View>
        <View style={styles.serviceBox}>
          <Ionicons name="flask-outline" size={40} color="#000" />
          <Text style={styles.serviceText}>Labs</Text>
        </View>
        <View style={styles.serviceBox}>
          <Ionicons name="medical-outline" size={40} color="#000" />
          <Text style={styles.serviceText}>Medicine</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20, // Adjusted for better layout
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: 50,
  
  },
  iconContainer: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuContainer: {
    marginTop: 71, // Push the menu below the top bar
    position: 'absolute',
    top: 0,
    left: 0,
    height: '95%', // Full screen height
    width: 250,
    backgroundColor: '#fff',
    paddingTop: 50,
    zIndex: 1, // Ensure the menu stays on top
    elevation: 10, // Add elevation to make the menu appear above other content
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 18,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    backgroundColor: '#f44336',
    padding: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    zIndex: 0, // Ensure it stays below the menu
  },
  serviceBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 100, // This will push the service boxes below the welcome text
    marginBottom: 20, // Added some margin for better layout
    zIndex: 0, // Ensure it stays below the menu
    width: '100%',
   
  },
  serviceBox: {
    width: '40%',
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,

  },
  serviceText: {
    fontSize: 16,
    marginTop: 10,
  },
});
