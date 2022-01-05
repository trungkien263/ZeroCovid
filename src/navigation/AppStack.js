import React from 'react';
import {Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NavigationContainer} from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddPostScreen from '../screens/AddPostScreen';
import MessagesScreen from '../screens/MessagesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MenuScreen from '../screens/Menu/MenuScreen';
import ChangePwd from '../screens/Menu/ChangePwd';
import AddFood from '../screens/Menu/Diet/AddFood';
import Diet from '../screens/Menu/Diet';
import CommentScreen from '../screens/CommentScreen';
import SosManagement from '../screens/SosManagement';
import SosDetail from '../screens/SosManagement/SosDetail';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FeedStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        headerTitleAlign: 'center',
        headerTitle: 'Trang chủ',
        headerTitleStyle: {
          color: '#000',
          fontFamily: 'Kufam-SemiBoldItalic',
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
        headerRight: () => (
          <View style={{marginRight: 10}}>
            <FontAwesome5.Button
              name="plus"
              size={22}
              backgroundColor="#fff"
              color="#2e64e5"
              onPress={() => navigation.navigate('AddPost')}
            />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#2e64e515',
          shadowColor: '#2e64e515',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="HomeProfile"
      component={ProfileScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="CommentScreen"
      component={CommentScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const MessageStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Messages"
      options={() => ({
        title: 'Tin nhắn',
        headerTitleAlign: 'center',
      })}
      component={MessagesScreen}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({route}) => ({
        headerShown: false,
        headerBackTitleVisible: false,
        headerLeft: () => (
          <View style={{marginLeft: 10}}>
            <Ionicons.Button
              name="arrow-back"
              size={25}
              backgroundColor="#f9fafd"
              color="#2e64e5"
              onPress={() => navigation.goBack()}
            />
          </View>
        ),
      })}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerTitle: 'Chỉnh sửa trang cá nhân',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const MenuStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Menu"
      component={MenuScreen}
      options={({route}) => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="SosManagement"
      component={SosManagement}
      options={({route}) => ({
        headerShown: true,
        title: 'Quản lý SOS',
        headerTitleAlign: 'center',
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      })}
    />
    <Stack.Screen
      name="SosDetail"
      component={SosDetail}
      options={({route}) => ({
        headerShown: true,
        title: 'Chi tiết SOS',
        headerTitleAlign: 'center',
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      })}
    />
    <Stack.Screen
      name="ChangePwd"
      component={ChangePwd}
      options={({route}) => ({
        headerShown: true,
        title: 'Đổi mật khẩu',
        headerTitleAlign: 'center',
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      })}
    />
    <Stack.Screen
      name="Diet"
      component={Diet}
      options={({route}) => ({
        headerShown: true,
        title: 'Gợi ý đồ ăn',
        headerTitleAlign: 'center',
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
        headerRight: () => {
          const data = route.params.userDetails;
          console.log('dataaaaaaaa', data);
          return (
            <View style={{marginRight: 10}}>
              {data.role === 1 && (
                <FontAwesome5.Button
                  name="plus"
                  size={22}
                  backgroundColor="#fff"
                  color="#2e64e5"
                  onPress={() => navigation.navigate('AddFood')}
                />
              )}
            </View>
          );
        },
      })}
    />
    <Stack.Screen
      name="AddFood"
      component={AddFood}
      options={({route}) => ({
        headerShown: true,
        title: 'Thêm đồ ăn',
        headerTitleAlign: 'center',
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      })}
    />
  </Stack.Navigator>
);

const AppStack = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: '#2e64e5',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={FeedStack}
        options={({route}) => ({
          tabBarLabel: 'Trang chủ',
          // tabBarVisible: route.state && route.state.index === 0,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={({route}) => ({
          tabBarLabel: 'Tin nhắn',
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              color={color}
              size={size}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={({route}) => ({
          tabBarLabel: 'Trang cá nhân',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        })}
      />
      <Tab.Screen
        name="Menu"
        component={MenuStack}
        options={({route}) => ({
          tabBarLabel: 'Khác',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="menu" color={color} size={size} />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
