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
  const [isEditting, setIsEditting] = useState(false);
  const [currentCmtId, setCurrentCmtId] = useState('');

  useEffect(() => {
    let data;
    if (postIdParam !== postId) {
      data = fetchComment();
    }
    return data;
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
        updatedAt: firestore.Timestamp.fromDate(new Date()),
        postId: postIdParam,
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
    Alert.alert('X??a b??nh lu???n', 'B???n ch???c ch???n mu???n x??a b??nh lu???n n??y?', [
      {
        text: 'H???y b???',
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
          '???? x??a b??nh lu???n!',
          'B??nh lu???n c???a b???n ???? ???????c x??a th??nh c??ng!',
        );
      })
      .catch(err => {
        console.log('Error while delete the comment', err);
      });
  };

  const sendEditedCmt = async () => {
    await firestore()
      .collection('posts')
      .doc(postIdParam)
      .collection('comments')
      .doc(currentCmtId)
      .update({
        content: content,
        creator: user.uid,
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        setContent('');
        Keyboard.dismiss();
      })
      .catch(err => {
        console.log('Error while send comment', err);
      });
  };

  const handleEditCmt = async (cmtId, cmtContent) => {
    setContent(cmtContent);
    setCurrentCmtId(cmtId);
    setIsEditting(true);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <FlatList
          data={comments}
          renderItem={({item}) => {
            return (
              <CommentItem
                item={item}
                onEditCmt={handleEditCmt}
                onDeleteCmt={handleDelete}
                user={user}
              />
            );
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
              placeholder="Nh???p b??nh lu???n c???a b???n..."
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
              isEditting ? sendEditedCmt() : handleSendComment();
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
