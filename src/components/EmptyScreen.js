import {View, Text, Image, Dimensions} from 'react-native';
import React from 'react';

export default function EmptyScreen({title = 'Không có dữ liệu!', style}) {
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          marginTop: 150,
        },
        {...style},
      ]}>
      <Image
        source={require('../assets/empty.png')}
        style={{
          width: 150,
          height: 150,
          //   marginTop: 150,
        }}
      />
      <Text style={{marginTop: 20}}>{title}</Text>
    </View>
  );
}
