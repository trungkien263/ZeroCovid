import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../navigation/AuthProvider';
import moment from 'moment';
import {useNavigation} from '@react-navigation/core';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

export default function DietItem({item, onDeletePost, userData}) {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [isDisplayOption, setIsDisplayOption] = useState(false);
  const {userDetails} = useSelector(state => state.user);

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

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
        {userDetails.role === 1 && (
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
      {item.content && (
        <View>
          <Text
            onTextLayout={onTextLayout}
            numberOfLines={textShown ? undefined : 4}
            style={{paddingVertical: 16}}>
            {item?.content}
          </Text>
          {lengthMore ? (
            <Text
              onPress={toggleNumberOfLines}
              style={{lineHeight: 21, marginVertical: 10, fontWeight: '600'}}>
              {textShown ? 'Ẩn' : 'Xem thêm'}
            </Text>
          ) : null}
        </View>
      )}
      {item.foodImage && (
        <Image
          source={{uri: item?.foodImage}}
          resizeMode="cover"
          style={{
            maxWidth: '100%',
            height: 200,
            borderRadius: 10,
          }}
        />
      )}
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
          }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddFood', {item: item});
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
