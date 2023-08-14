import React, { forwardRef, useEffect, useImperativeHandle, useRef,useState } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import FeedOverlay from './feedOverlay';

import { Link } from 'expo-router';

const PostSingle = forwardRef(({ item }, parentRef) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useImperativeHandle(parentRef, () => ({
    play,
    stop
  }));

  useEffect(() => {
    return () => stop();
  }, []);

  const play = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (!status?.isPlaying) {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const stop = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status?.isPlaying) {
        await videoRef.current.stopAsync();
        setIsPlaying(false);
      }
    }
  };

  return (
    <View style={{ height: Dimensions.get('window').height, backgroundColor: 'black' }}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => (isPlaying ? stop() : play())}
      >
        
        <Video
          ref={videoRef}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isLooping
          // source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
          source={{ uri: item.videoUrl }}
        />
        {!isPlaying && (
          <View style={styles.playButton}>
            <Ionicons name="ios-play-circle" size={70} color="white" />
          </View>
        )}
        <FeedOverlay item={item}/>
      </TouchableOpacity>
    </View>
  );
});

export default PostSingle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 10,
  },
  video: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: '100%',
  },
  playButton: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
});
