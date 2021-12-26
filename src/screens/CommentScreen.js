import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {AuthContext} from '../navigation/AuthProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Keyboard} from 'react-native';
import moment from 'moment';
import CommentItem from '../components/CommentItem';

const {width} = Dimensions.get('window');
export default function CommentScreen({route, navigation}) {
  const {user} = useContext(AuthContext);
  const postIdParam = route.params.postId;
  const allUsers = useSelector(state => state.users.allUsers);

  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');
  const [content, setContent] = useState('');
  const [toggleAnswer, setToggleAnswer] = useState(false);

  useEffect(() => {
    if (postIdParam !== postId) {
      fetchComment();
    }
  }, []);

  const fetchComment = () => {
    firestore()
      .collection('posts')
      .doc(postIdParam)
      .collection('comments')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        const cmt = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('dataaaaaaaaaaaa', data);
          const id = doc.id;
          const ownerCmt = allUsers.find(el => el.uid === data?.creator);
          const cmtTimestamp = data.createdAt;
          return {id, ...data, ...ownerCmt, cmtTimestamp};
        });
        setComments(cmt);
      });
    setPostId(postIdParam);
  };

  const handleSendComment = async () => {
    await firestore()
      .collection('posts')
      .doc(postIdParam)
      .collection('comments')
      .add({
        content: content,
        creator: user.uid,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        setContent('');
        Keyboard.dismiss();
      })
      .catch(err => {
        console.log('Error while send comment', err);
      });
  };

  const handleDelete = cmtId => {
    Alert.alert('Delete comment', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('canceled!'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => deleteFirestoreData(cmtId),
      },
    ]);
  };

  const deleteFirestoreData = cmtId => {
    firestore()
      .collection('posts')
      .doc(postIdParam)
      .collection('comments')
      .doc(cmtId)
      .delete()
      .then(() => {
        Alert.alert(
          'Comment deleted!',
          'Your comment has been deleted Successfully!',
        );
      })
      .catch(err => {
        console.log('Error while delete the comment', err);
      });
  };

  const CmtItem = ({item}) => {
    return (
      <View style={{marginBottom: 10}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => {
              navigation.navigate('HomeProfile', {
                userId: item.creator,
              });
            }}>
            <Image
              source={{
                uri:
                  (item && item?.userImg) ||
                  'https://img.favpng.com/25/13/19/samsung-galaxy-a8-a8-user-login-telephone-avatar-png-favpng-dqKEPfX7hPbc6SMVUCteANKwj.jpg',
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
              }}
            />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                backgroundColor: GlobalStyle.colors.COLOR_SILVER,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  marginBottom: 4,
                }}>
                {item?.fname + ' ' + item?.lname}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{maxWidth: '90%'}}>{item.content}</Text>
                {item?.creator === user.uid && (
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <FontAwesome
                      name="trash-o"
                      size={25}
                      color={GlobalStyle.colors.COLOR_GRAY}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 4,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 12,
                      color: GlobalStyle.colors.COLOR_BLUE,
                    }}>
                    Like
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginLeft: 20}}
                  onPress={() => {
                    setToggleAnswer(!toggleAnswer);
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: GlobalStyle.colors.COLOR_BLUE,
                    }}>
                    Answer
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={{fontSize: 12}}>
                {moment(item?.cmtTimestamp.toDate()).fromNow()}
              </Text>
            </View>
            {toggleAnswer && (
              <View
                style={{
                  flex: 1,
                  backgroundColor: GlobalStyle.colors.COLOR_SILVER,
                  borderRadius: 10,
                  padding: 16,
                }}>
                <Text>KKKKKKKKKK</Text>
                <Text>KKKKKKKKKK</Text>
                <Text>KKKKKKKKKK</Text>
                <Text>KKKKKKKKKK</Text>
                <Text>KKKKKKKKKK</Text>
                <Text>KKKKKKKKKK</Text>
                <Text>KKKKKKKKKK</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <FlatList
          data={comments}
          renderItem={({item}) => {
            return <CmtItem item={item} />;
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 6,
          }}>
          <View style={{flex: 1, marginRight: 10}}>
            <TextInput
              placeholder="Enter your comment here..."
              placeholderTextColor={GlobalStyle.colors.COLOR_GRAY}
              style={{
                backgroundColor: GlobalStyle.colors.COLOR_SILVER,
                borderRadius: 10,
                paddingHorizontal: 10,
                maxHeight: 140,
                color: '#000',
              }}
              onChangeText={txt => setContent(txt)}
              multiline={true}
              value={content}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              handleSendComment();
            }}
            disabled={content === ''}
            style={{
              //   backgroundColor: GlobalStyle.colors.COLOR_BLUE,
              paddingHorizontal: 10,
              borderRadius: 8,
              paddingVertical: 6,
              height: 40,
              justifyContent: 'center',
            }}>
            {/* <Text style={{color: GlobalStyle.colors.COLOR_WHITE}}>Cmt</Text> */}
            <Ionicons
              name="send"
              size={25}
              color={GlobalStyle.colors.COLOR_BLUE}
            />
          </TouchableOpacity>
        </View>
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
