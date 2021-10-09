import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Platform, Image} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import {FloatingAction} from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

export default function AddPostScreen() {
  const [image, setImage] = useState(null);

  const choosePhoto = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUrl = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUrl);
    });
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUrl = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUrl);
    });
  };

  const data = [
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
      {image && (
        <Image
          source={{uri: image}}
          style={{
            width: '100%',
            height: 250,
            marginBottom: 16,
            borderRadius: 16,
          }}
        />
      )}

      <TextInput
        style={styles.textInput}
        placeholder="What is on your mind ?"
        // autoFocus={true}
        keyboardType="default"
      />

      <FloatingAction
        actions={data}
        color={GlobalStyle.colors.COLOR_BLUE}
        onPressItem={name => {
          name === 'bt_take_photo' && takePhoto();
          name === 'bt_choose_photo' && choosePhoto();
        }}
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
