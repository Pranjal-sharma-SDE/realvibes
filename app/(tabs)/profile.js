import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity,StyleSheet,ImageBackground } from 'react-native';
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
    <ImageBackground  style={styles.backgroundImage} source={{uri:'https://res.cloudinary.com/dqhyudo4x/image/upload/v1692001500/Portfolio/WhatsApp_Image_2023-08-14_at_13.54.49_ghqne7.jpg'}}>
    <View className="flex flex-col items-center justify-center h-full bg-gray-100" style={styles.container}>
      <Text className="text-2xl font-bold mb-4" style={styles.title}>Account</Text>
      {user ? (
        <View className="bg-white p-6 rounded-md shadow-md" style={styles.profileContainer}>
          <View className="flex items-center space-x-4 mb-4">
            <Image
              source={{ uri: user.photo ? user.photo : 'https://res.cloudinary.com/dqhyudo4x/image/upload/v1690698399/Portfolio/plane.8a8895e2_arytdt.webp' }}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text className="text-lg font-semibold" style={styles.name}>{user.name}</Text>
              <Text className="text-gray-600" style={styles.email}>{user.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            className="py-2 px-4 bg-red-500 rounded text-white text-center"
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      
      ) : (
        <Link href="/login" className="mt-4 text-blue-500">
          <Text>Log in</Text>
        </Link>
      )}
    </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  profileContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: 'gray',
  },
  button: {
    backgroundColor: '#FF0066', // Your button color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});