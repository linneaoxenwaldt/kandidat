import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';
import * as firebase from 'firebase';

export default class ChangeEmailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/100whitte.png?alt=media&token=46064aae-8998-4a9e-81fe-0af7174862fa'}} style={{width: 200, height: 50}}/>),
        headerStyle: {
          backgroundColor: '#008080',
          height: 70,
          marginLeft: 10,
        },
        headerLeft: (
          <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          >
          <Icon
          name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
          size={55}
          color='#FFFFFF'/>
          </TouchableOpacity>
        ),
      };
    };

    constructor(props){
      super(props);
      this.state ={
        currentEmail : '',
        newEmail : '',
        confirmNewEmail : '',
        currentPassword : '',
      }
    }

    reauthenticate = (currentPassword) => {
      var user = firebase.auth().currentUser;
      var cred = firebase.auth.EmailAuthProvider.credential(user.email, this.state.currentPassword)
      return user.reauthenticateAndRetrieveDataWithCredential(cred);
    }

    updateNewEmail(){
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var that = this
      var db = firebase.firestore();
      db.collection("Users").doc(userID).update({
        Email: this.state.newEmail,
      })
      .then(function() {
      })
      .catch(function(error) {
      });
    }
    newEmailFunc = () => {
      this.reauthenticate(this.state.currentPassword).then(() => {
        if (this.state.newEmail !== this.state.confirmNewEmail){
          Alert.alert('Emails do not match!')
          return;
        } else{
          this.updateNewEmail()
          user.updateEmail(this.state.newEmail).then(function() {
            Alert.alert('Email is changed!')
          }).catch(function(error) {
            Alert.alert('Error')
          });
        } (error) =>{
        };
      }).catch((error)=>{
        Alert.alert('Error: Invalid inut!')
      })
      var user = firebase.auth().currentUser;
    }

    render() {
      return (
        <View style={styles.container}>
        <View style={styles.emailInfoContainer}>

        <Text style={styles.descriptionText}>{data.newEmail}</Text>
        <TextInput
        style={styles.textInfo}
        backgroundColor='#8FBC8F'
        borderColor='#6f936f'
        borderWidth= '4'
        placeholder={data.enterEmail}
        value = {this.state.newEmail}
        onChangeText = {(text) => {this.setState({ newEmail : text}) }}
        />

        <Text style={styles.descriptionText}>{data.confirmEmail}</Text>
        <TextInput
        style={styles.textInfo}
        backgroundColor='#6ACCCB'
        borderColor='#5db3b2'
        borderWidth= '4'
        placeholder={data.newEmailAgain}
        value = {this.state.confirmNewEmail}
        onChangeText = {(text) => {this.setState({ confirmNewEmail : text}) }}
        />

        <Text style={styles.descriptionText}>{data.confirmChanges}</Text>
        <TextInput
        style={styles.textInfo}
        borderColor='#758e99'
        borderWidth= '4'
        backgroundColor='#94B4C1'
        secureTextEntry={true}
        placeholder={data.password}
        value = {this.state.currentPassword}
        onChangeText = {(text) => {this.setState({ currentPassword : text}) }}
        />

        <TouchableOpacity
        style = {styles.saveButton}
        onPress={this.newEmailFunc}
        >
        <Text style={styles.saveText}>{data.save}</Text>
        </TouchableOpacity>
        </View>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 15,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
    },
    emailInfoContainer: {
      alignItems: 'center',
      textAlign: 'center',
      flex: 1,
    },
    textInfo: {
      fontSize: 25,
      textAlign:'center',
      alignItems: 'center',
      width: 350,
      height: 70,
      backgroundColor: '#8FBC8F',
      borderRadius: 30,
      marginBottom: 10,
      padding: 10,
      color: '#FFFFFF',
    },
    descriptionText: {
      margin: 10,
      textAlign:'center',
      fontSize: 30,
      fontFamily: 'Roboto-Light',
      color: '#000000',
    },
    saveButton: {
      backgroundColor: "#BA55B3",
      width: 150,
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      marginBottom: 10,
      marginTop: 50,
    },
    saveText: {
      color: "#FFFFFF",
      fontSize: 25,
      fontFamily: 'Roboto-Light',
    },
  });
