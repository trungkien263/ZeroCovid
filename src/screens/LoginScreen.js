import React, {useContext} from 'react';
import {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const {login, googleLogin} = useContext(AuthContext);

  const validateMail = mail => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(mail) === true) {
      return true;
    } else {
      return false;
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      alert('Email and password can not be empty!');
    } else if (!validateMail(email)) {
      alert('Invalid email');
    } else {
      login(email, password);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={require('../assets/login.png')} style={styles.logo} />
        <Text style={styles.text}>Social App</Text>
        <FormInput
          labelValue={email}
          onChangeText={userEmail => setEmail(userEmail.trim())}
          placeholderText="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={password}
          onChangeText={userPassword => setPassword(userPassword.trim())}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormButton buttonTitle="Sign In" onPress={handleLogin} />

        <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
          <Text style={styles.navButtonText}>Fogot Password?</Text>
        </TouchableOpacity>

        <SocialButton
          buttonTitle="Sign In with Facebook"
          btnType="facebook"
          color="#4867aa"
          backgroundColor="#e6eaf4"
          onPress={() => {}}
        />

        <SocialButton
          buttonTitle="Sign In with Google"
          btnType="google"
          color="#de4d41"
          backgroundColor="#f5e7ea"
          onPress={() => googleLogin()}
        />

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => {
            navigation.navigate('Signup');
          }}>
          <Text style={styles.navButtonText}>
            Dont have an account? Create here!
          </Text>
        </TouchableOpacity>
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
    height: 150,
    width: 150,
    resizeMode: 'cover',
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
  forgotButton: {
    marginVertical: 20,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
});
