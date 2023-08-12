import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    const auth = getAuth();
    const firestore = getFirestore();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        name: name,
        email: email,
        uid: user.uid,
      });

      // Signup successful, navigate to another page
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View className="flex justify-center items-center" >
      <Text className="text-2xl font-bold mb-4">Sign Up</Text>
      {error && <Text className="text-red-500 mb-4">{error}</Text>}
      <TextInput
        className="w-80 p-2 mb-2 border rounded"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
        onPress={handleSignup}
        className="bg-blue-500 p-2 rounded"
      >
        <Text className="text-white text-center">Sign Up</Text>
      </TouchableOpacity>
      <Link href="/login" className="mt-2 text-blue-500">
        <Text>Already have an account? Log in</Text>
      </Link>
    </View>
  );
}

export default Signup;
