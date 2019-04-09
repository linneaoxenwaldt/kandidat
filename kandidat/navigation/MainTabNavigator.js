import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewVoteScreen from '../screens/NewVoteScreen';
import OngoingVoteScreen from '../screens/OngoingVoteScreen';
import SavedResultScreen from '../screens/SavedResultScreen';
import LogOutScreen from '../screens/LogOutScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  drawerIcon: ({ tintColor }) => (
    <Icon
  name="ios-add"
  color="#ccc"
  size={25}
/>),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'My Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const FriendsStack = createStackNavigator({
  Friends: FriendsScreen,
});

FriendsStack.navigationOptions = {
  tabBarLabel: 'My Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const NewVoteStack = createStackNavigator({
  NewVote: NewVoteScreen,
});

NewVoteStack.navigationOptions = {
  tabBarLabel: 'My Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const OngoingVoteStack = createStackNavigator({
  OngoingVote: OngoingVoteScreen,
});

OngoingVoteStack.navigationOptions = {
  tabBarLabel: 'My Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const SavedResultStack = createStackNavigator({
  SavedResult: SavedResultScreen,
});

SavedResultStack.navigationOptions = {
  tabBarLabel: 'My Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const LogOutStack = createStackNavigator({
  LogOut: LogOutScreen,
});

LogOutStack.navigationOptions = {
  tabBarLabel: 'My Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

export default createDrawerNavigator({
  'Home': HomeStack,
  'My Profile': ProfileStack,
  'My Friends': FriendsStack,
  'Create new vote': NewVoteStack,
  'Ongoing votes': OngoingVoteStack,
  'Saved result': SavedResultStack,
  'Settings': SettingsStack,
  'Log out': LogOutStack,
},
{

});
