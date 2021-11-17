import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const windowWidth = Dimensions.get('window').width;

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Text>KKK</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
});
