import { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, FlatList, Platform,TextInput,Text,StyleSheet,Alert, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import { addDoc, collection, doc, setDoc, onSnapshot, getFirestore, arrayUnion } from "firebase/firestore";
import { Video } from "expo-av";
import Uploading from "../../components/uploading";
import ProgressBar from "../../components/progressBar";
import { useRecoilValue } from "recoil";
import { uidAtom,userAtom } from "../../context/Atom";
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
  const user=useRecoilValue(userAtom);

  async function pickVideo() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspects: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const videoUri = result.assets[0].uri;
      if (title.trim() === "" || description.trim() === "") {
        // Show an alert if either title or description is empty
        Alert.alert("Missing Information", "Video title and description are required.");
      } else {
        setErrorMessage(""); // Clear any previous error message
        setVideo(videoUri);
        await uploadVideo(videoUri, "video");
      }
    
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
        createrName:user.name
      });

      // Update user's document with the reference to the created short
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, {
        shorts: arrayUnion(docRef.id), // Store only the document ID
      }, { merge: true });

      console.log("Document saved correctly in 'shorts' collection with ID:", docRef.id);
      setVideo("")
      setTitle("");
      setDescription("");
    } catch (e) {
      console.error("An error occurred while saving record:", e);
    }
  }

  return (
    <ImageBackground source={{uri:"https://res.cloudinary.com/dqhyudo4x/image/upload/v1690787113/Portfolio/vision.b5972a79_su8nf2.webp"}} style={styles.backgroundImage}>
    <View style={styles.container}>
      <Text style={styles.headerText}>Upload Your Video</Text>
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      {video && <Uploading video={video} progress={progress} />}

      <View style={styles.inputContainer}>
        
      <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />

      </View>

      <TouchableOpacity onPress={pickVideo} style={styles.uploadButton}>
        <Ionicons name="videocam" size={30} color="white" />
        <Text style={styles.uploadButtonText}>Pick Video</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
  );
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust background overlay color
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    color: "white",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0066",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  
});