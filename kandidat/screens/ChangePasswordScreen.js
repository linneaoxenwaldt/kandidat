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
  Modal
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import { ExpoLinksView } from '@expo/samples';
import data from '../data/engWord.json';
import * as firebase from 'firebase';

export default class ChangePasswordScreen extends React.Component {
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
  size={50}
  color='#FFFFFF'/>
</TouchableOpacity>
        ),
      };
    };

    constructor(props){
      super(props);
      this.state ={
        currentPassword : '',
        email : '',
        newPassword : '',
        newPasswordConfirm : '',
      }
    }

    reauthenticate = (currentPassword) => {
      var user = firebase.auth().currentUser;
      var cred = firebase.auth.EmailAuthProvider.credential(user.email, this.state.currentPassword)
      return user.reauthenticateAndRetrieveDataWithCredential(cred);
    }

    newPasswordFunc = () => {
      this.reauthenticate(this.state.currentPassword).then(() => {
        if (this.state.newPassword !== this.state.newPasswordConfirm){
          Alert.alert('Passwords do not match')
          console.log('no match alert')
          return;
        } else{
          user.updatePassword(this.state.newPassword).then(function() {
            // Update successful.
            Alert.alert('Password changed')
            console.log('changedPW')
          }).catch(function(error) {
            // An error happened.
            Alert.alert('Password epic fail happened')
            console.log('pw change fail')
          });
          //console.log('should change')
        } (error) =>{
          //Alert.alert(error.message);
        };

      }).catch((error)=>{

      })

      var user = firebase.auth().currentUser;


    }


  render() {
    return (
      <View style={styles.container}>
      <View style={styles.passwordInfoContainer}>

      <Text style={styles.descriptionText}>{data.currentPassword}</Text>
      <TextInput
      style={styles.textInfo}
      //backgroundColor='#94B4C1'
      borderColor='#758e99'
      //borderWidth= '4'
      placeholder="Password"
      value = {this.state.currentPassword}
      onChangeText = {(text) => {this.setState({ currentPassword : text}) }}
      />

      <Text style={styles.descriptionText}>{data.newPassword}</Text>
      <TextInput
      style={styles.textInfo}
      //backgroundColor='#8FBC8F'
      borderColor='#6f936f'
      //borderWidth= '4'
      placeholder="New password"
      value = {this.state.newPassword}
      onChangeText = {(text) => {this.setState({ newPassword : text}) }}
      />

      <Text style={styles.descriptionText}>{data.confirmNewPassword}</Text>
      <TextInput
      style={styles.textInfo}
      //backgroundColor='#6ACCCB'
      borderColor='#5db3b2'
      //borderWidth= '4'
      placeholder="New password"
      value = {this.state.newPasswordConfirm}
      onChangeText = {(text) => {this.setState({ newPasswordConfirm : text}) }}
      />

<TouchableOpacity
style = {styles.saveButton}
  onPress={this.newPasswordFunc}
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
  passwordInfoContainer: {
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
    borderWidth: 4,
    marginBottom: 10,
    padding: 10,
    color: '#FFFFFF',
  },
  descriptionText: {
    marginTop:20,
    textAlign:'center',
    fontSize: 25,
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
