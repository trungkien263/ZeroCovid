import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import {FloatingAction} from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AddPostScreen() {
  const actions = [
    {
      text: 'Take Photo',
      icon: <Icon name="camera" style={styles.actionButtonIcon} />,
      name: 'bt_take_photo',
      position: 2,
    },
    {
      text: 'Choose Photo',
      icon: <Icon name="folder-open" style={styles.actionButtonIcon} />,
      name: 'bt_choose_photo',
      position: 1,
      color: 'purple',
    },
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="What is on your mind ?"
        // autoFocus={true}
        keyboardType="default"
      />

      <FloatingAction
        actions={actions}
        color={GlobalStyle.colors.COLOR_RED}
        onPressItem={() => alert('kikiki')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    width: '90%',
    borderRadius: 10,
    borderColor: GlobalStyle.colors.COLOR_GRAY,
    paddingLeft: 16,
    textAlign: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
