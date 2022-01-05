import {firebase} from '@react-native-firebase/auth';
import React from 'react';
import {Alert, Image, ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import {GlobalStyle} from '../../config/globalStyle';

export default function ChangePwd({navigation}) {
  const {userDetails} = useSelector(state => state.user);

  const forgotPassword = Email => {
    firebase
      .auth()
      .sendPasswordResetEmail(userDetails.email)
      .then(() => {
        Alert.alert(
          'Thông báo',
          'Hãy mở Email của bạn và làm theo hướng dẫn để đặt lại mật khẩu!',
        );
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{marginTop: 30}}>
          <Image
            source={require('../../assets/forgotPwd.png')}
            style={{
              width: 200,
              height: 200,
              alignSelf: 'center',
            }}
          />
        </View>

        <FormInput
          labelValue={userDetails.email}
          placeholderText="Nhập email..."
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          isEmailInput={true}
          editable={false}
          containerStyle={{
            marginTop: 82,
          }}
        />

        <FormButton
          buttonTitle="Đổi mật khẩu"
          onPress={() => forgotPassword()}
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
