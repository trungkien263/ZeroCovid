import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import Post from '../components/Post';
import {GlobalStyle} from '../config/globalStyle';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import HomeSkeleton from '../components/Skeleton/HomeSkeleton';

import {useDispatch, useSelector} from 'react-redux';
import {
  actFetchCovidCasesRequest,
  actFetchCovidCasesWorldRequest,
  actFetchUserDetailsRequest,
  actFetchAllUsersRequest,
} from '../actions';

export default function HomeScreen({navigation, route}) {
  const {user, logout} = useContext(AuthContext);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    dispatch(actFetchCovidCasesRequest());
    dispatch(actFetchCovidCasesWorldRequest());
    dispatch(actFetchUserDetailsRequest(user.uid));
    // dispatch(actFetchAllUsersRequest());
  }, []);

  useEffect(() => {
    console.log('========posts%', posts);
  }, [posts]);

  const fetchPosts = async () => {
    try {
      let postList = [];

      await firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(async documentSnapshot => {
            const {post, postImg, createdAt, userId} = documentSnapshot.data();
            // const userData = allUsers.find(el => el.uid === userId);
            // let userData;
            await firestore()
              .collection('users')
              .where('uid', '==', userId)
              .get()
              .then(snapshot => {
                const userData = snapshot.docs[0].data();
                console.log('==========userData', userData);
                if (userData) {
                  postList.push({
                    createdAt: createdAt,
                    content: post,
                    imageUrl: postImg,
                    userId,
                    postId: documentSnapshot.id,
                    userData,
                  });
                }
                console.log('==========postList***', postList);
              })
              .catch(err => {
                console.log('Error while fetch user', err);
              });
          });
          setPosts(postList);
        });
      // .then(() => {
      //   console.log('==========postList after***%', postList);
      //   setPosts(postList);
      // });

      //   setPosts(postList);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleDelete = postId => {
    Alert.alert('Delete post', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('canceled!'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => deletePost(postId),
      },
    ]);
  };

  useEffect(async () => {
    setIsLoading(true);
    await dispatch(actFetchAllUsersRequest());
    await fetchPosts();
    setIsLoading(false);
  }, [refresh]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [refresh]),
  );

  const deletePost = postId => {
    console.log('post ID', postId);

    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();
          if (postImg !== null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been deleted successfully!`);
                deleteFirestoreData(postId);
                setRefresh(!refresh);
              })
              .catch(err => {
                console.log('Error while delete the image', err);
              });
            // if the post image is not available
          } else {
            deleteFirestoreData(postId);
            setRefresh(!refresh);
          }
        }
      });
  };

  const deleteFirestoreData = postId => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert(
          'Post deleted!',
          'Your post has been deleted Successfully!',
        );
      })
      .catch(err => {
        console.log('Error while delete the post', err);
      });
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  //   const data = [
  //     {
  //       userName: 'Tzuyu',
  //       createdAt: 5,
  //       content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
  //       like: 69,
  //       comment: 96,
  //       avatar: require('../assets/tzuyu.jpg'),
  //       imageUrl: require('../assets/posts/post-img-1.jpg'),
  //     },
  //     {
  //       userName: 'Taylor Swift',
  //       createdAt: 5,
  //       content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
  //       like: 69,
  //       comment: 96,
  //       avatar: require('../assets/tzuyu.jpg'),
  //       imageUrl: require('../assets/posts/post-img-2.jpg'),
  //     },
  //     {
  //       userName: 'Maria Ozawa',
  //       createdAt: 5,
  //       content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
  //       like: 69,
  //       comment: 96,
  //       avatar: require('../assets/tzuyu.jpg'),
  //       imageUrl: require('../assets/posts/post-img-3.jpg'),
  //     },
  //   ];

  return isLoading ? (
    <ScrollView>
      <HomeSkeleton />
    </ScrollView>
  ) : (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {posts.map((item, index) => {
        return (
          <Post
            key={index}
            userData={item.userData}
            item={item}
            onDeletePost={handleDelete}
          />
        );
      })}
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
