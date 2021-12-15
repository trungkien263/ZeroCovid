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
} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {AuthContext} from '../navigation/AuthProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Keyboard} from 'react-native';
import moment from 'moment';

const {width} = Dimensions.get('window');
export default function CommentScreen({route}) {
  const {user} = useContext(AuthContext);
  const postIdParam = route.params.postId;
  const {postOwnerId} = route.params;
  const {allUsers} = useSelector(state => state.users);

  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    console.log('=========allUsers', allUsers);
    // function matchUserToComment(cmts) {
    //   for (let i = 0; i < cmts.length; i++) {
    //     if (cmts[i].hasOwnProperty('user')) {
    //       continue;
    //     }

    //     const user = props.users.find(x => x.uid === cmts[i].creator);
    //     if (user == undefined) {
    //       props.fetchUsersData(cmts[i].creator, false);
    //     } else {
    //       cmts[i].user = user;
    //     }
    //   }
    //   setComments(cmts);
    // }

    if (postIdParam !== postId) {
      firestore()
        .collection('posts')
        .doc(postIdParam)
        // .collection('users')
        // .doc(postIdParam)
        .collection('comments')
        .orderBy('createdAt', 'asc')
        .onSnapshot(snapshot => {
          let commentsData = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return {id, ...data};
          });
          setComments(commentsData);
        });
      setPostId(postIdParam);
    } else {
      //   matchUserToComment(comments);
    }
  }, []);

  console.log('comments', comments);

  const handleSendComment = async () => {
    await firestore()
      .collection('posts')
      .doc(postIdParam)
      // .collection('users')
      // .doc(postIdParam)
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <FlatList
          data={comments}
          renderItem={({item}) => {
            return (
              <View style={{marginBottom: 10}}>
                <View
                  style={{
                    backgroundColor: GlobalStyle.colors.COLOR_SILVER,
                    padding: 16,
                    borderRadius: 10,
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 4,
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
                    <TouchableOpacity style={{marginLeft: 20}}>
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
                    {moment(item?.createdAt.toDate()).fromNow()}
                  </Text>
                </View>
              </View>
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
              backgroundColor: GlobalStyle.colors.COLOR_BLUE,
              paddingHorizontal: 10,
              borderRadius: 8,
              paddingVertical: 6,
              height: 40,
              justifyContent: 'center',
            }}>
            <Text style={{color: GlobalStyle.colors.COLOR_WHITE}}>Cmt</Text>
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
