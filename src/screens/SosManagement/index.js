import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {GlobalStyle} from '../../config/globalStyle';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import moment from 'moment';
import {TabView, SceneMap} from 'react-native-tab-view';

const {width} = Dimensions.get('window');

export default function SosManageMent({navigation}) {
  const {userDetails} = useSelector(state => state.user);
  const [sosList, setSosList] = useState([]);
  const allUsers = useSelector(state => state.users.allUsers);
  const [pendingList, setPendingList] = useState([]);
  const [processingList, setProcessingList] = useState([]);
  const [doneList, setDoneList] = useState([]);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Đang chờ'},
    {key: 'second', title: 'Đang xử lý'},
    {key: 'third', title: 'Đã xử lý'},
  ]);

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
          const pendingData = sosData.filter(el => el.status === 'PENDING');
          const processingData = sosData.filter(
            el => el.status === 'PROCESSING',
          );
          const doneData = sosData.filter(el => el.status === 'DONE');
          setPendingList(pendingData);
          setProcessingList(processingData);
          setDoneList(doneData);
          console.log('pendingData', pendingData);
          console.log('processingData', processingData);
          console.log('doneData', doneData);
          //   setSosList(sosData);
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

  const SosItem = ({item, screen}) => {
    let itemColor = '';
    let textColor = '';
    if (screen === 0) {
      itemColor = '#E8554E';
      textColor = '#fff';
    } else if (screen === 1) {
      itemColor = '#F9C449';
    } else if (screen === 2) {
      itemColor = '#2AA876';
      textColor = '#fff';
    }
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SosDetail', {item: item});
        }}
        style={{
          backgroundColor: itemColor,
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
        }}>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: textColor}}>{item.userInfo.name}</Text>
            <Text style={{color: textColor}}>
              {moment(item?.createdAt.toDate()).fromNow()}
            </Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{color: textColor}}>{displayStatus(item.status)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const FirstRoute = () => (
    <ScrollView
      style={[
        styles.container,
        // {backgroundColor: '#E8554E'}
      ]}>
      {pendingList.map((el, i) => {
        return <SosItem item={el} key={i} screen={0} />;
      })}
    </ScrollView>
  );

  const SecondRoute = () => (
    <ScrollView
      style={[
        styles.container,
        // {backgroundColor: '#F9C449'}
      ]}>
      {processingList.map((el, i) => {
        return <SosItem item={el} key={i} screen={1} />;
      })}
    </ScrollView>
  );

  const ThirdRoute = () => (
    <ScrollView
      style={[
        styles.container,
        // {backgroundColor: '#2AA876'}
      ]}>
      {doneList.map((el, i) => {
        return <SosItem item={el} key={i} screen={2} />;
      })}
    </ScrollView>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  return (
    // <View style={styles.container}>
    //   {sosList.map((el, i) => {
    //     return <SosItem item={el} key={i} />;
    //   })}
    // </View>
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: width}}
      style={{backgroundColor: GlobalStyle.colors.COLOR_BLUE}}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
  },
});
