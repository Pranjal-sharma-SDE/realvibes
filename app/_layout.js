import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthProvider";
import { RecoilRoot } from "recoil";

export default function RootLayout() {
  return (
    <RecoilRoot>
    <AuthProvider>
     
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="feeds"
          options={{
            title: "",
            headerShown: true,
            headerTransparent: Platform.OS === "ios",
            headerBlurEffect: "regular",
          }}
        />
      </Stack>
    
    </AuthProvider>
    </RecoilRoot>
  );
}
