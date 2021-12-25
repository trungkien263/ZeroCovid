import React, {useContext, useEffect, useState} from 'react';
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
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          <Text style={{fontWeight: '700'}}>
            {userData?.fname + ' ' + userData?.lname}
          </Text>
          <Text>{moment(item?.createdAt.toDate()).fromNow()}</Text>
        </View>
      </View>
      {item.post && <Text style={{paddingVertical: 16}}>{item?.post}</Text>}
      {item.postImg && (
        <Image
          source={{uri: item?.postImg}}
          resizeMode="cover"
          style={{
            maxWidth: '100%',
            height: 200,
            borderRadius: 10,
            marginTop: item.content ? 0 : 16,
            //   aspectRatio: 135 / 76,
            //   aspectRatio: 3 / 2,
          }}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 16,
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity style={styles.featureBtn}>
          <Icon name="heart" size={25} color={GlobalStyle.colors.COLOR_BLUE} />
          <Text
            style={[styles.featureTxt, {color: GlobalStyle.colors.COLOR_BLUE}]}>
            {item?.like} Likes
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
          <Text style={styles.featureTxt}>{item?.comment} Comments</Text>
        </TouchableOpacity>
        {user.uid === item.userId && (
          <TouchableOpacity onPress={() => onDeletePost(item.postId)}>
            <FontAwesome
              name="trash-o"
              size={25}
              color={GlobalStyle.colors.COLOR_GRAY}
            />
          </TouchableOpacity>
        )}
      </View>
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
