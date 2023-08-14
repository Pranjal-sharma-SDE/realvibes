import React, { useEffect, useState, useRef } from 'react';
import { FlatList } from 'react-native';
import { getDocs, collection, getFirestore } from 'firebase/firestore';
import SingleFeed from '../components/SingleFeed';

export default function Feeds() {
  const [videos, setVideos] = useState([]);
  const db = getFirestore();
  const mediaRefs = useRef({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'shorts'));
        const videoData = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), docid: doc.id }; // Adding the docid to the videoData
        });
        setVideos(videoData);
        console.log(videoData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    try {
      Object.keys(mediaRefs.current).forEach(key => {
        if (!viewableItems.some(item => item.key === key)) {
          if (mediaRefs.current[key]) { // Check if the reference is valid before calling methods
            mediaRefs.current[key].stop();
          }
        }
      });
  
      viewableItems.forEach(item => {
        if (mediaRefs.current[item.key]) { // Check if the reference is valid before calling methods
          mediaRefs.current[item.key].play();
        }
      });
    } catch (error) {
      console.error("Error handling viewable items:", error);
    }
  });

  const renderItem = ({ item }) => (
    <SingleFeed item={item} ref={ref => (mediaRefs.current[item.key] = ref)} />
  );

  return (
    <FlatList
      data={videos}
      windowSize={10}
      keyExtractor={(item) => item.videoUrl}
      renderItem={renderItem}
      initialNumToRender={2}
      onViewableItemsChanged={onViewableItemsChanged.current}
    />
  );
}
