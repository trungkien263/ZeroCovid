import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import MessageSkeleton from '../components/Skeleton/MessageSkeleton';

const Messages = [
  {
    id: '1',
    userName: 'John Hawking',
    userImg: require('../assets/users/user-3.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
];

export default function MessagesScreen() {
  const navigation = useNavigation();
  const {userDetails} = useSelector(state => state.user);
  const [rooms, setRooms] = useState([]);
  const [partnerId, setPartnerId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      let querySnapshot = await firestore()
        .collection('rooms')
        .where('members', 'array-contains', userDetails.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .catch(err => {
          console.log(err);
        });

      let roomsData = [];
      querySnapshot.forEach(documentSnapshot => {
        const roomInfo = documentSnapshot.data();
        const tmp = roomInfo.members.filter(el => el != userDetails.uid);
        const partnerId = tmp[0];
        setPartnerId(partnerId);
        roomsData.push({...roomInfo, partnerId: partnerId});
      });

      const roomsDetail = await Promise.all(
        roomsData.map(async el => {
          const data = await firestore()
            .collection('users')
            .where('uid', '==', el?.partnerId)
            .get()
            .catch(err => {
              console.log('Error while fetch user', err);
            });

          let tmp = [];
          data.forEach(documentSnapshot => {
            tmp.push(documentSnapshot.data());
          });

          const test = {
            partnerData: tmp[0],
            ...el,
            lastMsg: 'This is a test msg',
          };
          return test;
        }),
      );

      setRooms(roomsDetail);
    } catch (error) {
      console.log('error', error);
      return null;
    }
  };

  useEffect(async () => {
    setIsLoading(true);
    await fetchRooms();
    setIsLoading(false);
  }, []);

  const Message = ({item, partnerId}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile', {
              partnerId: partnerId,
            });
          }}>
          <Image
            source={{uri: item?.partnerData?.userImg}}
            style={{
              width: 60,
              height: 60,
              borderRadius: 40,
              marginBottom: 16,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            paddingLeft: 16,
            marginBottom: 14,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Profile', {
                partnerId: partnerId,
              });
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 6,
              // backgroundColor: 'red',
              maxWidth: '35%',
            }}>
            <Text style={{marginBottom: 4, fontWeight: '700'}}>
              {item.partnerData.fname + ' ' + item.partnerData.lname}
            </Text>
            <Text>{item.messageTime}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingBottom: 4}}
            onPress={() => {
              navigation.push('Chat', {roomInfo: item});
            }}>
            <Text>{item.lastMsg}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <MessageSkeleton />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={item => item.roomId}
          renderItem={({item}) => {
            return <Message item={item} partnerId={partnerId} />;
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
