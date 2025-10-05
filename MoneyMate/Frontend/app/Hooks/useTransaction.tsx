import { useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = "https://moneymate-wuud.onrender.com/api/transactions";
export const useTransactions = (user_ID) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const [loading, setLoading] = useState(true);
  const fetchTransactions = useCallback(
    async () => {
    try {
      const response = await fetch(`${API_URL}/${user_ID}`);
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error: any) {
      console.log(error);
    }
  
  },[user_ID])
  const fetchSummary = useCallback(
async () => {
    try {
      const response = await fetch(`${API_URL}/summary/${user_ID}`);
      const data = await response.json();
      setSummary(data);
    } catch (error: any) {
      console.log(error);
    }
  
  },[user_ID]) 
  const loadData = useCallback(
    async()=>{
      if(!user_ID) return;
    try {
        setLoading(true)
        await Promise.all([fetchTransactions(),fetchSummary()])
    } catch (error: any) {
      console.log(error);
    } finally{
        setLoading(false)
    }
  
  },[user_ID,fetchSummary,fetchTransactions])
  const deleteTransaction = async(id)=>{
    try {
        const response = await fetch(`${API_URL}/${id}`,{method:"DELETE"})
       
        if(!response.ok) throw new Error("Transaction Not Deleted");
       loadData()
       Alert.alert("Transaction Deleted Successfully") 
    } catch (error:any) {
        console.log(error)
    }
  }
  return{transactions,summary,loadData,loading,deleteTransaction}
};
