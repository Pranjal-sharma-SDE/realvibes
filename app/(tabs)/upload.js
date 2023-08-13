import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera, CameraType, FlashMode, VideoQuality } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useIsFocused } from '@react-navigation/core';
import { Feather } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';


/**
 * Function that renders a component responsible for showing
 * a view with the camera preview, recording videos, controlling the camera, and
 * letting the user pick a video from the gallery.
 * @returns Functional Component
 */
export default function CameraScreen() {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(false);
  const [hasAudioPermissions, setHasAudioPermissions] = useState(false)
  const [hasGalleryPermissions, setHasGalleryPermissions] = useState(false);
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false);

  const [galleryItems, setGalleryItems] = useState([]);

  const [cameraRef, setCameraRef] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [cameraFlash, setCameraFlash] = useState(FlashMode.off);

  const [isCameraReady, setIsCameraReady] = useState(false);
  const isFocused = useIsFocused();

//   const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermissions(cameraStatus.status === 'granted');

      const audioStatus = await Audio.requestPermissionsAsync()
      setHasAudioPermissions(audioStatus.status == 'granted')

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermissions(galleryStatus.status === 'granted');

      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPermissions(mediaStatus.status === 'granted');

      if (mediaStatus.status === 'granted') {
        const userGalleryMedia = await MediaLibrary.getAssetsAsync({ sortBy: ['creationTime'], mediaType: ['video'] });
        setGalleryItems(userGalleryMedia.assets);
      }
    })();
  }, []);

  const recordVideo = async () => {
    if (cameraRef) {
      try {
        const options = { maxDuration: 60, quality: VideoQuality['480'] };
        const videoRecordPromise = cameraRef.recordAsync(options);
        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          const source = data.uri;
          let sourceThumb = await generateThumbnail(source);
        //   navigation.navigate('savePost', { source, sourceThumb });
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const stopVideo = async () => {
    if (cameraRef) {
      cameraRef.stopRecording();
    }
  };

  const pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      let sourceThumb = await generateThumbnail(result.uri);
    //   navigation.navigate('savePost', { source: result.uri, sourceThumb });
    }
  };

  const generateThumbnail = async (source) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(source, {
        time: 5000,
      });
      return uri;
    } catch (e) {
      console.warn(e);
    }
  };

  if (!hasCameraPermissions || !hasGalleryPermissions || !hasAudioPermissions) {
    return (<View><Text>Please grant necessary permissions.</Text></View>);
  }

  return (
    <View style={  `flex-1`}>
      {/* {isFocused ? ( */}
        <Camera
          
          style={  `flex-1 aspect-w-9 aspect-h-16`}
          ratio={'16:9'}
         
          onCameraReady={() => setIsCameraReady(true)}
        />
      {/* ) : null} */}

      <View style={  `absolute top-16 right-4`}>
        <TouchableOpacity
          style={  `items-center mb-4`}
          onPress={() => setCameraType(cameraType === CameraType.back ? CameraType.front : CameraType.back )}
        >
          <Feather name="refresh-ccw" size={24} color={'white'} />
          <Text style={  `text-white text-sm mt-1`}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={  `items-center`}
          onPress={() => setCameraFlash(cameraFlash === FlashMode.off ? FlashMode.torch : FlashMode.off)}
        >
          <Feather name="zap" size={24} color={'red'} />
          <Text style={  `text-white text-sm mt-1`}>Flash</Text>
        </TouchableOpacity>
      </View>

      <View style={  `absolute bottom-0 left-0 right-0 flex-row items-center justify-be  een mb-8 px-8`}>
        <TouchableOpacity
          disabled={!isCameraReady}
          onLongPress={() => recordVideo()}
          onPressOut={() => stopVideo()}
          style={  `border-4 border-red-400 bg-red-500 rounded-full w-20 h-20`}
        />

        <TouchableOpacity
          onPress={() => pickFromGallery()}
          style={  `border-2 border-white rounded-lg overflow-hidden w-12 h-12`}
        >
          {galleryItems[0] !== undefined ? (
            <Image style={  `w-12 h-12`} source={{ uri: galleryItems[0].uri }} />
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
}