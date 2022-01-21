import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import Avatar from './Avatar';
import {useNavigation} from '@react-navigation/native';

export default function CommentItem({item, user, onDeleteCmt, onEditCmt}) {
  const {userDetails} = useSelector(state => state.user);
  const [toggleAnswer, setToggleAnswer] = useState(false);
  const [isDisplayOption, setIsDisplayOption] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (isDisplayOption) {
      setTimeout(() => {
        setIsDisplayOption(false);
      }, 2500);
    }
  }, [isDisplayOption]);

  return (
    <View style={{marginBottom: 10, position: 'relative'}}>
      <View style={{flexDirection: 'row'}}>
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}
        <Avatar
          user={item}
          onPress={() => {
            navigation.navigate('HomeProfile', {
              userId: item?.uid,
            });
          }}
          imgStyle={{
            width: 40,
            height: 40,
            borderRadius: 40,
          }}
          style={{marginRight: 10, width: 40, height: 40, borderRadius: 40}}
          tickStyle={{width: 14, height: 14}}
        />
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              backgroundColor: GlobalStyle.colors.COLOR_SILVER,
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 10,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  marginBottom: 4,
                }}>
                {item?.name}
              </Text>
              {userDetails.uid === item.creator && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    paddingVertical: 2,
                    paddingLeft: 16,
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{maxWidth: '90%'}}>{item.content}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 4,
            }}>
            {/* <View
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
            </View> */}
            <Text style={{fontSize: 12}}>
              {moment(item?.cmtTimestamp.toDate()).fromNow()}
            </Text>
          </View>
          {isDisplayOption && (
            <View
              style={{
                position: 'absolute',
                top: 16,
                right: 38,
                borderRadius: 10,
                paddingVertical: 6,
                paddingHorizontal: 16,
                backgroundColor: '#fff',
                borderWidth: 1,
                // borderColor: GlobalStyle.colors.COLOR_GRAY,
                borderColor: '#ddd',
              }}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    onEditCmt(item.id, item.content);
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <FontAwesome
                      name="edit"
                      size={20}
                      color={GlobalStyle.colors.COLOR_GRAY}
                    />
                    <Text
                      style={{marginLeft: 10, fontWeight: '700', fontSize: 12}}>
                      Chỉnh sửa
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDeleteCmt(item.id)}
                  style={{marginTop: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    <FontAwesome
                      name="trash-o"
                      size={20}
                      color={GlobalStyle.colors.COLOR_GRAY}
                    />
                    <Text
                      style={{marginLeft: 10, fontWeight: '700', fontSize: 12}}>
                      Xóa
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
