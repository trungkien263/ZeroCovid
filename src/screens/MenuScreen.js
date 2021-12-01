import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import callApi from '../services/apiCaller';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';

const windowWidth = Dimensions.get('window').width;

export default function MenuScreen() {
  const {vnCases, worldCases} = useSelector(state => state.covidCases);
  const {useDetails} = useSelector(state => state.user);
  const vnNumber = vnCases.pop();
  const [covidCases, setCovidCases] = useState(vnNumber);
  const [isTotalWorld, setIsTotalWorld] = useState(false);

  console.log('----------useDetails', useDetails);

  //   const lastItem = vnCases.pop();

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
      title: 'Chế độ ăn uống',
      action: () => {
        alert('Clicked !');
      },
    },
    {
      title: 'Chế độ ăn uống',
      action: () => {
        alert('Clicked !');
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

  return (
    <View style={styles.container}>
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
    </View>
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
