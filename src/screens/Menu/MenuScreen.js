import React, {useContext, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {AuthContext} from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const windowWidth = Dimensions.get('window').width;

export default function MenuScreen({navigation}) {
  const {user, logout} = useContext(AuthContext);
  const {vnCases, worldCases} = useSelector(state => state?.covidCases);
  const {users} = useSelector(state => state.users);
  const vnNumber = vnCases.pop();
  const [covidCases, setCovidCases] = useState(vnNumber);
  const [isTotalWorld, setIsTotalWorld] = useState(false);
  const {userDetails} = useSelector(state => state.user);

  const renderData = [
    {
      title: 'Chế độ ăn',
      action: () => {
        navigation.navigate('Diet');
      },
    },
    {
      title: 'SOS',
      action: () => {
        handleSendSOS();
      },
    },
    {
      title: 'Quản lý SOS',
      action: () => {
        navigation.navigate('SosManagement');
      },
    },
    {
      title: 'Đổi mật khẩu',
      action: () => {
        navigation.navigate('ChangePwd');
      },
    },
    {
      title: 'Đăng xuất',
      action: () => {
        Alert.alert('Sign out!', 'Are you sure?', [
          {
            text: 'Cancel',
            onPress: () => console.log('canceled!'),
            style: 'cancel',
          },
          {
            text: 'Sign Out',
            onPress: () => logout(),
          },
        ]);
      },
    },
  ];

  const numberFormater = number => {
    const numberFormarted = parseInt(number)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    const tmp = numberFormarted.split('.');
    const outputNumber = tmp[0];
    return outputNumber;
  };

  const covidData = [
    {
      title: 'Tổng số nhiễm',
      data: isTotalWorld
        ? numberFormater(covidCases?.TotalConfirmed)
        : numberFormater(covidCases?.Confirmed),
    },
    {
      title: 'Tổng số khỏi',
      data: isTotalWorld ? covidCases?.TotalRecovered : covidCases?.Recovered,
    },
    {
      title: 'Tổng số tử vong',
      data: isTotalWorld
        ? numberFormater(covidCases?.TotalDeaths)
        : numberFormater(covidCases?.Deaths),
    },
  ];

  const fetchSos = async () => {
    try {
      firestore()
        .collection('sos')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const sosData = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return {id, ...data};
          });
          const pendingData = sosData.filter(el => el.status === 'PENDING');
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSendSOS = async () => {
    await firestore()
      .collection('sos')
      .add({
        creator: userDetails.uid,
        status: 'PENDING',
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        console.log('SOS sent!');
        Alert.alert(
          'Đã gửi trạng thái khẩn cấp!',
          'Hãy đợi trong giây lát, chúng tôi sẽ liên hệ với bạn!',
        );
      })
      .catch(err => {
        console.log('Something went wrong!', err);
      });
  };

  const MenuItem = ({title, action}) => {
    return (
      <TouchableOpacity onPress={action} style={{marginTop: 16}}>
        <LinearGradient
          style={{
            height: 100,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          colors={['#4c669f', '#3b5998', '#192f6a']}>
          <Text style={styles.title}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const linearColor = [
    ['#f46b45', '#eea849'],
    ['#00b09b', '#96c93d'],
    ['#F06173', '#D73952'],
    ['#39C6BD', '#40B6DA'],
    ['#61ABF0', '#2073C2'],
    ['#cb356b', '#bd3f32'],
  ];

  const CovidItem = ({title, data, color}) => {
    return (
      <LinearGradient colors={color} style={styles.box}>
        <Text style={[styles.title, {fontSize: 14}]}>{title}</Text>
        <Text style={[styles.title, {fontSize: 14}]}>{data}</Text>
      </LinearGradient>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            const data = vnNumber;
            setCovidCases(data);
            setIsTotalWorld(false);
          }}
          style={{
            backgroundColor: 'orange',
            alignItems: 'center',
            paddingVertical: 4,
            borderRadius: 8,
            width: (windowWidth - 64) / 2,
          }}>
          <Text>Vietnam</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCovidCases(worldCases);
            setIsTotalWorld(true);
          }}
          style={{
            backgroundColor: 'orange',
            alignItems: 'center',
            paddingVertical: 4,
            borderRadius: 8,
            width: (windowWidth - 64) / 2,
          }}>
          <Text>World</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: windowWidth - 32,
        }}>
        {covidData.map((el, i) => {
          return (
            <CovidItem
              key={i}
              title={el.title}
              data={el.data}
              color={linearColor[i]}
            />
          );
        })}
      </View>
      {renderData.map((el, i) => {
        return <MenuItem key={i} title={el.title} action={el.action} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  box: {
    backgroundColor: 'orange',
    paddingVertical: 8,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: (windowWidth - 52) / 3,
    borderRadius: 10,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
