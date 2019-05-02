import React from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert, Image, TouchableOpacity, Platform} from 'react-native';
import {DrawerActions,NavigationActions} from 'react-navigation';
import * as firebase from 'firebase';
import { LinearGradient } from 'expo';
import Icon from "react-native-vector-icons/Ionicons";

export default class SignupScreen extends React.Component{
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (<Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/100whitte.png?alt=media&token=46064aae-8998-4a9e-81fe-0af7174862fa'}} style={{width: 200, height: 50}}/>
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
        username: '',
        email : '',
        password : '',
        passwordConfirm : '',
        profilePic: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fanka.png?alt=media&token=21f921e3-067a-410d-a689-a2997d80611c',
      };
    }

    onSignupPress = () => {
      if (this.state.password !== this.state.passwordConfirm){
        Alert.alert('Passwords do not match')
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.createAccountDatabase()
      },(error) =>{
        Alert.alert(error.message);
      });
    }

    createAccountDatabase() {
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var that = this
      console.log(user)
      var db = firebase.firestore();
      db.collection("Users").doc(userID).set({
    Email: this.state.email,
    Username: this.state.username,
    ProfilePic: this.state.profilePic,
})
.then(function() {
    console.log("User written with ID: ");
})
.catch(function(error) {
    console.error("Error adding user: ", error);
});
var info1 = {CatName: "Colors", CatImg: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fcolors.jpg?alt=media&token=e65f0a39-c9b9-4db0-b261-428313aa42d3', Alternatives: ["Blue", "Green", "Grey", "Yellow", "Red"]}
var info2 = {CatName: "Animals", CatImg: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fanimals.jpg?alt=media&token=b37a7136-2043-4f5f-ae03-a5afd5aed9a3', Alternatives: ["Dog", "Bird", "Cat", "Horse", "Rat"]}
var info = [info1, info2]
for(let i = 0; i < info.length; i++){
  var createObj = info[i];
  console.log(createObj)
  that.createCategory(userID, createObj)
}
}

    createCategory(userID, createObj) {
      var that = this
      var db = firebase.firestore();
      db.collection("Users").doc(userID).collection('Category').add({
        CatName: createObj.CatName,
        CatImg: createObj.CatImg,
      })
      .then(function(docRef) {
        console.log("Category written with ID: ", docRef.id);
        var catID = docRef.id
        that.createAlternative(userID, catID, createObj)
      })
      .catch(function(error) {
        console.error("Error adding category: ", error);
      });
    }

      createAlternative(userID, catID, createObj) {
        var db = firebase.firestore();
        for(let i = 0; i < createObj.Alternatives.length; i++){
        db.collection("Users").doc(userID).collection('Category').doc(catID).collection('Alternative').add({
          Name: createObj.Alternatives[i],
          Votes: 0,
        })
        .then(function(docRef) {
          console.log("Alternativ written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding alternativ: ", error);
        });
      }
      }

    render(){
      return(
        <View style={styles.container}>

        <Text style={styles.headerText}> Welcome to sign up! </Text>
        <View style={styles.inputFields}>
        <TextInput style={styles.inputText}
        placeholder="Enter a username... "
        backgroundColor= '#94B4C1'
        borderColor= '#758e99'
        borderWidth='4'

        //backgroundColor = "#6ACCCB"
        value = {this.state.username}
        onChangeText = {(text) => {this.setState({ username : text}) }}
        />
        <TextInput style={styles.inputText}
        placeholder="Enter an email... "
        backgroundColor='#8FBC8F'
        borderColor= '#6f936f'
        borderWidth='4'


        value = {this.state.email}
        onChangeText = {(text) => {this.setState({ email : text}) }}
        />
        <TextInput style={styles.inputText}
        secureTextEntry={true}
        placeholder="Enter a password..."
        backgroundColor='#6ACCCB'
        borderColor= '#5db3b2'
        borderWidth='4'


        //backgroundColor='#94B4C1'
        value = {this.state.password}
        //display = 'block'
        onChangeText = {(text) => {this.setState({ password : text}) }}
        />
        <TextInput style={styles.inputText}
        secureTextEntry={true}
        placeholder="Confirm the password..."
        backgroundColor='#689999'
        borderColor= '#567f7f'
        borderWidth='4'
        borderColor= '#567f7f'
        borderWidth='4'
        //backgroundColor='#8FBC8F'
        value = {this.state.passwordConfirm}
        onChangeText = {(text) => {this.setState({ passwordConfirm : text}) }}
        />
        <TouchableOpacity
                  style = {styles.signInResult}
                   onPress = {this.onSignupPress}
                  underlayColor='#fff'>
                  <Text style= {styles.signInResultText}> Sign in
                  </Text>
         </TouchableOpacity>


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
      margin: 5,
      textAlign:'center',
      fontSize: 20,
      fontFamily: 'Roboto-Light',
      color:'white',
      width: 350,
      height: 70,
      borderRadius:50,
    },
    signInResult: {
      justifyContent: 'center',
      width: 100,
      height: 70,
      margin: 10,
      padding: 10,
      marginTop:20,
      backgroundColor:'#BA55B3',
      borderRadius:20,
      borderWidth: 1,
      borderColor: '#fff'
    },
    signInResultText:{
      fontSize:20,
      textAlign:'center',
      alignItems:'center',
      color: 'white',
    },
    arrowback: {
      marginLeft: '5%',
    },
  })
