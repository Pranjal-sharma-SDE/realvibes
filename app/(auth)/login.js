import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, navigate to another page
  
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold mb-4">Login</Text>
      {error && <Text className="text-red-500 mb-4">{error}</Text>}
      <TextInput
        className="w-80 p-2 mb-2 border rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-80 p-2 mb-4 border rounded"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 p-2 rounded"
      >
        <Text className="text-white text-center">Login</Text>
      </TouchableOpacity>
      <Link href="/signup" className="mt-2 text-blue-500">
        <Text>Don't have an account? Sign up</Text>
      </Link>
    </View>
  );
}

export default LoginScreen;
