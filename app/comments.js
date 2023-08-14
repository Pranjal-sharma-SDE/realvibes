import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRecoilValue } from 'recoil';
import { uidAtom, userAtom } from '../context/Atom';
import { collection, query, where, getDocs, addDoc, serverTimestamp,getFirestore,orderBy } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';

export default function Comments({  }) {
  const uid = useRecoilValue(uidAtom);
  const user = useRecoilValue(userAtom);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const item= useLocalSearchParams()
  const db=getFirestore();

  useEffect(() => {
    // Fetch comments associated with the short
    console.log(item)
    const fetchComments = async () => {
      const q = query(
        collection(db, 'shorts', item.docid, 'comments'),
        orderBy('createdAt')
      );

      const querySnapshot = await getDocs(q);
      const fetchedComments = querySnapshot.docs.map(doc => doc.data());
      setComments(fetchedComments);
    };

    fetchComments();
  }, [item.docid]);

  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      return;
    }

    try {
      const commentData = {
        uid: uid,
        userName: user.name,
        commentText: newComment,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'shorts', item.docid, 'comments'), commentData);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <View>
      <Text>Comments</Text>
      {comments.map(comment => (
        <View key={comment.createdAt.toMillis()}>
          <Text>{comment.userName?comments.userName:"Test"}: {comment.commentText}</Text>
        </View>
      ))}
      <TextInput
        placeholder="Add a comment..."
        value={newComment}
        onChangeText={text => setNewComment(text)}
      />
      <Button title="Add Comment" onPress={handleAddComment} />
    </View>
  );
}
