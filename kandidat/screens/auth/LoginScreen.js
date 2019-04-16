import React from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import { DrawerActions, NavigationActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import { ExpoLinksView } from '@expo/samples';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component{

  constructor(props){
    super(props);
    this.state ={
email:'',
password:'',

     };
  }

  onLoginPress = () => {
firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
  .then(() => {

  }, (error) => {
    Alert.alert(error.message);
  });

  }
  onCreateAccountPress = () => {
    this.props.navigation.navigate('Signup')
  }
  onForgotPasswordPress = () => {
    this.props.navigation.navigate('ForgotPassword')
  }
    render(){
      return(
      <View style = {{ paddingTop: 50, alignItems : 'center'}}>
      <Text>Login</Text>

      <TextInput style = {{ width : 200, height : 40, borderWidth : 1 }}
      value = {this.state.email}
      onChangeText = {(text) => {this.setState({ email : text}) }}
      />

      <TextInput style = {{ width : 200, height : 40, borderWidth : 1 }}
      value = {this.state.password}
      onChangeText = {(text) => {this.setState({ password : text}) }}
      />

      <Button title = 'Login' onPress = {this.onLoginPress} />
      <Button title = 'Create account' onPress = {this.onCreateAccountPress}/>
      <Button title = 'Forgot password' onPress = {this.onForgotPasswordPress}/>

      </View>
    );
      //return <Text style = {{paddingTop:20}}>LoginScreen</Text>

  }
}

const styles = StyleSheet.create({
});
