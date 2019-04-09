import React from 'react';
import { Platform, Button, Text } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator, createSwitchNavigator,
TouchableOpacity, } from 'react-navigation';
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
  headerLeft:(<TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="ios-menu" size={30} />
                  </TouchableOpacity>),
  drawerIcon: ({ focused }) => (
    <Icon
      name={Platform.OS === "ios" ? "ios-home" : "md-home"}
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
      name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
    />
  ),
  drawerIcon: ({ focused }) => (
    <Icon
      name={Platform.OS === "ios" ? "ios-settings" : "md-settings"}
      size={25}
    />),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

ProfileStack.navigationOptions = {
  headerLeft: <Button onPress={() => navigation.openDrawer()} title="Open menu" />,
  tabBarLabel: 'My Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
  drawerIcon: ({ focused }) => (
    <Icon
      name={Platform.OS === "ios" ? "ios-person" : "md-person"}
      size={25}
    />),
};

const FriendsStack = createStackNavigator({
  Friends: FriendsScreen,
});

FriendsStack.navigationOptions = {
  tabBarLabel: 'My Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-people' : 'md-people'}
    />
  ),
  drawerIcon: ({ focused }) => (
    <Icon
      name={Platform.OS === "ios" ? "ios-people" : "ios-people"}
      size={25}
    />),
};

const NewVoteStack = createStackNavigator({
  NewVote: NewVoteScreen,
});

NewVoteStack.navigationOptions = {
  tabBarLabel: 'My Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
    />
  ),
  drawerIcon: ({ focused }) => (
    <Icon
      name={Platform.OS === "ios" ? "ios-add" : "md-add"}
      size={25}
    />),
};

const OngoingVoteStack = createStackNavigator({
  OngoingVote: OngoingVoteScreen,
});

OngoingVoteStack.navigationOptions = {
  tabBarLabel: 'My Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-clock' : 'md-clock'}
    />
  ),
  drawerIcon: ({ focused }) => (
    <Icon
      name={Platform.OS === "ios" ? "ios-clock" : "md-clock"}
      size={25}
    />),
};

const SavedResultStack = createStackNavigator({
  SavedResult: SavedResultScreen,
});

SavedResultStack.navigationOptions = {
  tabBarLabel: 'My Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-save' : 'md-save'}
    />
  ),
  drawerIcon: ({ focused }) => (
    <Icon
      name={Platform.OS === "ios" ? "ios-save" : "md-save"}
      size={25}
    />),
};

const LogOutStack = createStackNavigator({
  LogOut: LogOutScreen,
});

LogOutStack.navigationOptions = {
  tabBarLabel: 'My Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-log-out' : 'md-log-out'}
    />
  ),
  drawerIcon: ({ focused }) => (
    <Icon
      name={Platform.OS === "ios" ? "ios-log-out" : "md-log-out"}
      size={25}
    />),
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

const DrawerComponent = createDrawerNavigator(
  {
    'Home': HomeStack,
    'My Profile': ProfileStack,
    'My Friends': FriendsStack,
    'Create new vote': NewVoteStack,
    'Ongoing votes': OngoingVoteStack,
    'Saved result': SavedResultStack,
    'Settings': SettingsStack,
    'Log out': LogOutStack,
  },
);



const AppStack = createStackNavigator({
  Drawer: { screen: DrawerComponent },
}, {
  headerMode: 'none',
});

const App = props => <AppStack {...props} />;
App.router = AppStack.router;

export default createSwitchNavigator({
  app: App,
});
