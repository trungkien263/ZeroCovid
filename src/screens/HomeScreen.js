import React, {useContext} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import Post from '../components/Post';
import {GlobalStyle} from '../config/globalStyle';

export default function HomeScreen() {
  const {user, logout} = useContext(AuthContext);

  const data = [
    {
      userName: 'Tzuyu',
      createdAt: 5,
      content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
      like: 69,
      comment: 96,
      avatar: require('../assets/tzuyu.jpg'),
      imageUrl: require('../assets/posts/post-img-1.jpg'),
    },
    {
      userName: 'Taylor Swift',
      createdAt: 5,
      content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
      like: 69,
      comment: 96,
      avatar: require('../assets/tzuyu.jpg'),
      imageUrl: require('../assets/posts/post-img-2.jpg'),
    },
    {
      userName: 'Maria Ozawa',
      createdAt: 5,
      content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
      like: 69,
      comment: 96,
      avatar: require('../assets/tzuyu.jpg'),
      imageUrl: require('../assets/posts/post-img-3.jpg'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {data.map((item, index) => (
        <Post key={index} item={item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 16,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
  },
});
