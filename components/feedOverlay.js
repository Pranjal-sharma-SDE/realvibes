import React, { useState, useEffect } from 'react';
import { View, Text,Share, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Link } from 'expo-router';
import { uidAtom } from '../context/Atom';
import { useRecoilValue } from 'recoil';
import { doc, setDoc,getFirestore } from 'firebase/firestore';


export default function FeedOverlay({ item }) {
    const uid = useRecoilValue(uidAtom);
 const db=getFirestore();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (item.likedBy && item.likedBy.includes(uid)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [uid, item.likedBy]);
  
  const handleLike =async() => {
    try {
        const docRef = doc(db, 'shorts', item.docid);
       console.log(item.docid, uid);
        let newLikedBy;
    
        if (!item.likedBy) {
          // If likedBy array doesn't exist, create a new array with the user's UID
          newLikedBy = [uid];
        } else {
          newLikedBy = liked
            ? item.likedBy.filter(id => id !== uid)
            : [...item.likedBy, uid];
        }
    
        await setDoc(docRef, { likedBy: newLikedBy }, { merge: true });
        setLiked(!liked);
      } catch (error) {
        console.error("Error updating like:", error);
      }
  };

  const handleShare = async() => {
    // Placeholder function for handling share action
    try {
       
  
        const videoUrl = item.videoUrl; // Replace with the actual video URL
  
        await Share.share({
          message: `Check out this video: ${videoUrl}`,
        });
      } catch (error) {
        console.error("Error sharing video:", error);
      }
  };

 

  return (
    <View
      style={{
        width: '100%',
        position: 'absolute',
        zIndex: 999,
        bottom: 0,
        paddingLeft: 20,
        paddingBottom: 20,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}
    >
      <View>
        
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          {item.createrName ? item.createrName : "CreaterName"}
        </Text>
        <Text style={{ marginTop: 10, color: 'white' }}>
          {item.description ? item.description : "No description available"}
        </Text>
        <Text style={{ color: 'white' }}>
          {item.title ? item.title : "No title"}
        </Text>
      </View>

      <View style={{ alignItems: 'center' }}>
      <Link href="/home" style={{ paddingBottom: 16 }} >
          <Ionicons
            color="white"
            size={40}
            name="arrow-back"
          />
        </Link>
        <TouchableOpacity onPress={handleLike} style={{ paddingBottom: 16 }}>
        <Ionicons
          color={liked ? 'red' : 'white'}
          size={40}
          name={liked ? "heart" : "heart-outline"}
        />
      </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={{ paddingBottom: 16 }}>
          <Ionicons
            color="white"
            size={40}
            name="share-outline"
          />
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 4 }}>
            Share
          </Text>
        </TouchableOpacity>

        {/* Link to open comment modal */}
        <Link href={{pathname: "/comments",params:item}} style={{ paddingBottom: 16 }}>
          <Ionicons
            color="white"
            size={40}
            name="chatbubble-outline"
          />
        </Link>
      </View>
    </View>
  );
}
