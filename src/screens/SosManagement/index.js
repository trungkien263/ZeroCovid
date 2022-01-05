import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {GlobalStyle} from '../../config/globalStyle';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import moment from 'moment';

export default function SosManageMent({navigation}) {
  const {userDetails} = useSelector(state => state.user);
  const [sosList, setSosList] = useState([]);
  const allUsers = useSelector(state => state.users.allUsers);

  useEffect(() => {
    fetchSos();
  }, []);

  const fetchSos = async () => {
    try {
      firestore()
        .collection('sos')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const sosData = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            const sosOwner = allUsers.find(el => el.uid === data?.creator);
            return {id, ...data, userInfo: sosOwner};
          });
          console.log(sosData);
          setSosList(sosData);
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  const displayStatus = status => {
    if (status === 'PENDING') {
      return 'Đang chờ xử lý';
    } else if (status === 'PROCESSING') {
      return 'Đang xử lý';
    } else if (status === 'DONE') {
      return 'Đã xử lý';
    }
  };

  const SosItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SosDetail', {item: item});
        }}
        style={{
          backgroundColor: GlobalStyle.colors.COLOR_SILVER,
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>{item.userInfo.name}</Text>
          <Text>{moment(item?.createdAt.toDate()).fromNow()}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text>{displayStatus(item.status)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {sosList.map((el, i) => {
        return <SosItem item={el} index={i} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
  },
});
