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
    dispatch(actFetchAllUsersRequest());
  }, []);

  const fetchPosts = async () => {
    try {
      let querySnapshot = await firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .catch(err => {
          console.log(err);
        });

      let postsData = [];
      querySnapshot.forEach(documentSnapshot => {
        const postInfo = documentSnapshot.data();
        postsData.push({...postInfo, postId: documentSnapshot.id});
      });

      const postsDetail = await Promise.all(
        postsData.map(async el => {
          const data = await firestore()
            .collection('users')
            .where('uid', '==', el?.userId)
            .get()
            .catch(err => {
              console.log('Error while fetch user', err);
            });

          let tmp = [];
          data.forEach(documentSnapshot => {
            tmp.push(documentSnapshot.data());
          });

          const test = {userData: tmp[0], ...el};
          return test;
        }),
      );

      setPosts(postsDetail);
    } catch (err) {
      console.log(err);
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
    await fetchPosts();
    setIsLoading(false);
  }, [refresh]);

  //   useEffect(() => {
  //     console.log('========posts00+++', posts);
  //   }, [posts]);

  //   useFocusEffect(
  //     React.useCallback(() => {
  //       fetchPosts();
  //     }, []),
  //   );

  const deletePost = postId => {
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
      })
      .catch(err => {
        console.log(err);
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
