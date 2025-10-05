import { initializeApp } from "firebase/app";
//@ts-ignore
import {initializeAuth,getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBa8-6lX60XWk3zSWD0UKIkHQNQDXqppEE",
  authDomain: "moneymate-135e5.firebaseapp.com",
  projectId: "moneymate-135e5",
  storageBucket: "moneymate-135e5.firebasestorage.app",
  messagingSenderId: "606314571193",
  appId: "1:606314571193:web:6b4f4c296a14de882d0268",
  measurementId: "G-SL9LM79CJ6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app,{
    persistence:getReactNativePersistence(AsyncStorage)
})

export const firestore = getFirestore(app)