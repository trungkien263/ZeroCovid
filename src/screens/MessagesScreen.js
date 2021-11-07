import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';

const Messages = [
  {
    id: '1',
    userName: 'John Hawking',
    userImg: require('../assets/users/user-3.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-1.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.jpg'),
    messageTime: '1 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.jpg'),
    messageTime: '1 day ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-7.jpg'),
    messageTime: '2 days ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
];

export default function MessagesScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <FlatList
        data={Messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Profile');
                }}>
                <Image
                  source={item?.userImg}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 40,
                    marginBottom: 16,
                  }}
                />
              </TouchableOpacity>
              <View style={{flex: 1, paddingLeft: 16, marginTop: 6}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginBottom: 4}}>{item.userName}</Text>
                  <Text>{item.messageTime}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Chat', {userName: item.userName});
                  }}>
                  <Text>{item.messageText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
