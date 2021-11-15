import React from 'react';
import {Dimensions, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const windowWidth = Dimensions.get('window').width;

export default function ProfileSkeleton() {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          flexDirection: 'column',
          padding: 16,
        }}>
        {/* Card Item */}
        <View style={{alignItems: 'center'}}>
          <View style={{width: 150, height: 150, borderRadius: 100}} />
          <View style={{marginTop: 16, alignItems: 'center'}}>
            <View style={{width: 160, height: 20, borderRadius: 4}} />
            <View
              style={{marginTop: 6, width: 180, height: 20, borderRadius: 4}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              width: windowWidth - 64,
            }}>
            <View
              style={{
                width: (windowWidth - 84) / 2,
                height: 40,
                borderRadius: 4,
              }}
            />
            <View
              style={{
                width: (windowWidth - 84) / 2,
                height: 40,
                borderRadius: 4,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: windowWidth - 64,
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View
              style={{
                height: 60,
                width: (windowWidth - 94) / 3,
                borderRadius: 4,
              }}
            />
            <View
              style={{
                height: 60,
                width: (windowWidth - 94) / 3,
                borderRadius: 4,
              }}
            />
            <View
              style={{
                height: 60,
                width: (windowWidth - 94) / 3,
                borderRadius: 4,
              }}
            />
          </View>
        </View>
        {/* Card Item */}
        <View style={{paddingHorizontal: 16, marginTop: 16}}>
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
            style={{width: windowWidth - 64, height: 200, borderRadius: 10}}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View
              style={{
                width: (windowWidth - 94) / 3,
                height: 30,
                borderRadius: 10,
              }}
            />
            <View
              style={{
                width: (windowWidth - 94) / 3,
                height: 30,
                borderRadius: 10,
              }}
            />
            <View
              style={{
                width: (windowWidth - 94) / 3,
                height: 30,
                borderRadius: 10,
              }}
            />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
}
