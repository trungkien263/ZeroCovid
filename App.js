import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Onboarding">
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="Onboarding"
            component={OnboardingScreen}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return <LoginScreen />;
  }
}
