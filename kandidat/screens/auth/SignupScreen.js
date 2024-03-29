import React from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Image, TouchableOpacity, Platform} from 'react-native';
import * as firebase from 'firebase';
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
    rows : [],
    profilePic: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fanka.png?alt=media&token=21f921e3-067a-410d-a689-a2997d80611c',
  };
  this.getAllUserNames()
}

getAllUserNames() {
  var that = this
  var db = firebase.firestore();
  db.collection("Users").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      const dispName = doc.get('Username');
      that.setState(prevState =>({
        rows: [...prevState.rows, {userName : dispName}]
      }))
    }
  );
});
}

checkUserNames(){
  var that = this;
  var upperUserName = this.state.username.toUpperCase()
  var upperUserNameArray = []
  for (let i = 0; i < this.state.rows.length; i++){
    upperUserNameArray[i] = this.state.rows[i].userName.toUpperCase();
  }
  var nameTaken = false
  for (let i = 0; i < this.state.rows.length; i++){
    if (upperUserName == upperUserNameArray[i]){
      nameTaken = true
    }
  }
  if (nameTaken == true){
    Alert.alert('Username already taken!')
  }else{
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      this.props.navigation.navigate('Settings')
      this.createAccountDatabase()
    })}
  }

  onSignupPress = () => {
    if (this.state.password !== this.state.passwordConfirm || this.state.password.length < 6){
      Alert.alert('Error, please check inputs')
      return;
    } else{
      this.checkUserNames()
    } (error) =>{
      Alert.alert('Error, please check inputs');
    };
  }

  createAccountDatabase() {
    var user = firebase.auth().currentUser;
    var userID = user.uid;
    var that = this
    var db = firebase.firestore();
    db.collection("Users").doc(userID).set({
      Email: this.state.email,
      Username: this.state.username,
      ProfilePic: this.state.profilePic,
    })
    .then(function() {
    })
    .catch(function(error) {
      console.error("Error adding user: ", error);
    });
    var info1 = {CatName: "Colors", CatImg: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2FColors.jpg?alt=media&token=131c5e18-f477-4b87-8912-e1cdc8ecb2d7', Alternatives: ["Blue", "Green", "Grey", "Yellow", "Red"]}
    var info2 = {CatName: "Animals", CatImg: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fanimals.jpg?alt=media&token=b37a7136-2043-4f5f-ae03-a5afd5aed9a3', Alternatives: ["Dog", "Bird", "Cat", "Horse", "Rat"]}
    var info = [info1, info2]
    for(let i = 0; i < info.length; i++){
      var createObj = info[i];
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
      <TextInput style={styles.usernameInput}
      placeholder="Enter a username"
      value = {this.state.username}
      onChangeText = {(text) => {this.setState({ username : text}) }}
      />
      <TextInput style={styles.emailInput}
      placeholder="Enter an email"
      value = {this.state.email}
      onChangeText = {(text) => {this.setState({ email : text}) }}
      />
      <TextInput style={styles.passwordInput}
      secureTextEntry={true}
      placeholder="Enter a password"
      value = {this.state.password}
      //display = 'block'
      onChangeText = {(text) => {this.setState({ password : text}) }}
      />
      <TextInput style={styles.confirmPassInput}
      secureTextEntry={true}
      placeholder="Confirm the password"
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
    justifyContent: 'center',
  },
  headerText:{
    marginTop: 20,
    marginBottom: 20,
    textAlign:'center',
    fontSize: 32,
    fontFamily: 'Roboto-Light',
  },
  usernameInput: {
    backgroundColor: '#94B4C1',
    borderColor: '#758e99',
    borderWidth: 4,
    borderRadius:50,
    padding: 10,
    margin: 10,
    alignItems : 'center',
    textAlign:'center',
    fontSize: 20,
    fontFamily: 'Roboto-Light',
    color:'#fff',
    width: 350,
    height: 70,
  },
  emailInput: {
    backgroundColor: '#8FBC8F',
    borderColor: '#6f936f',
    borderWidth: 4,
    borderRadius:50,
    padding: 10,
    margin: 10,
    alignItems : 'center',
    textAlign:'center',
    fontSize: 20,
    fontFamily: 'Roboto-Light',
    color:'#fff',
    width: 350,
    height: 70,
  },
  passwordInput: {
    backgroundColor: '#6ACCCB',
    borderColor: '#5db3b2',
    borderWidth: 4,
    borderRadius:50,
    padding: 10,
    margin: 10,
    alignItems : 'center',
    textAlign:'center',
    fontSize: 20,
    fontFamily: 'Roboto-Light',
    color:'#fff',
    width: 350,
    height: 70,
  },
  confirmPassInput: {
    backgroundColor: '#689999',
    borderColor: '#567f7f',
    borderWidth: 4,
    borderRadius:50,
    padding: 10,
    margin: 10,
    alignItems : 'center',
    textAlign:'center',
    fontSize: 20,
    fontFamily: 'Roboto-Light',
    color:'#fff',
    width: 350,
    height: 70,
  },
  signInResult: {
    justifyContent: 'center',
    width: 100,
    height: 70,
    padding: 10,
    marginTop:10,
    marginLeft: '35%',
    backgroundColor:'#BA55B3',
    borderRadius:20,
    borderColor: '#fff',
    shadowColor: 'grey',
    shadowOpacity: 2,
    shadowRadius: 2,
    shadowOffset: {width: 0,height: 4},
  },
  signInResultText:{
    fontSize:20,
    textAlign:'center',
    color: '#fff',
  },
  arrowback: {
    marginLeft: '5%',
  },
})
