import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';
import * as firebase from 'firebase';

export default class FriendsScreen extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    this.extractKey = ({id}) => id
    this.state = {
      friendsInfo: [],
    }
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
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
          <Icon
          name={Platform.OS === "ios" ? "ios-menu" : "md-menu"}
          size={40}
          color='#FFFFFF'/>
          </TouchableOpacity>
        ),
      };
    };

    deleteFriend(delItem) {
      var that = this
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      db.collection("Users").doc(userID).collection("Friends").doc(delItem.id).delete().then(function() {
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
      this.setState(prevState => ({friendsInfo: prevState.friendsInfo.filter(item => item !== delItem) }));

      db.collection("Users").doc(delItem.id).collection("Friends").doc(userID).delete().then(function() {
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
    }

    updateFriends(friend) {
      var db = firebase.firestore();
      var that = this
      var friendID = friend.id
      var docRef = db.collection('Users').doc(friendID);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          const username = doc.data().Username
          const profilePic = doc.data().ProfilePic
          that.setState(prevState => ({
            friendsInfo: [...prevState.friendsInfo, {id: friendID, username: username, profilePic: profilePic}]
          }))
        } else {
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
    }

  getYourFriends() {
    var that = this
    var user = firebase.auth().currentUser;
    var userID = user.uid;
    var db = firebase.firestore();
    db.collection("Users").doc(userID).collection("Friends").onSnapshot(function(querySnapshot) {
      that.setState({friendsInfo:[] })

        querySnapshot.forEach(function(doc) {
          const id = doc.id;
          var docRef = db.collection('Users').doc(id);
          docRef.get().then(function(doc) {
            if (doc.exists) {
              const username = doc.data().Username
              const profilePic = doc.data().ProfilePic
              that.setState(prevState => ({
                friendsInfo: [...prevState.friendsInfo, {id: id, username: username, profilePic: profilePic}]
              }))
            } else {
              console.log("No such document!");
            }
          }).catch(function(error) {
            console.log("Error getting document:", error);
          });
        })
      });
    }


    renderItem = ({item, index}) => {
      var msg = `${data.sureMsg} ${item.username}?`
      return (
        <ListItem
        containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 25}}
        roundAvatar
        title={item.username}
        leftAvatar = {{source: {uri: item.profilePic}}}
        rightIcon = {<Icon
          name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
          size={30}
          color='#FFFFFF'
          onPress={() => Alert.alert(
            data.deleteFriend,
            msg,
            [
              {text: data.cancel, onPress: () => this.props.navigation.navigate('Friends')},
              {text: data.ok, onPress: () => this.deleteFriend(item)},
            ],
            { cancelable: false })}/>}
            />)
          }

          render() {
            return (
              <View style={styles.container}>
              <Text style={styles.friendLabel}>{data.friends}</Text>
              <View style= {styles.buttonContainer}>
              <TouchableOpacity
              style={styles.addFriendsContainer}
              onPress={() => this.props.navigation.navigate('AddFriend', { updateFriends: this.updateFriends.bind(this) })}
              underlayColor='#fff'>
              <Text style={styles.addFriendsText}>{data.addFriend} <Icon
              name={Platform.OS === "ios" ? "ios-person-add" : "md-add-person-add"}
              size={25}
              /></Text>
              </TouchableOpacity>
              </View>
              <View style={styles.myFriendsContainer}>
              <Text style={styles.myFriendsText}>{data.myFriends}</Text>
              </View>
              <FlatList
              data={this.state.friendsInfo}
              renderItem={this.renderItem}
              keyExtractor={this.extractKey}
              />
              </View>
            );
          }
        }

        const styles = StyleSheet.create({
          container: {
            flex: 1,
            paddingTop: 15,
            backgroundColor: '#FFFFFF',
          },
          buttonContainer:{
            alignItems:'center',
          },
          friendLabel: {
            fontSize: 40,
            color: '#000000',
            textAlign: 'center',
            fontFamily: "Roboto-Light",
            margin: 20,
          },
          addFriendsContainer: {
            justifyContent: 'center',
            width: 350,
            height: 70,
            margin: 0,
            padding: 10,
            backgroundColor:'#BA55B3',
            borderRadius:50,
            borderWidth: 1,
            borderColor: '#fff'
          },
          addFriendsText: {
            fontFamily: "Roboto-Light",
            color:'#fff',
            fontSize: 25,
            textAlign:'center',
            paddingLeft : 1,
            paddingRight : 1,
          },
          myFriendsContainer: {
            marginTop: 0,
            textAlign: 'center',
            alignItems: 'center',
          },
          myFriendsText: {
            fontFamily: "Roboto-Light",
            color: '#000000',
            fontSize: 20,
            margin:20
          },
          row: {
            fontFamily: "Roboto-Light",
            color: '#FFFFFF',
            padding: 15,
            marginBottom: 5,
            fontSize: 20,
            justifyContent: 'center',
          },
        });
