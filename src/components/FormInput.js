import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GlobalStyle} from '../config/globalStyle';

const FormInput = ({
  labelValue,
  placeholderText,
  iconType,
  containerStyle,
  isEmailInput = false,
  ...rest
}) => {
  const [isShowPwd, setIsShowPwd] = useState(true);
  return (
    <View style={[styles.inputContainer, {borderRadius: 10}, containerStyle]}>
      <View style={styles.iconStyle}>
        <AntDesign name={iconType} size={25} color="#666" />
      </View>
      <TextInput
        value={labelValue}
        style={styles.input}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="#666"
        secureTextEntry={isShowPwd ? true : false}
        {...rest}
      />
      {!isEmailInput && (
        <TouchableOpacity
          onPress={() => {
            setIsShowPwd(!isShowPwd);
          }}
          style={{marginRight: 10, padding: 6}}>
          <FontAwesome5
            name={!isShowPwd ? 'eye-slash' : 'eye'}
            size={20}
            color={GlobalStyle.colors.COLOR_GRAY}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 10,
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});
