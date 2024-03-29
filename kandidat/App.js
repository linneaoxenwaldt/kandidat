import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import ApiKeys from './constants/ApiKeys';
import * as firebase from 'firebase';
import MainTabNavigator from './navigation/MainTabNavigator'
import { DrawerActions, NavigationActions, createStackNavigator, createAppContainer, createSwitchNavigator, SwitchNavigator } from 'react-navigation';
import LoginScreen from './screens/auth/LoginScreen'
import SignupScreen from './screens/auth/SignupScreen'
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen'
import SettingsScreen from './screens/SettingsScreen';

const AppSwitchNavigator = createSwitchNavigator({
  Auth : LoginScreen,
  Home  : MainTabNavigator,
})

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoadingComplete: false,
      isAuthenticationReady: false,
      isAuthenticated: false,
    };
    //initilize firebase!
  if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.firebaseConfig); }
  //firebase.initializeApp(ApiKeys.firebaseConfig);
  firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }
onAuthStateChanged = (user) => {
  this.setState({isAuthenticationReady: true});
  this.setState({isAuthenticated: !!user});
}

  render() {
    if (!this.state.isLoadingComplete ||!this.state.isAuthenticationReady && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && <View style = {styles.statusBarUnderlay}/>}
          {(this.state.isAuthenticated)?  <MainTabNavigator /> : <AppNavigator />}

        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
