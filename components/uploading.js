import React from "react";
import { Text, View, TouchableOpacity, Platform, StyleSheet, Image } from "react-native";
import { Video } from "expo-av";
import { BlurView } from 'expo-blur';
import ProgressBar from "./progressBar";

export function Uploading({ video, progress }) {
  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && (
        <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />
      )}

      <BlurView intensity={100} tint="dark" style={styles.uploadContainer}>
        {video && (
          <Video
            source={{
              uri: video,
            }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            style={styles.video}
          />
        )}
        <Image
          source={{ uri: 'https://res.cloudinary.com/dqhyudo4x/image/upload/v1690787051/Portfolio/spinning_cat.aa434bc8_dgjck8.gif' }} // Replace with your image URI
          style={styles.image}
        />
        <Text style={styles.uploadText}>Uploading...</Text>
        <ProgressBar progress={progress} />
        <View style={styles.separator} />
        <TouchableOpacity>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  uploadContainer: {
    width: '80%',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  video: {
    width: 200,
    height: 200,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
    width: '100%',
    marginVertical: 10,
  },
  cancelButton: {
    fontWeight: '500',
    color: 'blue',
    fontSize: 18,
  },
});

export default Uploading;
