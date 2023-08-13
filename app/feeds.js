import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { collection, query, getDocs, startAfter, orderBy,getFirestore } from "firebase/firestore";
import { Video } from "expo-av";

export default function Feeds() {
  const [videos, setVideos] = useState([]);
  const db=getFirestore();

  useEffect(() => {
    const fetchVideos = async () => {
      const querySnapshot = await getDocs(collection(db, "shorts"));
      const videoData = [];
      querySnapshot.forEach((doc) => {
        videoData.push(doc.data());
      });
      setVideos(videoData);
    };

    fetchVideos();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.videoUrl}
        renderItem={({ item }) => {
          if (item.fileType === "image") {
            return (
              <Image
                source={{ uri: item.videoUrl }}
                style={{ width: "34%", height: 100 }}
              />
            );
          } else {
            return (
              <Video
                source={{ uri: item.videoUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                style={{ width: "34%", height: 100 }}
                useNativeControls
              />
            );
          }
        }}
        numColumns={3}
        contentContainerStyle={{ padding: 2 }}
        columnWrapperStyle={{ padding: 2 }}
      />
    </View>
  );
}
