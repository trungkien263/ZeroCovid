import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';

const Done = ({...props}) => (
  <TouchableOpacity
    style={{
      marginRight: 10,
    }}
    {...props}>
    <Text>Done</Text>
  </TouchableOpacity>
);

export default function OnboardingScreen({navigation}) {
  return (
    <Onboarding
      DoneButtonComponent={Done}
      onSkip={() => {
        navigation.replace('Login');
      }}
      onDone={() => {
        navigation.navigate('Login');
      }}
      pages={[
        {
          backgroundColor: '#a6e4d0',
          image: (
            <Image
              source={require('../assets/people.png')}
              style={styles.img}
            />
          ),
          title: 'Making Friends',
          subtitle: 'Let be friend',
        },
        {
          backgroundColor: '#fdeb93',
          image: (
            <Image
              source={require('../assets/connect.png')}
              style={styles.img}
            />
          ),
          title: 'Connect to the world',
          subtitle: 'Make people more closer',
        },
        {
          backgroundColor: '#e9bcbe',
          image: (
            <Image source={require('../assets/share.png')} style={styles.img} />
          ),
          title: 'Share Your Favorites',
          subtitle: 'Share Your Thoughts With Similar Kind of People',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 200,
    height: 200,
  },
});
