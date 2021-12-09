import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default function CommentScreen({route}) {
  const postIdParam = route.params.postId;
  const {postOwnerId} = route.params;

  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (postIdParam !== postId) {
      firestore()
        .collection('posts')
        .doc(postIdParam)
        // .collection('users')
        // .doc(postIdParam)
        .collection('comments')
        .get()
        .then(snapshot => {
          let commentsData = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return {id, ...data};
          });
          setComments(commentsData);
        });
      setPostId(postIdParam);
    }
  }, [postIdParam]);

  console.log('comments', comments);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text>CMT SCREEN</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
  },
});
