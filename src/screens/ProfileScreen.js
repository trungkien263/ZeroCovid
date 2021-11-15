import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import FormButton from '../components/FormButton';
import {GlobalStyle} from '../config/globalStyle';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import Post from '../components/Post';
import {useFocusEffect} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import ProfileSkeleton from '../components/Skeleton/ProfileSkeleton';

export default function ProfileScreen({navigation, route}) {
  const {user, logout} = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [userData, setUserData] = useState(null);

  //   const isFocused = useIsFocused();

  const fetchPosts = async () => {
    try {
      const postList = [];
      setIsLoading(true);
      await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .then(querySnapshot => {
          //   console.log('Total users: ', querySnapshot.size);

          querySnapshot.forEach(documentSnapshot => {
            const {post, postImg, createdAt, likes, comments, userId} =
              documentSnapshot.data();
            postList.push({
              userName: 'Test name',
              createdAt: createdAt,
              content: post,
              like: likes,
              comment: comments,
              avatar: postImg,
              imageUrl: postImg,
              userId,
              postId: documentSnapshot.id,
            });
          });
        });

      setPosts(postList);
      setIsLoading(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('user data--------------', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  //   const handleDelete = postId => {
  //     Alert.alert('Delete post', 'Are you sure?', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('canceled!'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: () => deletePost(postId),
  //       },
  //     ]);
  //   };

  //   useEffect(() => {
  //     fetchPosts();
  //   }, []);

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
            source={{
              uri: userData
                ? userData?.userImg
                : 'https://img.favpng.com/25/13/19/samsung-galaxy-a8-a8-user-login-telephone-avatar-png-favpng-dqKEPfX7hPbc6SMVUCteANKwj.jpg',
            }}
          />
          <Text style={styles.userName}>
            {userData ? userData?.fname + ' ' + userData?.lname : 'Test user'}
          </Text>
          <Text style={styles.aboutUser}>{userData && userData?.about}</Text>
          {route.params ? (
            <View
              style={{
                flex: 1,
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.textBtn}>Message</Text>
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
                <Text style={styles.textBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, {marginLeft: 10}]}
                onPress={logout}>
                <Text style={styles.textBtn}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.userInfoWrapper}>
            <View style={styles.userInfoItem}>
              <Text style={styles.userName}>{posts.length}</Text>
              <Text>Posts</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userName}>10,000</Text>
              <Text>Followers</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userName}>100</Text>
              <Text>Following</Text>
            </View>
          </View>

          <View style={styles.postArea}>
            {posts.map((item, index) => {
              return (
                <Post key={index} item={item} onDeletePost={handleDelete} />
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
