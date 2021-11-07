import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {GlobalStyle} from '../config/globalStyle';
import {FloatingAction} from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';

export default function AddPostScreen({navigation, route}) {
  const {user} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  //   const reference = storage().ref('black-t-shirt-sm.png');
  const [isUploading, setIsUploading] = useState(false);
  const [tranferred, setTranferred] = useState(0);
  const [post, setPost] = useState(null);
  const [isRefresh, setIsRefresh] = useState(false);

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

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('-------------------image url', imageUrl);

    firestore()
      .collection('posts')
      .add({
        userId: user.uid,
        post: post,
        postImg: imageUrl,
        createdAt: firestore.Timestamp.fromDate(new Date()),
        likes: null,
        comments: null,
      })
      .then(() => {
        console.log('Post added!');
        Alert.alert(
          'Post published!',
          'Your post has been published to the Firebase Cloud Storage Successfully!',
        );
        setPost(null);
        setIsRefresh(!isRefresh);
        navigation.navigate('Social App');
      })
      .catch(err => {
        console.log('Something went wrong!', err);
      });
  };

  const uploadImage = async () => {
    if (image === null) {
      return null;
    }
    const uploadUri = image;
    let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // add timestamp to file name
    const extension = fileName.split('.').pop();
    const name = fileName.split('.').slice(0, -1).join('.');
    fileName = name + Date.now() + '.' + extension;

    setIsUploading(true);
    setTranferred(0);

    const storageRef = storage().ref(`photos/${fileName}`);
    const task = storageRef.putFile(uploadUri);

    // set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTranferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      const response = await task;

      // get the image's url
      const url = await storageRef.getDownloadURL();

      setIsUploading(false);
      setImage(null);

      //   console.log('----------------------response', response);
      //   Alert.alert(
      //     'Image uploaded!',
      //     'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      //   );
      return url;
    } catch (error) {
      console.log('--------------------error', error);
      return null;
    }
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
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flex: 1}}>
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
          placeholder="What's on your mind ?"
          // autoFocus={true}
          keyboardType="default"
          numberOfLines={4}
          value={post}
          onChangeText={text => {
            setPost(text);
          }}
        />
        {isUploading ? (
          <View>
            <Text>{tranferred} % Completed</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <TouchableOpacity onPress={submitPost}>
            <Text
              style={{
                color: GlobalStyle.colors.COLOR_WHITE,
                fontSize: 16,
                fontWeight: '700',
                paddingVertical: 16,
                paddingHorizontal: 32,
                marginTop: 16,
                borderRadius: 10,
                backgroundColor: GlobalStyle.colors.COLOR_BLUE,
              }}>
              Post
            </Text>
          </TouchableOpacity>
        )}

        <FloatingAction
          actions={data}
          color={GlobalStyle.colors.COLOR_BLUE}
          onPressItem={name => {
            name === 'bt_take_photo' && takePhoto();
            name === 'bt_choose_photo' && choosePhoto();
          }}
        />
      </View>
    </ScrollView>
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
