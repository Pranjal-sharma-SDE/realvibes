import { FontAwesome } from "@expo/vector-icons";
// import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from 'expo-router/tabs';
import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";

// Define your tab icons
const TabIcons = {
  home: "home", // Change to your preferred home icon
  profile: "user", // Change to your preferred profile icon
  upload: "upload", // Change to your preferred upload icon
};

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: Platform.OS === "ios" && {
          backgroundColor: "transparent",
        },
        headerShown: false,
       tabBarShowLabel: false,
        tabBarActiveTintColor: "#FF0066", // Set the active color
      }}
      // tabBar={(props) =>
      //   Platform.OS === "ios" ? (
      //     <BlurView
      //       style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      //       intensity={95}
      //     >
      //       <BottomTabBar {...props} />
      //     </BlurView>
      //   ) : (
      //     <BottomTabBar {...props} />
      //   )
      // }
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          href: "/home",
          title: "",
          tabBarIcon: ({ color }) => (
            <TabIcon name={TabIcons.home} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          headerShown: false,
          href: {
            pathname: "/profile",
          },
          tabBarIcon: ({ color }) => (
            <TabIcon name={TabIcons.profile} color={color} />
          ),
        }}
      />

      {/* Upload Tab */}
      <Tabs.Screen
        name="upload"
        options={{
          title: "",
          headerShown: false,
          href: {
            pathname: "/upload",
          },
          tabBarIcon: ({ color }) => (
            <TabIcon name={TabIcons.upload} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const TabIcon = ({ name, color }) => (
  <View style={styles.tabIconContainer}>
    <FontAwesome name={name} color={color} size={24} />
    <Text style={styles.tabIconText}>{capitalizeFirstLetter(name)}</Text>
  </View>
);

const capitalizeFirstLetter = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const styles = StyleSheet.create({
  tabIconContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10, // Adjust as needed
    backgroundColor: "transparent",
  },
  tabIconText: {
    marginTop: 5,
    fontSize: 10,
    opacity: 0.5,
  },
});
