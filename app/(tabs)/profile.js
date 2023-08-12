import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRecoilValue, useRecoilState } from 'recoil';
import { getAuth, signOut } from "firebase/auth";
import { uidAtom, userAtom } from '../../context/Atom'; // Import your uidAtom and userAtom from the correct path
import { doc, getDoc, getFirestore } from 'firebase/firestore'; // Import firestore and other necessary components from the correct paths
import { Link } from 'expo-router'; // Make sure you have the correct import path

export default function Profile() {
  const uid = useRecoilValue(uidAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const auth = getAuth();

  const fetchUserDetails = async () => {
    const firestore=getFirestore();
    const userDocRef = doc(firestore, 'users', uid);
    
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchUserDetails();
    }
  }, [uid]);

  const handleSignOut = () => {
    // Implement your sign-out logic here
    signOut(auth);
    

  };

  return (
    <View className="flex flex-col items-center justify-center h-full bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Account</Text>
      {user ? (
        <View className="bg-white p-6 rounded-md shadow-md">
          <View className="flex items-center space-x-4 mb-4">
            <Image
              source={{ uri: user.photo ? user.photo : 'https://res.cloudinary.com/dqhyudo4x/image/upload/v1690698399/Portfolio/plane.8a8895e2_arytdt.webp' }}
              style={{ width: 68, height: 68, borderRadius: 32 }}
            />
            <View>
              <Text className="text-lg font-semibold">{user.name}</Text>
              <Text className="text-gray-600">{user.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            className="py-2 px-4 bg-red-500 rounded text-white text-center"
          >
            <Text>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Link href="/login" className="mt-4 text-blue-500">
          <Text>Log in</Text>
        </Link>
      )}
    </View>
  );
}
