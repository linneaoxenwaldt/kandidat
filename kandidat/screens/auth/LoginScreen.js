import React from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert, Image, TouchableOpacity} from 'react-native';
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
      <View style = {styles.container}>
      <Text style = {styles.logInLabel}>Login</Text>


      <TextInput style = {styles.textInputContainer}
      style={styles.textInput}
      placeholder="Username"
      value = {this.state.email}
      onChangeText = {(text) => {this.setState({ email : text}) }}
      />

      <TextInput style = {styles.textInputContainer}
      secureTextEntry={true}
      style={styles.textInput}
      placeholder="Password"
      value = {this.state.password}
      onChangeText = {(text) => {this.setState({ password : text}) }}
      />

      <TouchableOpacity
                style = {styles.createOwnCategoryContainer}
                onPress={this.onLoginPress}
                underlayColor='#fff'>
                <Text style= {styles.logInText}>Log in </Text>
       </TouchableOpacity>
       <Button title = 'Forgot password?' onPress = {this.onForgotPasswordPress} color = 'white'/>


       <TouchableOpacity
                 style = {styles.createAccount}
                 onPress={this.onCreateAccountPress}
                 underlayColor='#fff'>
                 <Text style= {styles.logInText}>Create account </Text>
        </TouchableOpacity>







      </View>
    );
      //return <Text style = {{paddingTop:20}}>LoginScreen</Text>

  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#008080',
    padding:10,
    alignItems:'center',

  },

  textInputContainer: {
    width: 350,
    height: 70,
    backgroundColor: '#94B4C1',
    //alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 5,
    padding: 10,
  },
  logInLabel: {
    fontFamily: 'Roboto-Light',
    color: 'black',
    fontSize: 20,
    marginTop:40,
    marginBottom: 40,
  },
  textInput: {
    backgroundColor: 'white',
    fontSize: 20,
    textAlign:'center',
    alignItems: 'center',
    width: 350,
    height: 70,
    //backgroundColor: '#8FBC8F',
    borderRadius: 30,
    marginBottom: 10,
    marginTop:10,
    padding: 10,
    color: 'black',
  },
  createOwnCategoryContainer: {
    justifyContent: 'center',
    width: 350,
    height: 70,
    margin: 10,
    padding: 10,
    backgroundColor:'#BA55B3',
    borderRadius:30,
    borderWidth: 1,
    borderColor: '#fff'
  },
  logInText:{
    fontSize:20,
    textAlign:'center',
    alignItems:'center',
    color: 'white',
  },
  createAccount: {

    justifyContent: 'center',
    width: 350,
    height: 70,
    marginBottom: 0,
    padding: 10,
    backgroundColor:'#6BCDFD',
    borderRadius:30,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 100,

  },



});
