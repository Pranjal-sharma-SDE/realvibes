import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View className="flex h-screen w-screen justify-center items-center bg-fuchsia-600">
      <Text>Home</Text>
      <Link href={"/feeds"}>Feed</Link>
    </View>
  );
}