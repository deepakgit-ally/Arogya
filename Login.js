import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, Alert 
} from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

const screen = Dimensions.get('screen');

export default function Login({ setLoggedIn, setUserName, navigation }) {
  const [isSignup, setIsSignup] = useState(false);
  const [mobNo, setMobNo] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [age, setAge] = useState('');
  const [pinCode, setPinCode] = useState('');

  // Base API URL
  const BASE_URL = 'http://app.arogyasharnam.com/api';

  /** 🔹 Function to Validate Input */
  const validateInput = (fields) => {
    for (const [key, value] of Object.entries(fields)) {
      if (!value.trim()) {
        Alert.alert('Error', `${key} is required!`);
        return false;
      }
    }
    return true;
  };

  /** 🔹 Patient Login */
  const handlePatientLogin = async () => {
    if (!validateInput({ MobileNumber: mobNo, Password: pass })) return;

    try {
      const response = await axios.get(`${BASE_URL}/Login/PatientLogin`, {
        params: { MobNo: mobNo, Pass: pass },
      });

      const data = response.data;
      console.log('Login Response:', data);

      if (data && data.length > 0 && data[0].Name) {
        Alert.alert('Success', 'Login Successful!');
        setLoggedIn(true);
        setUserName(data[0].Name);
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Error', 'Invalid login credentials!');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Network error! Check your internet connection.');
    }
  };

  /** 🔹 Doctor Login */
  const handleDoctorLogin = async () => {
    if (!validateInput({ MobileNumber: mobNo, Password: pass })) return;

    try {
      const response = await axios.get(`${BASE_URL}/Login/UserLogin`, {
        params: { MobileNo: mobNo, Password: pass },
      });

      const data = response.data;
      console.log('Doctor Login Response:', data);

      if (data && data.length > 0 && data[0].Name) {
        Alert.alert('Success', 'Doctor Login Successful!');
        navigation.replace('DoctorRegistration');
      } else {
        Alert.alert('Error', 'Invalid credentials!');
      }
    } catch (error) {
      console.error('Doctor Login Error:', error);
      Alert.alert('Error', 'Network error! Check your internet connection.');
    }
  };

  /** 🔹 Patient Signup */
  const handlePatientSignup = async () => {
    if (
      !validateInput({ Name: name, MobileNumber: mobNo, Email: email, Age: age, PINCode: pinCode, Password: pass })
    ) return;

    const requestData = {
      Code: 0,
      Name: name.trim(),
      MobileNo: mobNo.trim(),
      EmailID: email.trim(),
      Age: parseInt(age, 10),
      PINCode: pinCode.trim(),
      Password: pass,
    };

    try {
      console.log('Signup Request:', requestData);

      const response = await fetch(`${BASE_URL}/Patient/PatientUpdate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('Signup Response:', data);

      if (response.ok && data.includes("Record Saved Successfully")) {
        Alert.alert('Success', 'Signup successful! You can now login.');
        setIsSignup(false);
      } else {
        Alert.alert('Error', data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', 'Something went wrong during signup!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.profile}>
          <Image source={logo} style={styles.logo} />
        </View>
      </View>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={[styles.toggleText, { marginTop: isSignup ? 200 : 18 }]}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
        </Text>
      </TouchableOpacity>

      {isSignup ? (
        <View style={styles.formContainer}>
          <TextInput style={styles.inputField} placeholder="Full Name" value={name} onChangeText={setName} />
          <TextInput style={styles.inputField} placeholder="Mobile Number" keyboardType="phone-pad" value={mobNo} onChangeText={setMobNo} />
          <TextInput style={styles.inputField} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextInput style={styles.inputField} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
          <TextInput style={styles.inputField} placeholder="PIN Code" keyboardType="numeric" value={pinCode} onChangeText={setPinCode} />
          <TextInput style={styles.inputField} placeholder="Password" secureTextEntry value={pass} onChangeText={setPass} />
          <TouchableOpacity style={styles.loginButton} onPress={handlePatientSignup}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <TextInput style={styles.inputField} placeholder="Mobile Number" keyboardType="phone-pad" value={mobNo} onChangeText={setMobNo} />
          <TextInput style={styles.inputField} placeholder="Password" secureTextEntry value={pass} onChangeText={setPass} />
          <TouchableOpacity style={styles.loginButton} onPress={handlePatientLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleDoctorLogin}>
            <Text style={styles.buttonText}>User Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 100, height: 100, resizeMode: 'cover' },
  banner: {
    backgroundColor: '#BF3EFF',
    height: screen.width * 2,
    width: screen.width * 2,
    borderWidth: 5,
    borderColor: 'orange',
    borderRadius: screen.width,
    position: 'absolute',
    bottom: screen.height - screen.height * 0.3,
    alignItems: 'center',
  },
  profile: {
    width: 100,
    height: 100,
    backgroundColor: 'pink',
    position: 'absolute',
    bottom: -50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  formContainer: {
    width: screen.width - 60,
    marginTop: 20,
  },
  inputField: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    marginVertical: 10,
    paddingLeft: 15,
    fontSize: 16,
  },
  loginButton: {
    width: screen.width - 60,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  toggleText: { color: '#4CAF50', fontSize: 16 },
});
