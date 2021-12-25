import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Types from '../constants/ActionTypes';
import FastImage from 'react-native-fast-image';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import Animated from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import FormButton from '../components/FormButton';
import {GlobalStyle} from '../config/globalStyle';
import {AuthContext} from '../navigation/AuthProvider';
import provinces from '../data/provinces.json';
import {Picker} from '@react-native-picker/picker';

const {width, height} = Dimensions.get('window');

export default function EditProfile() {
  const {user, logout} = useContext(AuthContext);
  const {useDetails} = useSelector(state => state.user);

  //   const [imageSource, setImageSource] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tranferred, setTranferred] = useState(0);

  const [provinceData, setProvinceData] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('01');
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);

  useEffect(() => {
    setUserData(useDetails);
  }, []);

  console.log('user data--------------', userData);

  useEffect(() => {
    const arr = [];
    provinces.map(el => {
      arr.push({
        id: el.Id,
        name: el.Name,
        district: el.Districts,
      });
    });
    setProvinceData(arr);
  }, []);

  useEffect(async () => {
    if (selectedProvince.length > 0) {
      try {
        const province = provinces.find(el => el.Id === selectedProvince);
        await setDistrictList(province.Districts);
        console.log('++++++districtList[0]:', districtList[0].Wards);
        const district = districtList[0].Wards;
        setWardList(district);
      } catch (err) {
        console.log(err);
      }
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (districtList.length > 0) {
      const district = districtList.find(el => el.Id === selectedDistrict);
      setWardList(district.Wards);
    }
  }, [selectedDistrict]);

  const ProvinceItem = (label, value) => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text>{label}</Text>
        <Text>{value}</Text>
      </View>
    );
  };

  const bs = React.createRef();
  const fall = new Animated.Value(1);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      freeStyleCropEnabled: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log('------------------image taken', image);
        setImage(image.path);
        bs.current.snapTo(1);
      })
      .catch(err => console.log('open camera catch: ', err));
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      compressImageMaxHeight: 300,
      compressImageMaxWidth: 300,
      cropping: true,
      freeStyleCropEnabled: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log('------------------image taken', image);
        setImage(image.path);
        bs.current.snapTo(1);
      })
      .catch(err => console.log('open camera catch: ', err));
  };

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const handleUpdate = async () => {
    let imgUrl = await uploadImage();

    if (imgUrl === null && userData.userImg) {
      imgUrl = userData.userImg;
    }

    const data = {
      fname: userData.fname,
      lname: userData.lname,
      phone: userData.phone,
      address: userData.address,
      userImg: imgUrl,
    };

    await firestore()
      .collection('users')
      .doc(user.uid)
      .update(data)
      .then(() => {
        Alert.alert(
          'Profile Updated!',
          'Your profile has been updated successfully.',
        );
      })
      .catch(err => {
        console.log('Error while updating data: ', err);
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

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <BottomSheet
          ref={bs}
          renderContent={renderInner}
          renderHeader={renderHeader}
          snapPoints={[330, -5]}
          initialSnap={1}
          callbackNode={fall}
          enableGestureInteraction={true}
          enabledContentTapInteraction={false}
        />
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
            <View
              style={{
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}>
              <FastImage
                source={{
                  uri: image
                    ? image
                    : userData?.userImg ||
                      'https://img.favpng.com/25/13/19/samsung-galaxy-a8-a8-user-login-telephone-avatar-png-favpng-dqKEPfX7hPbc6SMVUCteANKwj.jpg',
                }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 80,
                }}
                resizeMode="cover">
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="camera"
                    size={35}
                    color="#fff"
                    style={{
                      opacity: 0.7,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#fff',
                      borderRadius: 10,
                    }}
                  />
                </View>
              </FastImage>
            </View>
          </TouchableOpacity>

          <Text
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {userData?.fname + ' ' + userData?.lname}
          </Text>
        </View>

        <View style={styles.action}>
          <FontAwesome
            name="user-o"
            color={GlobalStyle.colors.COLOR_GRAY}
            style={{marginTop: 3}}
            size={20}
          />
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#666"
            value={userData ? userData.fname : ''}
            style={[styles.textInput]}
            onChangeText={txt => setUserData({...userData, fname: txt})}
            autoCorrect={false}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome
            name="user-o"
            color={GlobalStyle.colors.COLOR_GRAY}
            style={{marginTop: 3}}
            size={20}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#666"
            value={userData ? userData.lname : ''}
            style={[styles.textInput]}
            onChangeText={txt => setUserData({...userData, lname: txt})}
            autoCorrect={false}
          />
        </View>
        <View style={styles.action}>
          <Feather
            name="phone"
            color={GlobalStyle.colors.COLOR_GRAY}
            style={{marginTop: 3}}
            size={20}
          />
          <TextInput
            placeholder="Phone"
            keyboardType="number-pad"
            placeholderTextColor="#666"
            style={[styles.textInput]}
            value={userData ? userData.phone : ''}
            onChangeText={txt => setUserData({...userData, phone: txt})}
            autoCorrect={false}
          />
        </View>

        <View
          style={{
            // marginTop: 10,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <View style={styles.locationItem}>
            <Picker
              selectedValue={selectedProvince}
              style={{height: 50, justifyContent: 'center'}}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedProvince(itemValue)
              }>
              {provinces.map((el, i) => (
                <ProvinceItem key={i} label={el.Name} value={el.Id} />
              ))}
            </Picker>
          </View>
          <View style={styles.locationItem}>
            <Picker
              selectedValue={selectedDistrict}
              style={{height: 50}}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedDistrict(itemValue)
              }>
              {districtList.map((el, i) => (
                <ProvinceItem key={i} label={el.Name} value={el.Id} />
              ))}
            </Picker>
          </View>
          <View style={styles.locationItem}>
            <Picker
              selectedValue={selectedWard}
              style={{height: 50}}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedWard(itemValue)
              }>
              {wardList.map((el, i) => (
                <ProvinceItem key={i} label={el.Name} value={el.Id} />
              ))}
            </Picker>
          </View>
          <View style={{marginTop: 10}}>
            <Text>
              {selectedProvince + ' ' + selectedDistrict + ' ' + selectedWard}
            </Text>
          </View>
        </View>

        <View style={styles.action}>
          <FontAwesome
            name="map-marker"
            color={GlobalStyle.colors.COLOR_GRAY}
            style={{marginTop: 3, marginLeft: 4}}
            size={20}
          />
          <TextInput
            placeholder="Address"
            keyboardType="default"
            placeholderTextColor="#666"
            style={[styles.textInput]}
            value={userData ? userData.address : ''}
            onChangeText={txt => setUserData({...userData, address: txt})}
            autoCorrect={false}
            multiline={true}
            // minHeight={80}
          />
        </View>
      </ScrollView>
      <View>
        <FormButton buttonTitle="Submit" onPress={handleUpdate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: GlobalStyle.colors.COLOR_GRAY,
    paddingTop: 10,
  },
  // header
  header: {
    borderTopWidth: 3,
    borderTopColor: '#ddd',

    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },

  panelTitle: {
    fontSize: 24,
    height: 35,
    fontWeight: '700',
  },
  panelSubtitle: {
    fontSize: 14,
    // color: 'gray',
    height: 30,
    marginBottom: 10,
    fontWeight: '500',
  },
  panelButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: GlobalStyle.colors.COLOR_SILVER,
    borderRadius: 8,
    paddingLeft: 16,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#05375a',
  },
  locationItem: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 10,
    maxHeight: 50,
    justifyContent: 'center',
  },
});
