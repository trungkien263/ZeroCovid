import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';

export default function AddPostScreen() {
  return (
    <View style={styles.container}>
      <Text>AddPostScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
    padding: 16,
  },
});
