import React from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert, Image, TouchableOpacity, Platform} from 'react-native';
import {DrawerActions,NavigationActions} from 'react-navigation';
import * as firebase from 'firebase';
import { LinearGradient } from 'expo';
import Icon from "react-native-vector-icons/Ionicons";

export default class SignupScreen extends React.Component{
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: ( <Text> 'Logggoooo häär' </Text>
        ),
        headerStyle: {
          backgroundColor: '#008080',
          height: 70,
          marginLeft: 10,
        },
      };
    };

    constructor(props){
      super(props);
      this.state ={
        email : '',
        password : '',
        passwordConfirm : '',
      };
    }

    onSignupPress = () => {
      if (this.state.password !== this.state.passwordConfirm){
        Alert.alert('Passwords do not match')
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {

      },(error) =>{
        Alert.alert(error.message);
      });
    }

    render(){
      return(
        <View style={styles.container}>

        <Text style={styles.headerText}> Welcome to sign up! </Text>
        <View style={styles.inputFields}>
        <TextInput style={styles.inputText}
        placeholder="Enter a username... "
        backgroundColor = "#6ACCCB"
        value = {this.state.email}
        onChangeText = {(text) => {this.setState({ username : text}) }}
        />
        <TextInput style={styles.inputText}
        placeholder="Enter an email... "
        backgroundColor = "#CBA3D5"
        value = {this.state.email}
        onChangeText = {(text) => {this.setState({ email : text}) }}
        />
        <TextInput style={styles.inputText}
        placeholder="Enter a password..."
        backgroundColor='#94B4C1'
        value = {this.state.password}
        display = 'block'
        onChangeText = {(text) => {this.setState({ password : text}) }}
        />
        <TextInput style={styles.inputText}
        placeholder="Confirm the password..."
        backgroundColor='#8FBC8F'
        value = {this.state.passwordConfirm}
        onChangeText = {(text) => {this.setState({ passwordConfirm : text}) }}
        />

        <Button style={styles.signButton} title = 'Sign up' onPress = {this.onSignupPress}/>

        </View>

        <TouchableOpacity style={styles.arrowback} onPress={() => this.props.navigation.navigate('Login')}>
        <Icon
        name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
        size={50}
        color="#A9A9A9"/>
        </TouchableOpacity>

        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerText:{
      marginTop: 40,
      textAlign:'center',
      fontSize: 32,
      fontFamily: 'Roboto-Light',
    },
    inputFields: {
      paddingTop: 15,
      alignItems : 'center',
    },
    inputText: {
      width : 250,
      height : 60,
      margin: 15,
      borderWidth : 1,
      borderRadius: 20,
      textAlign:'center',
      fontSize: 20,
      fontFamily: 'Roboto-Light',
    },
    arrowback: {
      marginLeft: '5%',
    },
  })
