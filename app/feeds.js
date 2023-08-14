import React, { useEffect, useState, useRef } from 'react';
import { FlatList } from 'react-native';
import { getDocs, collection, getFirestore } from 'firebase/firestore';
import SingleFeed from '../components/SingleFeed';

export default function Feeds() {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 5;
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
          if (mediaRefs.current[key]) {
            mediaRefs.current[key].stop();
          }
        }
      });
  
      viewableItems.forEach(item => {
        if (mediaRefs.current[item.key]) {
          mediaRefs.current[item.key].play();
        }
      });

      const lastVisibleItem = viewableItems[viewableItems.length - 1];
      const lastVisibleIndex = videos.findIndex(
        video => video.key === lastVisibleItem.key
      );

      if (lastVisibleIndex === videos.length - 1) {
        // Load next page of videos
        const nextPage = currentPage + 1;
        const startIndex = nextPage * videosPerPage;
        const endIndex = startIndex + videosPerPage;
        const nextVideos = videos.slice(startIndex, endIndex);
        
        if (nextVideos.length > 0) {
          setVideos(prevVideos => [...prevVideos, ...nextVideos]);
          setCurrentPage(nextPage);
        }
      }
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
      initialNumToRender={videosPerPage}
      onViewableItemsChanged={onViewableItemsChanged.current}
    />
  );
}
