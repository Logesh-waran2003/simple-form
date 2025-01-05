import React, { useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface FormData {
  id: string;
  date: Date;
  from: string;
  to: string;
  usedApp: string;
  usedAccount: string;
  category: string;
  amount: string;
  note: string;
}

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    id: generateUniqueId(),
    date: new Date(),
    from: "",
    to: "",
    usedApp: "Gpay",
    usedAccount: "HDFC",
    category: "Food",
    amount: "",
    note: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (name: keyof FormData, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const existingData = await AsyncStorage.getItem("storedData");
      const newData = existingData ? JSON.parse(existingData) : [];
      newData.push(formData);
      await AsyncStorage.setItem("storedData", JSON.stringify(newData));
      setFormData({
        id: generateUniqueId(),
        date: new Date(),
        from: "",
        to: "",
        usedApp: "Gpay",
        usedAccount: "HDFC",
        category: "Food",
        amount: "",
        note: "",
      });
      Alert.alert("Success", "Expense added successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params: { date: any }) => {
      setOpen(false);
      handleChange("date", params.date);
    },
    [setOpen, handleChange]
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.header}>Add Expense</Text>
        <Button
          style={styles.button}
          onPress={() => setOpen(true)}
          uppercase={false}
          mode="outlined"
        >
          {formData.date ? formatDate(formData.date) : "Pick a date"}
        </Button>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          date={formData.date}
          onConfirm={onConfirmSingle}
        />
        <TextInput
          style={styles.input}
          placeholder="From"
          value={formData.from}
          onChangeText={(value) => handleChange("from", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          value={formData.to}
          onChangeText={(value) => handleChange("to", value)}
        />
        <RNPickerSelect
          placeholder={{ label: "Select app", value: null }}
          onValueChange={(value) => handleChange("usedApp", value)}
          items={[
            { label: "Gpay", value: "Gpay" },
            { label: "Paytm", value: "Paytm" },
            { label: "Super", value: "Super" },
            { label: "Card", value: "Card" },
          ]}
          style={pickerSelectStyles}
        />
        <RNPickerSelect
          placeholder={{ label: "Select Account", value: null }}
          onValueChange={(value) => handleChange("usedAccount", value)}
          items={[
            { label: "HDFC Personal", value: "HDFC-0931" },
            { label: "HDFC Work", value: "HDFC-work" },
            { label: "CreditCard", value: "CreditCard" },
          ]}
          style={pickerSelectStyles}
        />
        <RNPickerSelect
          placeholder={{ label: "Select category", value: null }}
          onValueChange={(value) => handleChange("category", value)}
          items={[
            { label: "Food", value: "Food" },
            { label: "Travel", value: "Travel" },
            { label: "Others", value: "Others" },
            { label: "Essentials", value: "Essentials" },
          ]}
          style={pickerSelectStyles}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={formData.amount}
          onChangeText={(value) => handleChange("amount", value)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Note"
          value={formData.note}
          onChangeText={(value) => handleChange("note", value)}
        />
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Add Expense
        </Button>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
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
  button: {
    margin: 10,
    width: "100%",
  },
});

const pickerSelectStyles = StyleSheet.create({});
