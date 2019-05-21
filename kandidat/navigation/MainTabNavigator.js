import React from 'react';
import { Platform, Button, Text, TouchableOpacity, Alert} from 'react-native';
import {SwitchNavigator,createAppContainer, createStackNavigator,
   createBottomTabNavigator, createDrawerNavigator, createSwitchNavigator} from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import * as firebase from 'firebase';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
//import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewVoteScreen from '../screens/NewVoteScreen';
import OngoingVoteScreen from '../screens/OngoingVoteScreen';
import SavedResultScreen from '../screens/SavedResultScreen';
//import LogOutScreen from '../screens/LogOutScreen';
import LoginScreen from '../screens/auth/LoginScreen'
import SignupScreen from '../screens/auth/SignupScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ChangeEmailScreen from '../screens/ChangeEmailScreen';
import NewCategory from '../screens/NewCategory';
import AlternativeScreen from '../screens/AlternativeScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import VoteAddFriends from '../screens/VoteAddFriends';
import RequestScreen from '../screens/RequestScreen';
import AddAlternativeScreen from '../screens/AddAlternativeScreen';
import VoteScreen from '../screens/VoteScreen';
import ResultScreen from '../screens/ResultScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});
HomeStack.navigationOptions = {
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
name={Platform.OS === "ios" ? "ios-information-circle" : "md-information-circle"}
size={25}
/>),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});
ProfileStack.navigationOptions = {
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
      name={Platform.OS === 'ios' ? 'ios-stats' : 'md-stats'}
    />
  ),
  drawerIcon: ({ focused }) => (
    <Icon
      name={Platform.OS === "ios" ? "ios-stats" : "md-stats"}
      size={25}
    />),
};

const LoginStack = createStackNavigator({
  LoginScreen: LoginScreen,
});

const ChangePasswordStack = createStackNavigator({
  ChangePassword: ChangePasswordScreen,
});
ChangePasswordStack.navigationOptions = {
};

const ChangeEmailStack = createStackNavigator({
  ChangeEmail: ChangeEmailScreen,
});
ChangeEmailStack.navigationOptions = {
};

const AddFriendStack = createStackNavigator({
  AddFriend: AddFriendScreen,
});

const NewCategoryStack = createStackNavigator({
  newCategory: NewCategory,
});
NewCategoryStack.navigationOptions = {
};

const AlternativeScreenStack = createStackNavigator({
  alternativeScreen: AlternativeScreen,
});
AlternativeScreenStack.navigationOptions = {
};

const AddAlternativeScreenStack = createStackNavigator({
  addAlternativeScreen: AddAlternativeScreen,
});
AddAlternativeScreenStack.navigationOptions = {
};

const VoteScreenStack = createStackNavigator({
  VoteScreen: VoteScreen,
});
VoteScreenStack.navigationOptions = {
};

const ResultScreenStack = createStackNavigator({
  ResultScreen: ResultScreen,
});
ResultScreenStack.navigationOptions = {
};

const VoteAddFriendsStack = createStackNavigator({
  VoteAddFriends: VoteAddFriends,
});

const RequestStack = createStackNavigator({
  RequestScreen: RequestScreen,
});
RequestStack.navigationOptions = {
  tabBarLabel: 'Requests',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-help-circle' : 'md-help-circle'}
    />
  ),
  drawerIcon: ({ focused }) => (
    <Icon
      name={Platform.OS === 'ios' ? 'ios-help-circle' : 'md-help-circle'}
      size={25}
    />),
};


const DrawerComponent = createDrawerNavigator(
  {
    'Home ': HomeStack,
    'My Profile ': ProfileStack,
    'My Friends ': FriendsStack,
    'Create new vote  ': NewVoteStack,
    'Ongoing votes ': OngoingVoteStack,
    'Requests ': RequestStack,
    'Results ': SavedResultStack,
    'Info ': SettingsStack,
  },
);


const AppStack = createStackNavigator({
  Drawer: { screen: DrawerComponent },
  ChangePassword: {screen: ChangePasswordStack},
  NewCategory: { screen: NewCategoryStack },
  ChangeEmail: {screen: ChangeEmailStack},
  AlternativeScreen: {screen: AlternativeScreenStack},
  AddFriendScreen: {screen: AddFriendStack},
  LoginScreen: {screen: LoginStack},
  //RequestScreen: {screen: RequestStack},
  VoteAddFriends: {screen: VoteAddFriendsStack},
  AddAlternative: {screen: AddAlternativeScreenStack},
  VoteScreen: {screen: VoteScreenStack},
  ResultScreen: {screen: ResultScreenStack},
  Settings: {screen: SettingsStack},
}, {
  headerMode: 'none',
});

const App = props => <AppStack {...props} />;
App.router = AppStack.router;

export default createAppContainer(createSwitchNavigator({
  app: App,
}));
