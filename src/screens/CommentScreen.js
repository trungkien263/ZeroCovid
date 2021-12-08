import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';

export default function CommentScreen() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text>CMT</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
  },
});
