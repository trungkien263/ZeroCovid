import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import callApi from '../services/apiCaller';

const windowWidth = Dimensions.get('window').width;

export default function MenuScreen() {
  const [covidCases, setCovidCases] = useState([]);
  useEffect(async () => {
    await callApi(`dayone/country/vietnam`, 'GET').then(res => {
      setCovidCases(res.data);
    });
  }, []);

  const lastItem = covidCases.pop();

  console.log('======cases', lastItem);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: windowWidth - 32,
        }}>
        <View style={styles.box}>
          <Text>Total Confirmed</Text>
          <Text>{lastItem.Confirmed}</Text>
        </View>
        <View style={styles.box}>
          <Text>Total Recovered</Text>
          <Text>{lastItem.Recovered}</Text>
        </View>
        <View style={styles.box}>
          <Text>Total Deaths</Text>
          <Text>{lastItem.Deaths}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'orange',
    paddingVertical: 8,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    width: (windowWidth - 52) / 3,
  },
});
