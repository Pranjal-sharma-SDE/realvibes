import { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, FlatList, Platform,TextInput,Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import { addDoc, collection, doc, setDoc, onSnapshot, getFirestore, arrayUnion } from "firebase/firestore";
import { Video } from "expo-av";
import Uploading from "../../components/uploading";
import ProgressBar from "../../components/progressBar";
import { useRecoilValue } from "recoil";
import { uidAtom } from "../../context/Atom";
import * as FileSystem from 'expo-file-system';

export default function Upload() {
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const storage = getStorage();
  const db = getFirestore();
  const uid = useRecoilValue(uidAtom);

  async function pickVideo() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result)
      const videoUri = result.assets[0].uri;
      setVideo(videoUri);
      await uploadVideo(videoUri, "video");
      // setVideo(result.assets[0].uri);
      // const videoSize =  await checkFileSize(result.assets[0].uri);;

      // if (videoSize <= 1024 * 1024 ) {
      //   setVideo(videoUri);
      //   setErrorMessage(""); // Clear any previous error message
      //   await uploadVideo(videoUri, "video");
      // } else {
      //   setErrorMessage("The selected video is larger than 1MB.");
      // }
    }
  }

  async function checkFileSize(fileURI) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileURI);
      return fileInfo;
    } catch (error) {
      console.error("Error getting file info:", error);
      return null;
    }
  }
  async function uploadVideo(uri, fileType) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Stuff/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress.toFixed());
      },
      (error) => {
        console.error("Upload error:", error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setVideo("");
        } catch (e) {
          console.error("An error occurred while saving record:", e);
        }
      }
    );
  }

  async function saveRecord(fileType, url, createdAt) {
    try {
      const docRef = await addDoc(collection(db, "shorts"), {
        title :title,
        description : description,
        videoUrl: url,
        createdAt,
        createdBy :uid,
      });

      // Update user's document with the reference to the created short
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, {
        shorts: arrayUnion(docRef.id), // Store only the document ID
      }, { merge: true });

      console.log("Document saved correctly in 'shorts' collection with ID:", docRef.id);
      setVideo("")
    } catch (e) {
      console.error("An error occurred while saving record:", e);
    }
  }

  return (
    <View className="flex-1 justify-center items-center">
      {errorMessage ? <Text style={{ color: "red" }}>{errorMessage}</Text> : null}

      {/* <ProgressBar progress={progress} /> */}
      {video &&( <Uploading  video={video} progress={progress} />) }
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        // ...other TextInput props
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        // ...other TextInput props
      />
      <TouchableOpacity
        onPress={pickVideo}
        className="absolute bottom-12 right-6 w-11 h-11 bg-black flex items-center justify-center rounded-full"
      >
        <Ionicons name="videocam" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
