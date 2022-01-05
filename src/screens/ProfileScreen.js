import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import Post from '../components/Post';
import ProfileSkeleton from '../components/Skeleton/ProfileSkeleton';
import {GlobalStyle} from '../config/globalStyle';
import {AuthContext} from '../navigation/AuthProvider';

export default function ProfileScreen({navigation, route}) {
  const {user, logout} = useContext(AuthContext);
  const {userDetails} = useSelector(state => state.user);
  const partnerId = route.params ? route.params.userId : userDetails?.uid;

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchPosts = async () => {
    try {
      let querySnapshot = await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
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

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(async () => {
    setIsLoading(true);
    await fetchPosts();
    await getUser();
    setIsLoading(false);
  }, [partnerId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
      getUser();
    }, [refresh]),
  );

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
                return null;
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
        return null;
      });
  };

  const initChat = async () => {
    let roomId = user?.uid + partnerId;
    let isRoomExist = false;

    let querySnapshot = await firestore()
      .collection('rooms')
      .where('members', 'array-contains', userDetails?.uid)
      .get()
      .catch(err => {
        console.log(err);
      });

    console.log('==========partnerId', partnerId);
    let roomData;
    querySnapshot.forEach(documentSnapshot => {
      const room = documentSnapshot.data();
      const members = room.members;
      const rId = members.find(el => el === partnerId);
      console.log('memberssssssssss', rId + ' - ' + documentSnapshot.id);
      if (rId !== undefined) {
        isRoomExist = true;
        roomId = documentSnapshot.id;
        roomData = room;
      }
    });

    const roomInfo = {partnerData: userData, partnerId, roomId, ...roomData};

    console.log('roomInforoomInfo', roomInfo);

    if (isRoomExist) {
      navigation.navigate('Messages', {
        screen: 'Chat',
        params: {
          roomInfo,
        },
      });
    } else {
      await firestore()
        .collection('rooms')
        .doc(roomId)
        .set({
          members: [user.uid, partnerId],
          roomId: roomId,
          createdAt: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          navigation.navigate('Messages', {
            screen: 'Chat',
            params: {
              partnerInfo: userData,
              roomId: roomId,
            },
          });
        })
        .catch(err => {
          console.log('Error while send comment', err);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ScrollView>
          <ProfileSkeleton />
        </ScrollView>
      ) : (
        <ScrollView style={{padding: 16}}>
          <Image
            style={styles.userImg}
            source={
              userData?.userImg !== null
                ? {
                    uri: userData?.userImg,
                  }
                : require('../assets/defaultAvatar.png')
            }
          />
          <Text style={styles.userName}>{userData?.name}</Text>
          {partnerId !== userDetails?.uid ? (
            <View
              style={{
                flex: 1,
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  initChat();
                }}>
                <Text style={styles.textBtn}>Nhắn tin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, {marginLeft: 10}]}>
                <Text style={styles.textBtn}>Follow</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  navigation.navigate('EditProfile');
                }}>
                <Text style={styles.textBtn}>Chỉnh sửa trang cá nhân</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.userInfoWrapper}>
            <View style={styles.userInfoItem}>
              <Text style={styles.userName}>{posts.length}</Text>
              <Text>Bài viết</Text>
            </View>
          </View>
          <View style={styles.postArea}>
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
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 80,
    alignSelf: 'center',
  },
  userName: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  aboutUser: {
    textAlign: 'center',
    marginTop: 8,
  },
  btn: {
    borderWidth: 2,
    borderColor: GlobalStyle.colors.COLOR_BLUE,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    borderRadius: 4,
  },
  textBtn: {
    color: GlobalStyle.colors.COLOR_BLUE,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  userInfoWrapper: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userInfoItem: {
    alignItems: 'center',
  },
  postArea: {
    marginTop: 20,
  },
});
