import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTransactions } from "../Hooks/useTransaction";
import { colors } from "../Data/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { format } from "date-fns";
import { signOut } from "firebase/auth";
import { auth } from "../Config/FirebaseConfig";
import { router } from "expo-router";

export default function Home() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false)
  const { loadData, transactions, summary, deleteTransaction, loading } =
    useTransactions(user?.uid);
  

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async()=>{
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleLogout = async()=>{
    await signOut(auth)
  }

  const logout = async()=>{
    Alert.alert("Logout","Are You Sure You Want to Logout ?",[
      {text:'Cancel',style:'cancel'},
      {text: 'Confirm',style:'destructive',onPress:()=>handleLogout()}
    ])
  }
  const DeleteTransaction = (id)=>{
      Alert.alert("Delete Transaction","Are You Sure You Want to Delete it ?",[
      {text:'Cancel',style:'cancel'},
      {text: 'Confirm',style:'destructive',onPress:()=>deleteTransaction(id)}
    ])
  }

  const renderItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.iconTextRow}>
        <Ionicons
          name={
            item.category === "Income" ? "arrow-down-circle" : "arrow-up-circle"
          }
          size={24}
          color={item.category === "Income" ? colors.income : colors.error}
          style={styles.icon}
        />
        <View>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionDate}>
            {format(new Date(item.createdat), "dd-MM-yyyy")}
          </Text>
        </View>
      </View>
      <View style={styles.rightRow}>
        <Text
          style={[
            styles.transactionAmount,
            {
              color: item.category === "Income" ? colors.income : colors.error,
            },
          ]}
        >
          {item.category === "Income"
            ? `+ ₹${item.amount}`
            : ` ₹${item.amount}`}
        </Text>
        <TouchableOpacity onPress={()=>DeleteTransaction(item.id)}>
          <Ionicons name="trash" size={22} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.userName}>
            Hello {user?.name || "User Name"} !
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || "user@example.com"}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Total Balance</Text>
        <Text style={styles.balanceAmount}>₹{summary.balance}</Text>
        <View style={styles.incomeExpenseRow}>
          <Text style={[styles.incomeExpense, { color: colors.income }]}>
            Income: ₹{summary.income}
          </Text>
          <Text style={[styles.incomeExpense, { color: colors.error }]}>
            Expense: ₹{summary.expense}
          </Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing}
              onRefresh={onRefresh}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No transactions yet</Text>
            }
          />
        )}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText} onPress={()=>router.push('/CreateTransaction')}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: "#ccc",
  },
  logoutButton: {
    padding: 8,
  },
  balanceCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  balanceTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.accent,
    marginVertical: 8,
  },
  incomeExpenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  incomeExpense: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  transactionDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: colors.text,
    marginTop: 40,
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: colors.accent,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  addButtonText: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: "bold",
  },
});
