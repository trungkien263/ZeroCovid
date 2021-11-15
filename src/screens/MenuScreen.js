import React from 'react';
import {Dimensions, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const windowWidth = Dimensions.get('window').width;

export default function MenuScreen() {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          flexDirection: 'column',
          padding: 16,
        }}>
        {/* Card Item */}
        <View style={{paddingHorizontal: 16}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{width: 60, height: 60, borderRadius: 50}} />
            <View style={{marginLeft: 20}}>
              <View style={{width: 200, height: 20, borderRadius: 4}} />
              <View
                style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
              />
            </View>
          </View>
          <View
            style={{width: windowWidth - 64, height: 350, borderRadius: 10}}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: 60, height: 20}} />
            <View style={{width: 60, height: 20}} />
            <View style={{width: 60, height: 20}} />
          </View>
        </View>
        {/* Card Item */}
      </View>
    </SkeletonPlaceholder>
  );
}
