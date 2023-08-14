import React, { createContext, useContext, useEffect, useState } from "react";
import { useSegments, useRouter } from "expo-router";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase authentication module
import { useRecoilState } from "recoil";
import { uidAtom,userAtom } from "./Atom";
import { doc, getDoc, getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyA4kgnfJVF2KcCPkIulI0SwCkZer1p-vas",
  authDomain: "realvibes-1e9ee.firebaseapp.com",
  projectId: "realvibes-1e9ee",
  storageBucket: "realvibes-1e9ee.appspot.com",
  messagingSenderId: "289022307786",
  appId: "1:289022307786:web:ad40f98017679998cbb333",
  measurementId: "G-ZX248SR7QE"
};

const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if the RootLayout has fully mounted before performing navigation
    if (segments[0] !== undefined) {
      const inAuthGroup = segments[0] === "(auth)";

      if (!user && !inAuthGroup) {
        router.replace("/login");
      } else if (user && inAuthGroup) {
        router.replace("/home");
      }
    }
  }, [user, segments]);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useRecoilState(userAtom);
  const [uAtom,setUAtom]=useRecoilState(uidAtom);
  const fetchUserDetails = async (uid) => {
    const firestore=getFirestore();
    const userDocRef = doc(firestore, 'users', uid);
    
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUser(userData);
        console.log(userData);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    // Initialize Firebase app
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(); // Get the auth instance

    // Set up a listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
    
        if(newUser){
      console.log(newUser.uid);  
      setUAtom( newUser.uid )
      setUser(newUser); // Update the user state when the authentication state changes
      console.log(uAtom)
      fetchUserDetails(newUser.uid);
      
        }
        else{
          setUser(null); // Update the user context
        }
     });

    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
    //   app.delete(); // Clean up the Firebase app instance
    };
  }, []);

  useProtectedRoute(user);

  const authContext = {
    user,
    setUser,
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}
