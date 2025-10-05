import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../Config/FirebaseConfig";
import { Alert } from "react-native";
import { router } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

   const Login = async () => {
    const unsubscribe = onAuthStateChanged(auth, async (users) => {
      if (users) {
        await updateUser(users.uid);
        router.replace("/main/Home");
      } else {
        setUser(null);
        router.replace("/(auth)/SignUp");
      }
      return () => unsubscribe();
    });
  };
  const SignUp = async (name: string, email: string, password: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        email,
      });
      if (response) {
        router.replace('/main/Home');
        // console.log(response?.user?.email);
      }
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("Firebase: Error (auth/email-already-in-use)."))
        msg = "Email already Registered";
      if (
        msg.includes(
          "Firebase: Password should be at least 6 characters (auth/weak-password)."
        )
      )
        msg = "Password should be at least 6 characters";
      if (msg.includes("Firebase: Error (auth/invalid-email)."))
        msg = "Invalid Email";
      console.log(msg);
      Alert.alert("Sign Up", msg);
    }
  };

  const SignIn = async (email: string, password: string) => {
    try {
      let response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        router.replace("/main/Home");
      }
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("Firebase: Error (auth/invalid-credential)."))
        msg = "Invalid Credentials";
      if (msg.includes("Firebase: Error (auth/invalid-email)."))
        msg = "Invalid Email";
      Alert.alert("Sign In", msg);
      console.log(msg);
    }
  };
  const updateUser = async (uid: string) => {
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const userData = {
        uid,
        name: data?.name || null,
        email: data?.email || null,
      };
      setUser(userData);
    }
  };

  const value = {
    SignUp,
    SignIn,
    user,
    setUser,
    Login
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth Must be Wrapped inside a Auth Provider");
  }
  return context;
};
