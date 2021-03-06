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
import {GlobalStyle} from '../../config/globalStyle';
import Dialog from 'react-native-dialog';

const windowWidth = Dimensions.get('window').width;

export default function MenuScreen({navigation}) {
  const {user, logout} = useContext(AuthContext);
  const {vnCases, worldCases} = useSelector(state => state?.covidCases);
  const {users} = useSelector(state => state.users);
  const vnNumber = vnCases.pop();
  const [covidCases, setCovidCases] = useState(vnNumber);
  const [isTotalWorld, setIsTotalWorld] = useState(false);
  const {userDetails} = useSelector(state => state.user);
  const [selectedItem, setSelectedItem] = useState('VN');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [message, setMessage] = useState('');

  const renderData = [
    {
      title: 'Chế độ ăn',
      action: () => {
        navigation.navigate('Diet', {userDetails: userDetails});
      },
    },
    {
      title: 'SOS',
      isUser: true,
      action: () => {
        // Alert.alert(
        //   'SOS',
        //   'Trạng thái khẩn cấp (SOS) sẽ gửi thông tin chi tiết của bạn tới đội ngũ y tế. Bạn xác nhận gửi?',
        //   [
        //     {
        //       text: 'Hủy bỏ',
        //       onPress: () => console.log('canceled!'),
        //       style: 'cancel',
        //     },
        //     {
        //       text: 'OK',
        //       onPress: () => handleSendSOS(),
        //     },
        //   ],
        // );
        setIsDialogVisible(true);
      },
    },
    {
      title: 'Quản lý SOS',
      isDisplay: true,
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
        Alert.alert('Đăng xuất!', 'Bạn có chắc chắn muốn đăng xuất?', [
          {
            text: 'Hủy bỏ',
            onPress: () => console.log('canceled!'),
            style: 'cancel',
          },
          {
            text: 'Đăng xuất',
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
    if (message === '') {
      Alert.alert('Cảnh báo!', 'Không được bỏ trống tình trạng bệnh.');
    } else {
      await firestore()
        .collection('sos')
        .add({
          creator: userDetails.uid,
          status: 'PENDING',
          message: message,
          createdAt: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          console.log('SOS sent!');
          setIsDialogVisible(false);
          setMessage('');
          Alert.alert(
            'Đã gửi trạng thái khẩn cấp!',
            'Hãy đợi trong giây lát, chúng tôi sẽ liên hệ với bạn!',
          );
        })
        .catch(err => {
          console.log('Something went wrong!', err);
        });
    }
  };

  const MenuItem = ({title, action}) => {
    return (
      <TouchableOpacity onPress={action} style={{marginTop: 16}}>
        <View
          style={{
            height: 60,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: GlobalStyle.colors.COLOR_BLUE,
          }}
          //   colors={['#4c669f', '#3b5998', '#192f6a']}
        >
          <Text style={[styles.title, {fontWeight: '600'}]}>{title}</Text>
        </View>
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
      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>{'SOS'}</Dialog.Title>
        {/* <Dialog.Description>
          {
            'Trạng thái khẩn cấp (SOS) sẽ gửi thông tin chi tiết của bạn tới đội ngũ y tế. Bạn xác nhận gửi?'
          }
        </Dialog.Description> */}
        <Dialog.Input
          label="Tình trạng của bạn thế nào?"
          onChangeText={txt => setMessage(txt)}
          multiline={true}
          numberOfLines={2}
        />
        <Dialog.Button
          label="Hủy bỏ"
          onPress={() => {
            setIsDialogVisible(false);
            setMessage('');
          }}
        />
        <Dialog.Button label="Gửi" onPress={() => handleSendSOS()} />
      </Dialog.Container>
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
            setSelectedItem('VN');
          }}
          style={{
            backgroundColor:
              selectedItem === 'VN'
                ? GlobalStyle.colors.COLOR_BLUE
                : GlobalStyle.colors.COLOR_SILVER,
            alignItems: 'center',
            paddingVertical: 4,
            borderRadius: 8,
            width: (windowWidth - 64) / 2,
          }}>
          <Text
            style={{
              color: selectedItem === 'VN' ? '#fff' : '#000',
            }}>
            Việt Nam
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCovidCases(worldCases);
            setIsTotalWorld(true);
            setSelectedItem('W');
          }}
          style={{
            backgroundColor:
              selectedItem === 'W'
                ? GlobalStyle.colors.COLOR_BLUE
                : GlobalStyle.colors.COLOR_SILVER,
            alignItems: 'center',
            paddingVertical: 4,
            borderRadius: 8,
            width: (windowWidth - 64) / 2,
          }}>
          <Text
            style={{
              color: selectedItem === 'W' ? '#fff' : '#000',
            }}>
            Thế giới
          </Text>
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
        if (userDetails.role === 1) {
          return el.isUser ? (
            <View key={i} />
          ) : (
            <MenuItem key={i} title={el.title} action={el.action} />
          );
        } else {
          return el.isDisplay ? (
            <View key={i} />
          ) : (
            <MenuItem key={i} title={el.title} action={el.action} />
          );
        }
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
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
