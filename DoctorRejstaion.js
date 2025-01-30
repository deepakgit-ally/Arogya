import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Location from 'expo-location';

const DoctorRegistration = ({ setLoggedIn, navigation }) => {
  // Dropdown Data
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [degrees, setDegrees] = useState([]);

  // Selected Values
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");

  // Location Data
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  // API Base URL
  const BASE_URL = "http://app.arogyasharnam.com/api";

  useEffect(() => {
    fetchData(`${BASE_URL}/General/State`, setStates);
    fetchData(`${BASE_URL}/GeneralServices/Services`, setServices);
    fetchData(`${BASE_URL}/GeneralSpecialization/Specialization`, setSpecializations);
    fetchData(`${BASE_URL}/GeneralDegree/Degree`, setDegrees);
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchData(`${BASE_URL}/General/District?Code=${selectedState}`, setDistricts);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchData(`${BASE_URL}/General/Location?DSTCode=${selectedDistrict}`, setLocations);
    }
  }, [selectedDistrict]);

  // Function to Fetch API Data
  const fetchData = async (url, setStateCallback) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setStateCallback(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  // Validate Required Fields
  const validateInput = () => {
    if (!name || !mobileNumber || !pincode || !selectedState || !selectedDistrict || !selectedService || !selectedSpecialization || !selectedDegree) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return false;
    }
    if (!selectedLocation && (!latitude || !longitude)) {
      Alert.alert("Location Error", "Please select a location or enable GPS to fetch location.");
      return false;
    }
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!validateInput()) return;

    const doctorData = {
      Code: "0",
      DID: "0",
      Name: name.trim(),
      Address: address.trim(),
      PINCode: pincode.trim(),
      STCode: selectedState,
      DISTCode: selectedDistrict,
      LocationCode: selectedLocation || "",
      ServiceID: selectedService,
      CategoryID: "1",
      SpecializationID: selectedSpecialization,
      DegreeID: selectedDegree,
      LATCode: latitude || "1",
      LONGCode: longitude || "1",
      GPSAddress: `${latitude},${longitude}`,
      MobileNo: mobileNumber.trim(),
    };

    try {
      console.log("Doctor Registration Data:", doctorData);

      const response = await fetch(`${BASE_URL}/Doctor/DoctorUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData),
      });

      const data = await response.json();
      console.log("Doctor Registration Response:", data);

      if (response.ok && data.includes("Record Saved Successfully")) {
        Alert.alert("Success", "Doctor data saved successfully.");
        setLoggedIn(false);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "Failed to save doctor data.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      Alert.alert("Error", "An error occurred while saving data.");
    }
  };

  // Handle GPS Location
  const handleLocationChange = async (value) => {
    if (!value) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        Alert.alert("GPS Location", `Coordinates: ${location.coords.latitude}, ${location.coords.longitude}`);
      } else {
        Alert.alert("Permission Denied", "Location permission is required.");
      }
    } else {
      setSelectedLocation(value);
      setLatitude("");
      setLongitude("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Doctor Registration</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Icon name="sign-out" size={20} color="#007BFF" style={styles.logoutIcon} />
        </TouchableOpacity>
      </View>

      {/* Registration Form */}
      <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        <TextInputField placeholder="Name" value={name} onChangeText={setName} />
        <TextInputField placeholder="Mobile Number" keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} />
        <TextInputField placeholder="Address" value={address} onChangeText={setAddress} />
        <TextInputField placeholder="PIN Code" keyboardType="numeric" value={pincode} onChangeText={setPincode} />

        <PickerField label="State" selectedValue={selectedState} onValueChange={setSelectedState} items={states} />
        <PickerField label="District" selectedValue={selectedDistrict} onValueChange={setSelectedDistrict} items={districts} />
        <PickerField label="Location" selectedValue={selectedLocation} onValueChange={handleLocationChange} items={locations} />
        <PickerField label="Service Type" selectedValue={selectedService} onValueChange={setSelectedService} items={services} />
        <PickerField label="Specialization" selectedValue={selectedSpecialization} onValueChange={setSelectedSpecialization} items={specializations} />
        <PickerField label="Degree" selectedValue={selectedDegree} onValueChange={setSelectedDegree} items={degrees} />

        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// UI Components
const TextInputField = ({ ...props }) => <TextInput style={styles.input} {...props} />;
const PickerField = ({ label, selectedValue, onValueChange, items }) => (
  <View style={styles.pickerContainer}>
    <Picker selectedValue={selectedValue} onValueChange={onValueChange} style={styles.picker}>
      <Picker.Item label={`-- ${label} --`} value="" />
      {items.map((item) => <Picker.Item key={item.Code} label={item.Name} value={item.Code} />)}
    </Picker>
  </View>
);

// Styles
const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 60,
  },
  topBarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  logoutIcon: {
    padding: 5,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DoctorRegistration;
