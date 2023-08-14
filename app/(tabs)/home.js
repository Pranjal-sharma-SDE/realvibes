import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  

 

  return (
    <ImageBackground
      source={{uri:'https://res.cloudinary.com/dqhyudo4x/image/upload/v1690786098/Portfolio/developers2.6f599dd2_ek6emf.webp'}} // Use your background image here
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>Welcome to Your Realvibes !!</Text>
        <Link href={"/feeds"} style={styles.button} >
          <Text style={styles.buttonText}>Explore Feeds</Text>
        </Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  heading: {
    color: "white",
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF0066", // Your button color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
