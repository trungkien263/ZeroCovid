import React from 'react';
import {Dimensions, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const windowWidth = Dimensions.get('window').width;

export default function MessageSkeleton() {
  const data = [];
  for (let i = 0; i < 14; i++) {
    data.push(i);
  }
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          flexDirection: 'column',
        }}>
        {/* Msg Item */}
        {data.map((el, i) => (
          <View key={i} style={{flexDirection: 'row', marginBottom: 10}}>
            <View style={{width: 60, height: 60, borderRadius: 100}} />
            <View style={{marginTop: 6, marginLeft: 12}}>
              <View style={{width: 160, height: 20, borderRadius: 4}} />
              <View
                style={{
                  marginTop: 6,
                  width: windowWidth,
                  height: 20,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
}
