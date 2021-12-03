import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import callApi from '../services/apiCaller';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {AuthContext} from '../navigation/AuthProvider';
import provinces from '../data/provinces.json';
import {Picker} from '@react-native-picker/picker';

const windowWidth = Dimensions.get('window').width;

export default function MenuScreen() {
  const {user, logout} = useContext(AuthContext);
  const {vnCases, worldCases} = useSelector(state => state.covidCases);
  const {useDetails} = useSelector(state => state.user);
  const vnNumber = vnCases.pop();
  const [covidCases, setCovidCases] = useState(vnNumber);
  const [isTotalWorld, setIsTotalWorld] = useState(false);

  const [provinceData, setProvinceData] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('01');
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);

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
      const province = provinces.find(el => el.Id === selectedProvince);
      await setDistrictList(province.Districts);
      console.log('++++++districtList[0]:', districtList[0].Wards);
      const district = districtList[0].Wards;
      setWardList(district);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (districtList.length > 0) {
      const district = districtList.find(el => el.Id === selectedDistrict);
      setWardList(district.Wards);
    }
  }, [selectedDistrict]);

  const renderData = [
    {
      title: 'Chế độ ăn uống',
      action: () => {
        alert('Diet Clicked !');
      },
    },
    {
      title: 'SOS',
      action: () => {
        alert('SOS Clicked !');
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

  const covidData = [
    {
      title: 'Total Confirmed',
      data: isTotalWorld ? covidCases.TotalConfirmed : covidCases.Confirmed,
    },
    {
      title: 'Total Recovered',
      data: isTotalWorld ? covidCases.TotalRecovered : covidCases.Recovered,
    },
    {
      title: 'Total Deaths',
      data: isTotalWorld ? covidCases.TotalDeaths : covidCases.Deaths,
    },
  ];

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

  const ProvinceItem = (label, value) => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text>{label}</Text>
        <Text>{value}</Text>
      </View>
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
            const data = vnCases.pop();
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

      {/* <View style={{marginTop: 16}}>
        <View style={{borderWidth: 2, borderColor: '#ccc', borderRadius: 10}}>
          <Picker
            selectedValue={selectedProvince}
            style={{height: 50}}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedProvince(itemValue)
            }>
            {provinces.map((el, i) => (
              <ProvinceItem key={i} label={el.Name} value={el.Id} />
            ))}
          </Picker>
        </View>
        <View
          style={{
            borderWidth: 2,
            borderColor: '#ccc',
            borderRadius: 10,
            marginTop: 10,
          }}>
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
        <View
          style={{
            borderWidth: 2,
            borderColor: '#ccc',
            borderRadius: 10,
            marginTop: 10,
          }}>
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
      </View> */}
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
