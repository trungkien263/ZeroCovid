import React from 'react';
import {Image, TouchableOpacity} from 'react-native';

export default function Avatar({user, onPress, style, imgStyle, tickStyle}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          position: 'relative',
        },
        {...style},
      ]}>
      <Image
        source={
          user?.userImg
            ? {
                uri: user?.userImg,
              }
            : require('../assets/defaultAvatar.png')
        }
        style={[
          {
            width: 60,
            height: 60,
            borderRadius: 40,
          },
          {...imgStyle},
        ]}
        resizeMode="cover"
      />
      {user?.role === 1 && (
        <Image
          source={require('../assets/check.png')}
          style={[
            {
              width: 20,
              height: 20,
              borderRadius: 40,
              position: 'absolute',
              bottom: 0,
              right: 0,
            },
            {...tickStyle},
          ]}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
}
