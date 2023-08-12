import React from 'react';
import { View, Text } from 'react-native';
import { useRecoilValue } from 'recoil'; // Import the useRecoilValue hook
import { userAtom } from '../../context/Atom'; // Update this with the correct path to your userAtom

export default function Upload() {
  // Get the userAtom value using the useRecoilValue hook
  const user = useRecoilValue(userAtom);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Image: {user.Image}</Text>
      <Text>UID: {user.uid}</Text>
    </View>
  );
}
