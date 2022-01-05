import React, {useContext, useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../navigation/AuthProvider';
import moment from 'moment';
import {useNavigation} from '@react-navigation/core';
import firestore from '@react-native-firebase/firestore';

export default function Post({item, onDeletePost, userData}) {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(false);
  const {postId} = item;
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  //   let isRendered = useRef(false);
  const [isDisplayOption, setIsDisplayOption] = useState(false);

  useEffect(async () => {
    // isRendered = true;
    firestore()
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .onSnapshot(snapshot => {
        // if (isRendered) {
        setLikeCount(snapshot.docs.length);
        // }
        snapshot.docs.map(doc => {
          const data = doc.data();
          if (data.creator === user.uid) {
            setIsLiked(true);
            return;
          }
        });
      });

    firestore()
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .onSnapshot(snapshot => {
        // if (isRendered) {
        setCommentCount(snapshot.docs.length);
        // }
      });

    // return () => {
    //   isRendered = false;
    // };
  }, [item]);

  const handleLike = async () => {
    setIsLiked(true);
    await firestore()
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .add({
        creator: user.uid,
        createdAt: firestore.Timestamp.fromDate(new Date()),
        postId: postId,
      })
      .then(() => {
        console.log('Send like successfully!');
      })
      .catch(err => {
        console.log('Error while send like', err);
      });
  };

  const handleUnLike = async () => {
    setIsLiked(false);
    const likedData = await firestore()
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .get()
      .catch(err => {
        console.log('Error while unlike', err);
      });

    likedData.forEach(function (doc) {
      if (doc.data().creator === user.uid) {
        doc.ref.delete();
      }
    });
  };

  useEffect(() => {
    if (isDisplayOption) {
      setTimeout(() => {
        setIsDisplayOption(false);
      }, 2500);
    }
  }, [isDisplayOption]);

  return (
    <View style={[styles.container, {position: 'relative'}]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('HomeProfile', {
                userId: item?.userId,
              });
            }}>
            <Image
              source={{
                uri:
                  (userData && userData?.userImg) ||
                  'https://img.favpng.com/25/13/19/samsung-galaxy-a8-a8-user-login-telephone-avatar-png-favpng-dqKEPfX7hPbc6SMVUCteANKwj.jpg',
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 40,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={{paddingLeft: 10}}>
            <Text style={{fontWeight: '700'}}>{userData?.name}</Text>
            <Text>{moment(item?.createdAt.toDate()).fromNow()}</Text>
          </View>
        </View>
        {user.uid === item.userId && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              paddingVertical: 2,
              paddingHorizontal: 8,
            }}
            onPress={() => {
              setIsDisplayOption(!isDisplayOption);
            }}>
            <FontAwesome
              name="ellipsis-v"
              size={20}
              color={GlobalStyle.colors.COLOR_GRAY}
            />
          </TouchableOpacity>
        )}
      </View>
      {item.post && <Text style={{paddingVertical: 16}}>{item?.post}</Text>}
      {item.postImg && (
        <Image
          source={{uri: item?.postImg}}
          resizeMode="contain"
          style={{
            maxWidth: '100%',
            height: 200,
            borderRadius: 10,
          }}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 16,
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          style={styles.featureBtn}
          onPress={() => {
            !isLiked ? handleLike() : handleUnLike();
          }}>
          <Icon
            name={isLiked ? 'heart' : 'hearto'}
            size={25}
            color={GlobalStyle.colors.COLOR_BLUE}
          />
          <Text
            style={[styles.featureTxt, {color: GlobalStyle.colors.COLOR_BLUE}]}>
            {likeCount ? likeCount : ''} Thích
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.featureBtn}
          onPress={() => {
            navigation.navigate('CommentScreen', {
              postId: item.postId,
              postOwnerId: item.userId,
            });
          }}>
          <FontAwesome
            name="comment"
            size={25}
            color={GlobalStyle.colors.COLOR_GRAY}
          />
          <Text style={styles.featureTxt}>
            {commentCount ? commentCount : ''} Bình luận
          </Text>
        </TouchableOpacity>
      </View>
      {isDisplayOption && user.uid === item.userId && (
        <View
          style={{
            position: 'absolute',
            top: 16,
            right: 38,
            borderRadius: 10,
            paddingVertical: 6,
            paddingHorizontal: 16,
            backgroundColor: '#fff',
          }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddPost', {item: item});
              }}>
              <View style={{flexDirection: 'row'}}>
                <FontAwesome
                  name="edit"
                  size={20}
                  color={GlobalStyle.colors.COLOR_GRAY}
                />
                <Text style={{marginLeft: 10, fontWeight: '700', fontSize: 12}}>
                  Chỉnh sửa
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDeletePost(item.postId)}
              style={{marginTop: 10}}>
              <View style={{flexDirection: 'row'}}>
                <FontAwesome
                  name="trash-o"
                  size={20}
                  color={GlobalStyle.colors.COLOR_GRAY}
                />
                <Text style={{marginLeft: 10, fontWeight: '700', fontSize: 12}}>
                  Xóa
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyle.colors.COLOR_SILVER,
    borderRadius: 10,
    width: '100%',
    padding: 16,
    marginBottom: 16,
  },
  featureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureTxt: {
    paddingLeft: 10,
    fontWeight: '600',
  },
});
