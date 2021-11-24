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

const windowWidth = Dimensions.get('window').width;

export default function MenuScreen() {
  const [covidCases, setCovidCases] = useState([]);
  useEffect(async () => {
    await callApi(`dayone/country/vietnam`, 'GET').then(res => {
      setCovidCases(res.data);
    });
  }, []);

  const lastItem = covidCases.pop();

  //   console.log('======cases', lastItem);

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
      data: lastItem?.Confirmed,
    },
    {
      title: 'Total Recovered',
      data: lastItem?.Recovered,
    },
    {
      title: 'Total Deaths',
      data: lastItem?.Deaths,
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

  const CovidItem = ({title, data}) => {
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.box}>
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
          width: windowWidth - 32,
        }}>
        {covidData.map((el, i) => {
          return <CovidItem title={el.title} data={el.data} />;
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
