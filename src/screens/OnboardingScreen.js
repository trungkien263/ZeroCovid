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
              source={require('../assets/doctor.png')}
              style={styles.img}
            />
          ),
          title: 'Kết nối người bệnh',
          subtitle: 'Kết nối trực tiếp đến đội ngũ y tế',
        },
        {
          backgroundColor: '#fdeb93',
          image: (
            <Image source={require('../assets/sos.png')} style={styles.img} />
          ),
          title: 'Tình trạng khẩn cấp?',
          subtitle: 'Thông báo ngay tới đội ngũ y tế',
        },
        {
          backgroundColor: '#e9bcbe',
          image: (
            <Image source={require('../assets/news.png')} style={styles.img} />
          ),
          title: 'Cập nhật tin tức',
          subtitle: 'Cập nhật tin tức mới nhất về Covid',
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
