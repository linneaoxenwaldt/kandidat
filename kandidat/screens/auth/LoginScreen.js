import React from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert, Image, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component{
  static navigationOptions = {
    header: null
  }

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
      <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/100whitte.png?alt=media&token=46064aae-8998-4a9e-81fe-0af7174862fa'}} style={{width: 300, height: 80, marginBottom: 50, marginTop: 50}}/>
      <TextInput style = {styles.textInputContainer}
      style={styles.textInput}
      placeholder="Email"
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

      <TouchableOpacity
      onPress = {this.onForgotPasswordPress}>
      <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
      style = {styles.createAccount}
      onPress={this.onCreateAccountPress}
      underlayColor='#fff'>
      <Text style= {styles.logInText}>Create account </Text>
      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    height:'100%',
    backgroundColor: '#008080',
    alignItems:'center',
  },
  textInputContainer: {
    width: 350,
    height: 70,
    backgroundColor: '#94B4C1',
    justifyContent: 'center',
    borderRadius: 50,
    marginTop: 40,
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
    borderRadius: 50,
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
    borderRadius:50,
    borderWidth: 1,
    borderColor: '#fff'
  },
  logInText:{
    justifyContent:'center',
    fontSize:20,
    textAlign:'center',
    alignItems:'center',
    color: 'white',
  },
  createAccount: {
    flexDirection:'row',
    marginBottom:10,
    justifyContent: 'center',
    width: 350,
    height: 70,
    marginBottom: 0,
    padding: 10,
    backgroundColor:'#6BCDFD',
    borderRadius:50,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
    marginBottom:10,
    alignItems: 'center',
  },
  forgotPassword: {
    color: '#fff',
    fontSize: 20,
  }
});
