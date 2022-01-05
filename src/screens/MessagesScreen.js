import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import MessageSkeleton from '../components/Skeleton/MessageSkeleton';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const {userDetails} = useSelector(state => state.user);
  const [rooms, setRooms] = useState([]);
  const [partnerId, setPartnerId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();

  useEffect(async () => {
    setIsLoading(true);
    const data = await fetchRooms();
    setIsLoading(false);
    return data;
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const data = await fetchRooms();
    setRefreshing(false);
    return data;
  }, []);

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
        const partnerIndentifyCode = tmp[0];
        setPartnerId(partnerIndentifyCode);
        roomsData.push({...roomInfo, partnerId: partnerIndentifyCode});
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

  const Message = ({item, partnerId}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile', {
              userId: partnerId,
            });
          }}>
          <Image
            source={{
              uri: item?.partnerData?.userImg
                ? item?.partnerData?.userImg
                : 'https://img.favpng.com/25/13/19/samsung-galaxy-a8-a8-user-login-telephone-avatar-png-favpng-dqKEPfX7hPbc6SMVUCteANKwj.jpg',
            }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 40,
              marginBottom: 16,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.push('Chat', {roomInfo: item});
          }}
          style={{
            flex: 1,
            paddingLeft: 16,
            marginBottom: 14,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 6,
              // backgroundColor: 'red',
              //   maxWidth: '35%',
            }}>
            <View>
              <Text style={{marginBottom: 4, fontWeight: '700'}}>
                {item.partnerData.name}
              </Text>
            </View>
            <Text>
              {moment(
                item?.lastMsg
                  ? item?.lastMsg.createdAt.toDate()
                  : item?.createdAt.toDate(),
              ).fromNow()}
            </Text>
          </View>
          <View style={{paddingBottom: 4}}>
            {item?.lastMsg ? (
              <Text style={{fontSize: 12}}>
                {item?.lastMsg.creator === userDetails.uid ? 'Bạn: ' : ''}
                {item?.lastMsg.message}
              </Text>
            ) : (
              <Text style={{fontSize: 12}}>
                {'Gửi tin nhắn đầu tiên cho ' + item.partnerData.name}
              </Text>
            )}
          </View>
        </TouchableOpacity>
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
            console.log('itemmmmm', item);
            return <Message item={item} partnerId={partnerId} />;
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
  },
});
