import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {createContext, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (error) {
            const errorCode = error?.code;
            const errorMessage = error?.message;
            console.log('error type', typeof error);
            // if (
            //   errorMessage ==
            //   '[Error: [auth/user-not-found] There is no user record corresponding to this identifier. The user may have been deleted.]'
            // ) {
            //   alert('User không tồn tại!');
            // }
            // console.log('errorCode', error.code);
            // console.log('errorMessage', error.message);
          }
        },
        googleLogin: async () => {
          try {
            // Get the users ID token
            const {idToken} = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            await auth().signInWithCredential(googleCredential);
          } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert('Error', errorMessage);
            console.log('error', error);
          }
        },
        register: async (email, password, name = 'User') => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                // once the user creation has happened successfully, we can add with th
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    email: email,
                    name: name,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                    uid: auth().currentUser.uid,
                    role: 0,
                  })
                  .catch(err => {
                    console.log('error when sign up: ', err);
                  });
              });
          } catch (e) {
            const errorCode = e.code;
            const errorMessage = e.message;
            if (errorCode === 'auth/email-already-in-use') {
              Alert.alert('Lỗi!', 'Email đã được sử dụng.');
            } else {
              Alert.alert('Unexpected Error!', errorMessage);
            }
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
