import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';

export default function ProfileScreen() {
  const {user, logout} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Welcome {user.uid}</Text>
      <FormButton
        buttonTitle="Logout"
        onPress={() => {
          logout();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
