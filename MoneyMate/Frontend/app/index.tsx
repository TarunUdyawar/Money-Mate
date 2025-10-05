import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { MotiImage } from "moti";
import { useAuth } from "./Context/AuthContext";

export default function Index() {

  const {Login}= useAuth()
  useEffect(()=>{
    setTimeout(()=>{
      Login()
    },3000)
  },[])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0d0d0d", 
        justifyContent: "center",
        alignItems: "center",
      }}
    
    >
      <MotiImage
      
        source={require("../assets/images/landing.png")}
        style={{ width: 350, height: 350 }}
        from={{
          opacity: 0,
          scale: 0.7,
          translateY: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          translateY: 0,
        }}
        transition={{
          type: "spring",
          damping: 10,
          stiffness: 100,
          delay: 300,
        }}
      />
    </View>
  );
}
