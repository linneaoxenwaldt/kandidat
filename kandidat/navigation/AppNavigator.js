import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator, SwitchNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/auth/LoginScreen'
import SignupScreen from '../screens/auth/SignupScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'
import SettingsScreen from '../screens/SettingsScreen';


const RootStack = createStackNavigator({
  Login: LoginScreen,
  Signup: {screen: SignupScreen},
  ForgotPassword: {screen: ForgotPasswordScreen},
})
const AppContainer = createAppContainer(RootStack)

export default AppContainer;
