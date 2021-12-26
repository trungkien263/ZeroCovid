import moment from 'moment';
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function CommentItem({item, user, navigation}) {
  const handleDelete = () => {
    alert('KKKKKKK');
  };
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
              {moment(item?.cmtTimestamp.toDate()).fromNow()}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: GlobalStyle.colors.COLOR_SILVER,
              borderRadius: 10,
              padding: 16,
            }}>
            <Text>KKKKKKKKKK</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
