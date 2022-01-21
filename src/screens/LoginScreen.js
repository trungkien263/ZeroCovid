import React, {useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const {googleLogin} = useContext(AuthContext);

  const validateMail = mail => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(mail) === true) {
      return true;
    } else {
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      const errorCode = error?.code;
      const errorMessage = error?.message;
      console.log(errorCode);
      if (errorCode === 'auth/user-not-found') {
        Alert.alert('Lỗi', 'Người dùng không tồn tại.');
      } else if (errorCode === 'auth/wrong-password') {
        Alert.alert('Lỗi', 'Mật khẩu không đúng.');
      } else {
        Alert.alert('Unknow Error', errorMessage);
      }
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Email và mật khẩu không được bỏ trống!');
    } else if (!validateMail(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
    } else {
      login(email, password);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.text}>Zero Covid</Text>
        <FormInput
          labelValue={email}
          onChangeText={userEmail => setEmail(userEmail.trim())}
          placeholderText="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          isEmailInput={true}
        />

        <FormInput
          labelValue={password}
          onChangeText={userPassword => setPassword(userPassword.trim())}
          placeholderText="Mật khẩu"
          iconType="lock"
        />

        <FormButton
          containerStyle={{marginTop: 10}}
          buttonTitle="Đăng nhập"
          onPress={handleLogin}
        />

        {/* <SocialButton
          buttonTitle="Sign In with Facebook"
          btnType="facebook"
          color="#4867aa"
          backgroundColor="#e6eaf4"
          onPress={() => {}}
        /> */}

        {/* <SocialButton
          buttonTitle="Đăng nhập với Google"
          btnType="google"
          color="#de4d41"
          backgroundColor="#f5e7ea"
          containerStyle={{
            borderWidth: 1,
            borderColor: '#de4d41',
          }}
          onPress={() => googleLogin()}
        /> */}

        <View style={{marginTop: 30, alignItems: 'center'}}>
          <TouchableOpacity
            style={{marginBottom: 10}}
            onPress={() =>
              navigation.navigate('ForgotPassword', {mailParams: email})
            }>
            <Text style={styles.navButtonText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            <Text style={styles.navButtonText}>
              Chưa có tài khoản? Tạo ngay!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 220,
    width: 220,
    resizeMode: 'cover',
    borderRadius: 200,
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
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
});
