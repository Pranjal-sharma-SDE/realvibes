import React, { createContext, useContext, useEffect, useState } from "react";
import { useSegments, useRouter } from "expo-router";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase authentication module
import { useRecoilState } from "recoil";
import { uidAtom } from "./Atom";

const firebaseConfig = {
    apiKey: "AIzaSyBZFYMt5IugiXSqn_K4iS_yc6Z6GSaZ8lE",
    authDomain: "reelvibes-3f2b7.firebaseapp.com",
    projectId: "reelvibes-3f2b7",
    storageBucket: "reelvibes-3f2b7.appspot.com",
    messagingSenderId: "22972405767",
    appId: "1:22972405767:web:131222dac2fc326ce772a2",
    measurementId: "G-MN85B8QRSF"
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
  const [uAtom,setUAtom]=useRecoilState(uidAtom);

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
