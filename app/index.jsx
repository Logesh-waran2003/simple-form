import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [storedData, setStoredData] = useState([]);

  // Fetch data when the app starts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("storedData");
        if (savedData) {
          setStoredData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const updatedData = [...storedData, formData];
      await AsyncStorage.setItem("storedData", JSON.stringify(updatedData));
      setStoredData(updatedData); // Update state with new data
      Alert.alert("Success", "Data saved successfully!");
      setFormData({ name: "", email: "" });
    } catch (error) {
      Alert.alert("Error", "Failed to save data.");
    }
  };

  const renderDataItem = ({ item }) => (
    <View style={styles.dataItem}>
      <Text>Name: {item.name}</Text>
      <Text>Email: {item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Your Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
      />
      <Button title="Save Data" onPress={handleSubmit} />

      <Text style={styles.subHeader}>Stored Data</Text>
      <FlatList
        data={storedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderDataItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    marginVertical: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  dataItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
});

export default App;
