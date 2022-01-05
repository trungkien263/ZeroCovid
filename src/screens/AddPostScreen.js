import React, {useContext, useEffect, useState} from 'react';
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
  const item = route?.params?.item;
  const [image, setImage] = useState(item ? item?.postImg : null);
  //   const reference = storage().ref('black-t-shirt-sm.png');
  const [isUploading, setIsUploading] = useState(false);
  const [tranferred, setTranferred] = useState(0);
  const [post, setPost] = useState(item ? item?.post : '');
  const [isRefresh, setIsRefresh] = useState(false);
  const [isEmptyPost, setIsEmptyPost] = useState(false);
  const [isUpdateYet, setIsUpdateYet] = useState(false);

  useEffect(() => {
    if (item) {
      if (item?.post === post && item?.postImg === image) {
        setIsUpdateYet(false);
      } else {
        setIsUpdateYet(true);
      }
    }
  }, [post, image]);

  useEffect(() => {
    if (post !== '') {
      setIsEmptyPost(false);
    }
  }, [post]);

  const choosePhoto = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 400,
      cropping: true,
      freeStyleCropEnabled: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log(image);
        const imageUrl = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUrl);
      })
      .catch(error => {
        console.log('Err while choose Photo', error);
      });
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 720,
      height: 1280,
      cropping: true,
      freeStyleCropEnabled: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log(image);
        const imageUrl = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUrl);
      })
      .catch(error => {
        console.log('Err while take Photo', error);
      });
  };

  const addPost = imageUrl => {
    firestore()
      .collection('posts')
      .add({
        userId: user.uid,
        post: post,
        postImg: imageUrl,
        deleteFlag: false,
        createdAt: firestore.Timestamp.fromDate(new Date()),
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        console.log('Post added!');
        Alert.alert(
          'Đã thêm bài viết!',
          'Bài viết của bạn đã được thêm thành công!',
        );
        setPost(null);
        setIsRefresh(!isRefresh);
        navigation.navigate('HomeScreen');
      })
      .catch(err => {
        console.log('Something went wrong!', err);
      });
  };

  const updatePost = imageUrl => {
    firestore()
      .collection('posts')
      .doc(item?.postId)
      .update({
        userId: user.uid,
        post: post,
        postImg: imageUrl,
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        console.log('Post updated!');
        Alert.alert(
          'Cập nhật thành công!',
          'Bài viết của bạn đã được cập nhật!',
        );
        setPost(null);
        setIsRefresh(!isRefresh);
        navigation.navigate('HomeScreen');
      })
      .catch(err => {
        console.log('Something went wrong!', err);
      });
  };

  const submitPost = async () => {
    if (post === '') {
      setIsEmptyPost(true);
    } else {
      const imageUrl = await uploadImage();
      console.log('-------------------image url', imageUrl);

      item ? updatePost(imageUrl) : addPost(imageUrl);
    }
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
    }
  };

  const data = [
    {
      text: 'Chụp ảnh',
      icon: <Icon name="camera" style={styles.actionButtonIcon} />,
      name: 'bt_take_photo',
      position: 2,
    },
    {
      text: 'Chọn ảnh',
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
            resizeMode="contain"
            style={{
              width: '100%',
              height: 400,
              marginBottom: 16,
              borderRadius: 16,
            }}
          />
        )}

        <TextInput
          style={[styles.textInput, {color: '#000'}]}
          placeholder="Bạn đang nghĩ gì ?"
          placeholderTextColor={GlobalStyle.colors.COLOR_GRAY}
          //   autoFocus={true}
          keyboardType="default"
          multiline={true}
          numberOfLines={4}
          value={post}
          onChangeText={text => {
            setPost(text);
          }}
        />
        {isEmptyPost && (
          <Text style={{color: 'red', marginTop: 4, fontWeight: '400'}}>
            Không được bỏ trống!
          </Text>
        )}
        {isUploading ? (
          <View>
            <Text>{tranferred} % Hoàn thành</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <TouchableOpacity disabled={isEmptyPost} onPress={submitPost}>
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
                opacity: isEmptyPost ? 0.8 : 1,
              }}>
              {item ? 'Cập nhật' : 'Đăng'}
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
    borderColor: GlobalStyle.colors.COLOR_BLUE,
    paddingLeft: 16,
    textAlign: 'left',
    maxHeight: 250,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
