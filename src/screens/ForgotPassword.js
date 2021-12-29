import {firebase} from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import {GlobalStyle} from '../config/globalStyle';

export default function ForgotPassword({route, navigation}) {
  const {mailParams} = route.params;
  const [email, setEmail] = useState(mailParams ? mailParams : '');
  const [error, setError] = useState('');

  const validateMail = mail => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(mail) === true) {
      return true;
    } else {
      return false;
    }
  };

  const forgotPassword = Email => {
    firebase
      .auth()
      .sendPasswordResetEmail(Email)
      .then(() => {
        alert(
          'Hãy mở Email của bạn và làm theo hướng dẫn để đặt lại mật khẩu!',
        );
      })
      .catch(function (e) {
        console.log(e);
        setError('Email chưa được đăng ký!');
      });
  };

  const handleRequestOTP = () => {
    if (email === '') {
      setError('Email không được bỏ trống!');
    } else if (!validateMail(email)) {
      setError('Email không hợp lệ');
    } else {
      forgotPassword(email);
    }
  };

  const handleValidate = txt => {
    if (txt !== '') {
      setError('');
      setEmail(txt);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{marginTop: 30}}>
          <Image
            source={require('../assets/forgotPwd.png')}
            style={{
              width: 200,
              height: 200,
              alignSelf: 'center',
            }}
          />
        </View>

        <Text style={[styles.title, {marginTop: 50}]}>Nhập email của bạn</Text>

        <FormInput
          labelValue={email}
          onChangeText={txt => handleValidate(txt)}
          placeholderText="Nhập email..."
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          isEmailInput={true}
          containerStyle={{
            marginTop: 16,
          }}
        />
        {error !== '' && (
          <Text style={{marginTop: -6, fontSize: 12, color: 'red'}}>
            {error}
          </Text>
        )}

        <FormButton
          buttonTitle="Đặt lại mật khẩu"
          onPress={() => handleRequestOTP()}
        />

        <FormButton
          buttonTitle="Quay lại"
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
            borderWidth: 2,
            borderColor: GlobalStyle.colors.COLOR_BLUE,
          }}
          titleStyle={{
            color: GlobalStyle.colors.COLOR_BLUE,
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyle.colors.COLOR_BACKGROUND,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
});
