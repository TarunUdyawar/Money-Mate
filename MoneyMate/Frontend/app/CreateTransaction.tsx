import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "./Context/AuthContext";
import { colors } from "./Data/Colors";
import DropDownPicker from "react-native-dropdown-picker";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://moneymate-wuud.onrender.com/api/transactions";

export default function CreateTransaction() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Income", value: "Income" },
    { label: "Expense", value: "Expense" },
  ]);

  const handleAddTransaction = async () => {
    if (!title || !amount || !category) {
      Alert.alert("Error", "Please fill all the details");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_ID: user?.uid,
          title,
          category,
          amount: category === "Expense" ? -Math.abs(amount) : Math.abs(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create transaction");
      }

      Alert.alert("Success", "Transaction added successfully");
      router.back() 
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>

      <TextInput
        placeholder="Enter title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter amount"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <DropDownPicker
        open={open}
        value={category}
        items={items}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setItems}
        placeholder="Select category"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTransaction}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Add Transaction</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.accent,
    marginBottom: 20,
    textAlign:'center'
  },
  input: {
    backgroundColor: colors.background,
    color: colors.accent,
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: colors.background,
    borderRadius: 10,
    borderColor: "transparent",
    marginBottom: 16,
  },
  dropdownContainer: {
    backgroundColor: colors.background,
    borderColor: "transparent",
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 10,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
