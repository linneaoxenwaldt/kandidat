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
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    this.userID = this.user.uid;
    this.state = {
      text: '',
      users: [],
      friends: [],
      pendingFriends: [],
      friendReq: [],
    }
    this.getAllUsers()
    this.getYourFriends()
    this.getPendingFriends()
    this.getFriendReq()
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
      this.db.collection("Users").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const name = doc.get('Username');
          const id = doc.id;
          that.setState(prevState => ({
            users: [...prevState.users, {id: id, userName: name}]
          }))
        });
      });
    }

    getYourFriends() {
      var that = this
      this.db.collection("Users").doc(this.userID).collection("Friends").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const name = doc.get('Username');
          const id = doc.id;
          that.setState(prevState => ({
            friends: [...prevState.friends, {id: id, userName: name}]
          }))
        });
      });
    }

    getPendingFriends() {
      var that = this
      this.db.collection("Users").doc(this.userID).collection("PendingFriendRequests").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const name = doc.get('Username');
          const id = doc.id;
          that.setState(prevState => ({
            pendingFriends: [...prevState.pendingFriends, {id: id, userName: name}]
          }))
        });
      });
    }

    getFriendReq() {
      var that = this
      this.db.collection("Users").doc(this.userID).collection("FriendRequests").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const name = doc.get('Username');
          const id = doc.id;
          that.setState(prevState => ({
            friendReq: [...prevState.friendReq, {id: id, userName: name}]
          }))
        });
      });
    }

    checkUsername() {
      var myFriendSearch = this.state.text.toUpperCase()
      var everyoneArray = []
      for (let i = 0; i < this.state.users.length; i++){
        everyoneArray[i] = this.state.users[i].userName.toUpperCase();
      }
      if (this.state.text == "") {
        Alert.alert(
          data.noFriendName,
        )
      }
      else {
        var existFriend = false
        for (let i=0; i< this.state.users.length; i++) {
          if (myFriendSearch == everyoneArray[i]) {
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
        this.checkIfPendingFriendReq(friend)
      }
      else {
        Alert.alert(
          data.alreadyFriends,
        )
      }
    }

    checkIfPendingFriendReq(friend) {
      var pendingFriend = false
      for (let i=0; i< this.state.pendingFriends.length; i++) {
        if (friend.id == this.state.pendingFriends[i].id) {
          pendingFriend = true
        }
      }
      if (pendingFriend == false) {
        this.checkIfFriendReq(friend)
      }
      else {
        Alert.alert(
          data.alreadyFriendReq,
        )
      }
    }

    checkIfFriendReq(friend) {
      var friendReq = false
      for (let i=0; i< this.state.friendReq.length; i++) {
        if (friend.id == this.state.friendReq[i].id) {
          friendReq = true
        }
      }
      if (friendReq == false) {
        this.addUser(friend)
      }
      else {
        Alert.alert(
          data.haveAFriendReq,
          undefined,
          [
            {text: data.ok,
              onPress: () => this.props.navigation.navigate('RequestScreen')
            },
          ],
          { cancelable: false })
      }
    }

    addUser(friend){
      var that = this
      var friendID = friend.id
      if (this.userID == friendID) {
        Alert.alert(
          data.noAddYourself,
        )
      }
      else {
        this.db.collection("Users").doc(this.userID).collection("PendingFriendRequests").doc(friendID).set({
        })
        .then(function() {
          console.log("Document written with ID: ");
          var docRef = that.db.collection('Users').doc(friendID);
          docRef.get().then(function(doc) {
            if (doc.exists) {
              const username = doc.data().Username
              const profilePic = doc.data().ProfilePic
              var newFriend = {id: friendID, username: username, profilePic: profilePic}
              that.sendFriendRequest(friendID, that.userID)
              that.props.navigation.navigate('Friends')
            }})
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
          })
        }
      }

      sendFriendRequest(friendID, userID) {
        this.db.collection("Users").doc(friendID).collection("FriendRequests").doc(userID).set({
        })
      }

      render() {
        return (
          <View style={styles.container}>
          <Text style={styles.descriptionText}>{data.friendUsername}</Text>
          <TextInput
          style={styles.textInfo}
          placeholder={data.username}
          onChangeText={(text) => this.setState({text})}
          />
          <TouchableOpacity
          style = {styles.addButton}
          onPress={() => this.checkUsername()}
          >
          <Text style={styles.addText}>{data.add}</Text>
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
        borderWidth: 4,
        borderColor: "#3BCDFD",
      },
      descriptionText: {
        marginTop:20,
        marginBottom:20,
        textAlign:'center',
        fontSize: 25,
        fontFamily: 'Roboto-Light',
        color: '#000000',
      },
      addButton: {
        backgroundColor: "#BA55B3",
        width: 150,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginBottom: 10,
        marginTop: 20,
      },
      addText: {
        color: "#FFFFFF",
        fontSize: 25,
        fontFamily: 'Roboto-Light',
      },
    });
