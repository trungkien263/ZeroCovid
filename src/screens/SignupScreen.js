import React, {useContext, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';

export default function SignupScreen({navigation}) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const {register} = useContext(AuthContext);

  const validateMail = mail => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(mail) === true) {
      return true;
    } else {
      return false;
    }
  };

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      alert('Email và mật khẩu không được trống!');
    } else if (!validateMail(email)) {
      alert('Email không hợp lệ');
    } else if (password !== confirmPassword) {
      alert('Mật khẩu không trùng khớp');
    } else {
      register(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={require('../assets/register.png')}
          style={{width: 240, height: 240, alignSelf: 'center'}}
        />

        <Text style={styles.text}>Tạo tài khoản</Text>

        <FormInput
          labelValue={email}
          onChangeText={userEmail => setEmail(userEmail)}
          placeholderText="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          isEmailInput={true}
        />

        <FormInput
          labelValue={password}
          onChangeText={userPassword => setPassword(userPassword)}
          placeholderText="Mật khẩu"
          iconType="lock"
        />

        <FormInput
          labelValue={confirmPassword}
          onChangeText={userConfirmPassword =>
            setConfirmPassword(userConfirmPassword)
          }
          placeholderText="Xác nhận mật khẩu"
          iconType="lock"
        />

        <FormButton buttonTitle="Đăng ký" onPress={handleSignUp} />

        <View style={styles.textPrivate}>
          <Text style={styles.color_textPrivate}>
            Bằng cách bấm vào nút đăng ký, bạn đã đồng ý với
          </Text>
          <TouchableOpacity
          // onPress={() => {
          //   alert('Terms Clicked!');
          // }}
          >
            <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
              Điều khoản
            </Text>
          </TouchableOpacity>
          <Text style={styles.color_textPrivate}> và </Text>
          <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
            Chính sách bảo mật
          </Text>
        </View>

        {/* <SocialButton
          buttonTitle="Sign Up with Facebook"
          btnType="facebook"
          color="#4867aa"
          backgroundColor="#e6eaf4"
          onPress={() => {}}
        /> */}

        {/* <SocialButton
          buttonTitle="Sign Up with Google"
          btnType="google"
          color="#de4d41"
          backgroundColor="#f5e7ea"
          containerStyle={{
            borderWidth: 1,
            borderColor: '#de4d41',
          }}
          onPress={() => {}}
        /> */}

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={styles.navButtonText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
    textAlign: 'center',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 20,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
});
