import {Picker} from '@react-native-picker/picker';
import moment from 'moment';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FormButton from '../../components/FormButton';
import {GlobalStyle} from '../../config/globalStyle';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');

export default function SosDetail({route, navigation}) {
  const {item} = route.params;
  const [selectedValue, setSelectedValue] = useState(item?.status);

  const data = [
    {
      label: 'Đang chờ xử lý',
      value: 'PENDING',
    },
    {
      label: 'Đang xử lý',
      value: 'PROCESSING',
    },
    {
      label: 'Đã xử lý',
      value: 'DONE',
    },
  ];

  const handleUpdateStatsus = () => {
    firestore()
      .collection('sos')
      .doc(item?.id)
      .update({
        status: selectedValue,
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        console.log('SOS sent!');
        Alert.alert(
          'Đã thay đổi trạng thái!',
          'Trạng thái SOS đã được thay đổi.',
        );
        navigation.goBack();
      })
      .catch(err => {
        console.log('Something went wrong!', err);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{alignSelf: 'center', marginBottom: 30}}>
          <Image
            style={{width: 150, height: 150, borderRadius: 200}}
            source={{
              uri: item?.userInfo?.userImg
                ? item?.userInfo?.userImg
                : 'https://img.favpng.com/25/13/19/samsung-galaxy-a8-a8-user-login-telephone-avatar-png-favpng-dqKEPfX7hPbc6SMVUCteANKwj.jpg',
            }}
          />
        </View>
        <Text style={{fontSize: 22, fontWeight: '600', marginBottom: 16}}>
          Thông tin người bệnh
        </Text>
        <View style={styles.action}>
          <FontAwesome
            name="user-o"
            color={GlobalStyle.colors.COLOR_GRAY}
            style={{marginTop: 3}}
            size={20}
          />
          <Text style={{fontSize: 16, marginLeft: 10}}>
            {item?.userInfo?.name}
          </Text>
        </View>
        <View style={styles.action}>
          <FontAwesome
            name="user-o"
            color={GlobalStyle.colors.COLOR_GRAY}
            style={{marginTop: 3}}
            size={20}
          />
          <Text style={{fontSize: 16, marginLeft: 10}}>
            {item?.userInfo.age}
          </Text>
        </View>
        <View style={styles.action}>
          <Feather
            name="phone"
            color={GlobalStyle.colors.COLOR_GRAY}
            style={{marginTop: 3}}
            size={20}
          />
          <Text style={{fontSize: 16, marginLeft: 10}}>
            {item?.userInfo.phone}
          </Text>
        </View>
        <View style={styles.action}>
          <FontAwesome
            name="map-marker"
            color={GlobalStyle.colors.COLOR_GRAY}
            style={{marginTop: 3}}
            size={20}
          />
          <Text style={{fontSize: 16, marginLeft: 10}}>
            {item?.userInfo.address}
          </Text>
        </View>
        <View style={styles.action}>
          <Feather
            name="message-square"
            color={GlobalStyle.colors.COLOR_GRAY}
            style={{marginTop: 3}}
            size={16}
          />
          <Text style={{fontSize: 16, marginLeft: 10}}>{item?.message}</Text>
        </View>
        <View style={styles.action}>
          <Feather
            name="clock"
            color={GlobalStyle.colors.COLOR_GRAY}
            style={{marginTop: 3}}
            size={20}
          />
          <Text style={{fontSize: 16, marginLeft: 10}}>
            {moment(item?.createdAt.toDate()).fromNow()}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 16,
            marginBottom: 6,
            backgroundColor: GlobalStyle.colors.COLOR_BLUE,
            paddingHorizontal: 16,
            paddingVertical: 4,
            borderRadius: 10,
            color: '#fff',
            textAlign: 'center',
            width: (width - 32) / 3,
          }}>
          Trạng thái
        </Text>
        <View style={{flex: 1, borderRadius: 10, overflow: 'hidden'}}>
          <Picker
            selectedValue={selectedValue}
            style={{
              backgroundColor: GlobalStyle.colors.COLOR_SILVER,
              //   color: '#fff',
            }}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedValue(itemValue);
            }}
            mode="dropdown">
            {data.map((el, i) => (
              <Picker.Item label={el.label} value={el.value} key={i} />
            ))}
          </Picker>
        </View>
      </ScrollView>
      <FormButton
        containerStyle={{marginTop: 10}}
        buttonTitle="Lưu"
        onPress={handleUpdateStatsus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
  },
  infoBox: {
    width: width - 32,
    backgroundColor: GlobalStyle.colors.COLOR_SILVER,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GlobalStyle.colors.COLOR_SILVER,
    borderRadius: 8,
    paddingLeft: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
});
