import React from "react";
import { Image, Text, View, TouchableOpacity, Platform } from "react-native";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

import { BlurView } from 'expo-blur';
import ProgressBar from "./progressBar";

export function Uploading({ image, video, progress }) {
  return (
    <View className="flex flex-1 items-center justify-center z-10">
      {Platform.OS === "ios" && (
        <BlurView intensity={100} tint="dark" className="absolute inset-0" />
      )}

      <BlurView intensity={100} tint="dark" className="w-4/5 rounded-lg bg-white p-5 space-y-4">
        <View className="items-center">
          {image && (
            <Image
              source={{ uri: image }}
              className="w-24 h-24 resizeMode-contain rounded"
            />
          )}
          {video && (
            <Video
              source={{
                uri: video,
              }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              className="w-48 h-48"
            />
          )}
          <Text className="text-xs">Uploading...</Text>
          <ProgressBar progress={progress} />
          <View className="border-t border-gray-300 w-full" />
          <TouchableOpacity>
            <Text className="font-medium text-blue-500 text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </BlurView>

    </View>
  );
}

export default Uploading;
