import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

interface Expense {
  id: string;
  date: string;
  from: string | null;
  to: string | null;
  usedApp: string | null;
  usedAccount: string | null;
  category: string;
  amount: number;
  note: string;
}

export default function StoredData() {
  const [storedData, setStoredData] = useState<Expense[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const isFocused = useIsFocused();

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

  const deleteItem = async (id: string) => {
    try {
      const newData = storedData.filter((item) => item.id !== id);
      setStoredData(newData);
      await AsyncStorage.setItem("storedData", JSON.stringify(newData));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const renderDataItem = ({ item }: { item: Expense }) => (
    <View style={styles.dataItem}>
      {showDelete && (
        <Button title="Delete" onPress={() => deleteItem(item.id)} />
      )}
      <Text>Amount: {item.amount}</Text>
      <Text>Note: {item.note}</Text>
    </View>
  );

  const groupedData = storedData.reduce(
    (acc: { [key: string]: Expense[] }, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {}
  );

  console.log("groupedData", groupedData);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      <Button
        title={showDelete ? "Done" : "Delete Expenses"}
        onPress={() => setShowDelete(!showDelete)}
      />
      <FlatList
        data={Object.keys(groupedData)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View key={item} style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{formatDate(item)}</Text>
            {groupedData[item].map((expense) => (
              <View key={expense.id} style={styles.dataItem}>
                {showDelete && (
                  <Button
                    title="Delete"
                    onPress={() => deleteItem(expense.id)}
                  />
                )}
                <Text>Amount: {expense.amount}</Text>
                <Text>Note: {expense.note}</Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateGroup: {
    width: "100%",
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    margin: 10,
    width: "100%",
  },
});
