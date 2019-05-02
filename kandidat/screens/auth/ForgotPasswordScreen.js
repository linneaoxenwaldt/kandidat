import React from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert, Image, TouchableOpacity, Platform} from 'react-native';
import {DrawerActions,NavigationActions} from 'react-navigation';
import * as firebase from 'firebase';
import { LinearGradient } from 'expo';
import Icon from "react-native-vector-icons/Ionicons";

export default class SignupScreen extends React.Component{
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
      <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/100whitte.png?alt=media&token=46064aae-8998-4a9e-81fe-0af7174862fa'}} style={{width: 200, height: 50}}/>
    ),
    headerStyle: {
      backgroundColor: '#008080',
      height: 70,
      marginLeft: 10,
    },
    headerLeft: null
  };
};

constructor(props){
  super(props);
  this.state ={
    email : '',
  };
}



onResetPasswordPress = () => {
  var user = firebase.auth().currentUser;
  firebase.auth().sendPasswordResetEmail(this.state.email).then(function(){
    // Email sent.
    alert('Please check your email...')
  }).catch(function(error) {
    // An error happened.
  });
}
onBackToLoginPress = () => {
  this.props.navigation.navigate('Login')
}
render(){
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };
  return(

    <View style={styles.container}>
    <View style={styles.input}>
    <Text style={styles.textComp}> Forgot Password? </Text>

    <TextInput style={styles.inputContain}
    placeholder = 'Enter your email...'
    value = {this.state.email}
    onChangeText = {(text) => {this.setState({ email : text}) }}
    />

    <TouchableOpacity
              style = {styles.signUp}
              onPress = {this.onResetPasswordPress}
              underlayColor='#fff'>
              <Text style= {styles.signUpText}> Reset Password
              </Text>
     </TouchableOpacity>
     </View>


    <View>
    <TouchableOpacity style = {styles.arrowback} onPress={() => this.props.navigation.navigate('Login')}>
    <Icon
    name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
    size={55}
    color="#A9A9A9"/>
    </TouchableOpacity>
    </View>

    </View>

  );

}
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  textComp: {
    textAlign:'center',
    fontSize: 25,
    fontFamily: 'Roboto-Light',
    padding: 20,
  },

input: {
alignItems: 'center',
paddingTop: 50,
},

  inputContain: {
    width : 350,
    height : 70,
    borderWidth : 4,
    borderRadius: 50,
    borderColor: '#BA55B3',
    backgroundColor: '#CBA3D5',
    margin: 10,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Roboto-Light',
  },
  signUp: {
    justifyContent: 'center',
    width: 200,
    height: 70,
    margin: 10,
    padding: 10,
    marginTop:20,
    backgroundColor:'#BA55B3',
    borderRadius:20,
    borderWidth: 1,
    borderColor: '#fff'
  },
  signUpText:{
    fontSize:20,
    textAlign:'center',
    alignItems:'center',
    color: 'white',
  },
  arrowback: {
    alignItems: 'flex-start',
    marginTop: 200,   //dålig lösning men fick den ej på botten :D

  }

  
})
