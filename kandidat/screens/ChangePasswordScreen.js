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
      this.db = firebase.firestore();
      this.user = firebase.auth().currentUser;
      this.state ={
        currentPassword : '',
        email : '',
        newPassword : '',
        newPasswordConfirm : '',
      }
    }

    reauthenticate = (currentPassword) => {
      var cred = firebase.auth.EmailAuthProvider.credential(this.user.email, this.state.currentPassword)
      return this.user.reauthenticateAndRetrieveDataWithCredential(cred);
    }

    newPasswordFunc = () => {
      var that = this
      this.reauthenticate(this.state.currentPassword).then(() => {
        if (this.state.newPassword !== this.state.newPasswordConfirm){
          Alert.alert(data.passwDoNotMatch)
          return;
        } else{
          user.updatePassword(this.state.newPassword).then(function() {
            Alert.alert(
              data.changedPassword,
              undefined,
              [
                {text: data.ok,
                  onPress: () => that.props.navigation.navigate('Profile')
                },
              ],
              { cancelable: false })
          }).catch(function(error) {
            Alert.alert('unable to change password, password must be atleast six characters')
          });
        } (error) =>{
          Alert.alert(data.error);
        };
      }).catch((error)=>{
        Alert.alert(data.invalidInput)
      })
      var user = firebase.auth().currentUser;
    }


    render() {
      return (
        <View style={styles.container}>
        <View style={styles.passwordInfoContainer}>

        <Text style={styles.descriptionText}>{data.newPassword}</Text>
        <TextInput
        style={styles.textNew}
        secureTextEntry={true}
        placeholder={data.enterNewPass}
        value = {this.state.newPassword}
        onChangeText = {(text) => {this.setState({ newPassword : text}) }}
        />

        <Text style={styles.descriptionText}>{data.confirmPassword}</Text>
        <TextInput
        style={styles.textConfirm}
        secureTextEntry={true}
        placeholder={data.confirmNewPass}
        value = {this.state.newPasswordConfirm}
        onChangeText = {(text) => {this.setState({ newPasswordConfirm : text}) }}
        />

        <Text style={styles.descriptionText}>{data.currentPassword}</Text>
        <TextInput
        style={styles.textCurrent}
        secureTextEntry={true}
        placeholder={data.password}
        value = {this.state.currentPassword}
        onChangeText = {(text) => {this.setState({ currentPassword : text}) }}
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
    textNew: {
      backgroundColor:'#8FBC8F',
      borderColor:'#6f936f',
      borderWidth: '4',
      fontSize: 25,
      textAlign:'center',
      alignItems: 'center',
      width: 350,
      height: 70,
      borderRadius: 30,
      borderWidth: 4,
      marginBottom: 10,
      padding: 10,
      color: '#FFFFFF',
    },
    textConfirm: {
      backgroundColor:'#6ACCCB',
      borderColor:'#5db3b2',
      borderWidth: '4',
      fontSize: 25,
      textAlign:'center',
      alignItems: 'center',
      width: 350,
      height: 70,
      borderRadius: 30,
      borderWidth: 4,
      marginBottom: 10,
      padding: 10,
      color: '#FFFFFF',
    },
    textCurrent: {
      backgroundColor:'#94B4C1',
      borderColor:'#758e99',
      borderWidth: '4',
      fontSize: 25,
      textAlign:'center',
      alignItems: 'center',
      width: 350,
      height: 70,
      borderRadius: 30,
      borderWidth: 4,
      marginBottom: 10,
      padding: 10,
      color: '#FFFFFF',
    },
    descriptionText: {
      margin: 10,
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
      shadowColor: 'grey',
      shadowOpacity: 2,
      shadowRadius: 2,
      shadowOffset: {width: 0,height: 4},
    },
    saveText: {
      color: "#FFFFFF",
      fontSize: 25,
      fontFamily: 'Roboto-Light',
    },
  });
