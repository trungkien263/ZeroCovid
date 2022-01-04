import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import Post from '../components/Post';
import {GlobalStyle} from '../config/globalStyle';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import HomeSkeleton from '../components/Skeleton/HomeSkeleton';

import PushNotification from 'react-native-push-notification';

import {useDispatch, useSelector} from 'react-redux';
import {
  actFetchCovidCasesRequest,
  actFetchCovidCasesWorldRequest,
  actFetchUserDetailsRequest,
  actFetchAllUsersRequest,
} from '../actions';

import messaging from '@react-native-firebase/messaging';

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

  //   console.log('useruseruseruser', user);

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
        if (postInfo.deleteFlag === false) {
          postsData.push({...postInfo, postId: documentSnapshot.id});
        }
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
    Alert.alert('Xóa bài viết', 'Bạn có chắc chắn muốn xóa bài viết?', [
      {
        text: 'Hủy bỏ',
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
    const data = await fetchPosts();
    setIsLoading(false);

    return () => {
      setPosts([]);
      data;
    };
  }, [refresh]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, []),
  );

  //   const deletePost = postId => {
  //     firestore()
  //       .collection('posts')
  //       .doc(postId)
  //       .get()
  //       .then(documentSnapshot => {
  //         if (documentSnapshot.exists) {
  //           const {postImg} = documentSnapshot.data();
  //           if (postImg !== null) {
  //             const storageRef = storage().refFromURL(postImg);
  //             const imageRef = storage().ref(storageRef.fullPath);

  //             imageRef
  //               .delete()
  //               .then(() => {
  //                 console.log(`${postImg} has been deleted successfully!`);
  //                 deleteFirestoreData(postId);
  //                 setRefresh(!refresh);
  //               })
  //               .catch(err => {
  //                 console.log('Error while delete the image', err);
  //               });
  //             // if the post image is not available
  //           } else {
  //             deleteFirestoreData(postId);
  //             setRefresh(!refresh);
  //           }
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   };

  const deletePost = postId => {
    firestore()
      .collection('posts')
      .doc(postId)
      .update({
        deleteFlag: true,
      })
      .then(() => {
        setRefresh(!refresh);
        console.log('Post deleted');
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
        Alert.alert('Đã xóa bài viết!', 'Bài viết đã được xóa thành công!');
      })
      .catch(err => {
        console.log('Error while delete the post', err);
      });
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const data = fetchPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    return data;
  }, []);

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'test-channel',
    });
  };

  const handleNotification = () => {
    PushNotification.localNotification({
      channelId: 'test-channel',
      title: 'Test title',
      message: 'Test message',
      bigText: 'Kien Dz Qua',
    });

    // PushNotification.localNotificationSchedule({
    //   channelId: 'test-channel',
    //   title: 'Alarm',
    //   message: 'Test message',
    //   date: new Date(Date.now() + 5 * 1000),
    //   allowWhileIdle: true,
    // });
  };

  useEffect(() => {
    createChannels();
  }, []);

  // Request permission for iOS only
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(async () => {
    // await requestUserPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
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
      {/* <TouchableOpacity
        style={{padding: 10, backgroundColor: 'orange'}}
        onPress={() => {
          handleNotification();
        }}>
        <Text>TEST LOCAL NOTIFICATION</Text>
      </TouchableOpacity> */}
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
