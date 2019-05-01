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
import FriendsScreen from '../screens/FriendsScreen';

export default class AddFriendsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: '',
      users: [],
      friends: [],
    }
    this.getAllUsers()
    this.getYourFriends()
  }
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
  onPress={() => navigation.navigate('Friends')}
>
<Icon
  name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
  size={50}
  color='#FFFFFF'/>
</TouchableOpacity>
        ),
      };
    };

getAllUsers() {
  var that = this
  var db = firebase.firestore();
  db.collection("Users").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          const name = doc.get('Username');
          const id = doc.id;
          that.setState(prevState => ({
            users: [...prevState.users, {id: id, userName: name}]
          }))
      });
  });
 // var index = this.props.navigation.state.params.currentRows.length
 // var newIDnum = parseInt(this.props.navigation.state.params.currentRows[index-1].id, 10) + 1
 // var newID = newIDnum.toString()
 // var newFriend = {id: newID, text: this.state.text, img: require('../assets/images/robot-dev.png')}
 // this.props.navigation.state.params.currentRows.push(newFriend)
 }

 getYourFriends() {
   var that = this
   var user = firebase.auth().currentUser;
   var userID = user.uid;
   var db = firebase.firestore();
   db.collection("Users").doc(userID).collection("Friends").get().then(function(querySnapshot) {
       querySnapshot.forEach(function(doc) {
           // doc.data() is never undefined for query doc snapshots
           const name = doc.get('Username');
           const id = doc.id;
           that.setState(prevState => ({
             friends: [...prevState.friends, {id: id, userName: name}]
           }))
       });
   });
 }

 checkUsername() {
   if (this.state.text == "") {
     Alert.alert(
       data.noFriendName,
     )
   }
   else {
   var existFriend = false
   for (let i=0; i< this.state.users.length; i++) {
     // console.log(this.state.users[i].userName)
     // console.log(this.state.users[i].id)
     // console.log(this.state.text)
     if (this.state.text == this.state.users[i].userName) {
       existFriend = true
       var friend = this.state.users[i]
       console.log("användare finns")
     }
   }
   if (existFriend == true){
     this.checkIfAlreadyFriends(friend)
   }
   else {
     Alert.alert(
       data.missingFriendName,
     )
   }
 }
 }

 checkIfAlreadyFriends(friend) {
   var alreadyFriend = false
   for (let i=0; i< this.state.friends.length; i++) {
     if (friend.id == this.state.friends[i].id) {
       alreadyFriend = true
     }
   }
   if (alreadyFriend == false) {
     this.addUser(friend)
   }
   else {
     Alert.alert(
       data.alreadyFriends,
     )
   }
 }

 addUser(friend){
   var that = this
   var user = firebase.auth().currentUser;
   var userID = user.uid;
   var friendID = friend.id
   var db = firebase.firestore();
   if (userID == friendID) {
     Alert.alert(
       data.noAddYourself,
     )
   }
else {
   db.collection("Users").doc(userID).collection("Friends").doc(friendID).set({
})
.then(function() {
console.log("Document written with ID: ");
var currentRows = that.props.navigation.state.params
var docRef = db.collection('Users').doc(friendID);
docRef.get().then(function(doc) {
  if (doc.exists) {
    const username = doc.data().Username
    const profilePic = doc.data().ProfilePic
    var newFriend = {id: friendID, username: username, profilePic: profilePic}
    that.props.navigation.state.params.updateFriends(newFriend);
    that.props.navigation.navigate('Friends')
}})
.catch(function(error) {
console.error("Error adding document: ", error);
});
})
}
}

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.descriptionText}>{data.friendUsername}</Text>
      <TextInput
      style={styles.textInfo}
      placeholder="Friends user name"
      onChangeText={(text) => this.setState({text})}
      />
      <TouchableOpacity
      style = {styles.saveButton}
        onPress={() => this.checkUsername()}
        >
        <Text style={styles.saveText}>Save</Text>
       </TouchableOpacity>
       </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    textAlign:'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInfo: {
    backgroundColor: '#6BCDFD',
    fontSize: 25,
    textAlign:'center',
    alignItems: 'center',
    width: 350,
    height: 70,
    //backgroundColor: '#8FBC8F',
    borderRadius: 30,
    marginBottom: 10,
    padding: 10,
    color: '#FFFFFF',
  },
  descriptionText: {
    marginTop:20,
    marginBottom:20,
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
    marginTop: 20,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontFamily: 'Roboto-Light',
  },
});
