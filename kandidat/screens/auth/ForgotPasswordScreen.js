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
    <View>
    <View style={styles.container}>
    <Text style={styles.textComp}> Forgot Password? </Text>

    <TextInput style={styles.inputContain}
    placeholder = 'Enter your email...'
    value = {this.state.email}
    onChangeText = {(text) => {this.setState({ email : text}) }}
    />

    <Button title = 'Reset Password' onPress = {this.onResetPasswordPress} />
    <Button style={styles.backButton} title = 'Back to Login' onPress = {this.onBackToLoginPress}/>

    </View>

    <TouchableOpacity style={styles.arrowback} onPress={() => this.props.navigation.navigate('Login')}>
    <Icon
    name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
    size={50}
    color="#A9A9A9"/>
    </TouchableOpacity>


    <LinearGradient
    colors={['#FFFFFF', '#6ACCCB']}
    style={{ height: '100%', alignItems: 'center', borderRadius: 5 }}>
    </LinearGradient>
    </View>

  );

}
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: 'center',
  },
  textComp: {
    textAlign:'center',
    fontSize: 24,
    fontFamily: 'Roboto-Light',
    padding: 20,
  },
  inputContain: {
    width : 250,
    height : 40,
    borderWidth : 2,
    borderRadius: 15,
    borderColor: '#BA55B3',
    backgroundColor: '#CBA3D5',
    margin: 30,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Light',
  },
  arrowback: {
    marginLeft:'5%',
  }


})
