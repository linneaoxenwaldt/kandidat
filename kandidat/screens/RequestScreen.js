import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  FlatList,
  Text,
<<<<<<< HEAD
  Modal
=======
  ImageBackground
>>>>>>> 872145d67c418a9b32a0481cbc70431212767069
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import { ListItem } from 'react-native-elements';
import data from '../data/engWord.json';
import * as firebase from 'firebase';
import { SwipeListView } from 'react-native-swipe-list-view';

export default class OngoingVoteScreen extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    const rows = [
      // {id: '0', text: 'Request 0', voteReq: true},
      // {id: '1', text: 'Request1',  voteReq: true},
      // {id: '2', text: 'Request2',  voteReq: true},
      // {id: '3', text: 'Request3',  voteReq: true},
      // {id: '4', text: 'FriendRequest4',  friendReq: true},
      // {id: '5', text: 'FriendRequest5',  friendReq: true},
      // {id: '6', text: 'FriendRequest6',  friendReq: true},
      // {id: '7', text: 'FriendRequest7',  friendReq: true},
    ]
    this.extractKey1 = ({VoteID}) => VoteID
    this.extractKey2 = ({VoteID}) => VoteID
    this.state = {
      // rows: rows,
      friendReq: [],
<<<<<<< HEAD
      showMe: false,
=======
      voteReq: [],
>>>>>>> 872145d67c418a9b32a0481cbc70431212767069
    }
    this.getFriendReq()
    this.getVoteReq()
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

    voteRequests = ({item, index}) => {
        return (
          <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
          <ListItem
          containerStyle={{ backgroundColor: 'transparent'}}
        //  containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
          titleStyle={{color: '#FFFFFF', fontSize: 30}}
          title={item.CatName}
          roundAvatar
          rightAvatar= {{source: {uri: item.profilePic}}}
          rightTitle={data.sentFrom}
          rightSubtitle={item.username}
          />
          </ImageBackground>
          // <ListItem
          // containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
          // titleStyle={{color: '#FFFFFF', textAlign:'center', fontSize: 20,}}
          // title={item.text}/>
        )}

      friendRequests = ({item, index}) => {
        //if(item.friendReq == true ) {
        return (
          <ListItem
          containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
          titleStyle={{color: '#FFFFFF', textAlign:'center', fontSize: 20,}}
          title={item.username}
          leftAvatar = {{source: {uri: item.profilePic}}}
          rightIcon = {<Icon2
            onPress={() => this.acceptFriend(item)}
            name={'gesture-swipe-right'}
            size={30}/>}
            leftIcon = {<Icon2
              onPress={() => this.declineFriend(item)}
              name={'gesture-swipe-left'}
              size={30}/>}/>
            )}
            //}

            getFriendReq() {
              var that = this
              var user = firebase.auth().currentUser;
              var userID = user.uid;
              var db = firebase.firestore();
              db.collection("Users").doc(userID).collection("FriendRequests").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                  const id = doc.id;
                  var docRef = db.collection('Users').doc(id);
                  docRef.get().then(function(doc) {
                    if (doc.exists) {
                      const username = doc.data().Username
                      const profilePic = doc.data().ProfilePic
                      that.setState(prevState => ({
                        friendReq: [...prevState.friendReq, {id: id, username: username, profilePic: profilePic}]
                      }))
                      //console.log("Document data: 2");
                    } else {
                      // doc.data() will be undefined in this case
                      console.log("No such document!");
                    }
                  }).catch(function(error) {
                    console.log("Error getting document:", error);
                  });
                })
              });
<<<<<<< HEAD
            }
=======
        }

        acceptFriend(friendItem) {
          var that = this
          var user = firebase.auth().currentUser;
          var userID = user.uid;
          var db = firebase.firestore();
          db.collection("Users").doc(userID).collection("Friends").doc(friendItem.id).set({
          })
          db.collection("Users").doc(userID).collection("FriendRequests").doc(friendItem.id).delete().then(function() {
            console.log("FriendReq successfully deleted!" + friendItem.id);
          }).catch(function(error) {
            console.error("Error removing document: ", error);
          });
          this.setState(prevState => ({friendReq: prevState.friendReq.filter(item => item !== friendItem) }));

          db.collection("Users").doc(friendItem.id).collection("Friends").doc(userID).set({
          })
          db.collection("Users").doc(friendItem.id).collection("PendingFriendRequests").doc(userID).delete().then(function() {
            console.log("FriendReq successfully deleted!" + friendItem.id);
          }).catch(function(error) {
            console.error("Error removing document: ", error);
          });
        }

        declineFriend(friendItem) {
          var that = this
          var user = firebase.auth().currentUser;
          var userID = user.uid;
          var db = firebase.firestore();
          db.collection("Users").doc(userID).collection("FriendRequests").doc(friendItem.id).delete().then(function() {
            console.log("FriendReq successfully deleted!" + friendItem.id);
          }).catch(function(error) {
            console.error("Error removing document: ", error);
          });
          this.setState(prevState => ({friendReq: prevState.friendReq.filter(item => item !== friendItem) }));

          db.collection("Users").doc(friendItem.id).collection("PendingFriendRequests").doc(userID).delete().then(function() {
            console.log("FriendReq successfully deleted!" + friendItem.id);
          }).catch(function(error) {
            console.error("Error removing document: ", error);
          });
        }

        getVoteReq() {
          var that = this
          var user = firebase.auth().currentUser;
          var userID = user.uid;
          var db = firebase.firestore();
          db.collection("Users").doc(userID).collection("VoteRequests").get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                  var voteID = doc.id;
                  var sentFromID = doc.get("SentFrom")
                  var docRef = db.collection('Users').doc(sentFromID);

                  docRef.get().then(function(doc) {
                    if (doc.exists) {
                      const username = doc.data().Username
                      const profilePic = doc.data().ProfilePic

                      var docRef2 = db.collection('Users').doc(sentFromID).collection("PendingVotes").doc(voteID);
                      docRef2.get().then(function(doc) {
                        if (doc.exists) {
                          const catName = doc.get('CatName');
                          const catImg = doc.get('CatImg');
                      that.setState(prevState => ({
                        voteReq: [...prevState.voteReq, {VoteID: voteID, username: username, profilePic: profilePic, CatName: catName, CatImg: catImg}]
                      }))
                  }})
              }});
        });
      });
    }

        render() {
          return (
            <View style={styles.container}>
            <Text style={styles.requestLabel}> {data.requests} </Text>

            <View style={styles.voteReq}>
            <Text style={styles.textLabel}> Votes </Text>
            <View style={styles.miniTextview}>
            <Text> <Icon2
              name={'gesture-swipe-left'}
              size={30}/>  Decline  </Text>
            <Text> Accept <Icon2
              name={'gesture-swipe-right'}
              size={30}/></Text>
            </View>
            <FlatList
            data={this.state.voteReq}
            renderItem={this.voteRequests}
            keyExtractor={this.extractKey2}
            />
            </View>


            <View style={styles.friendReq}>
            <Text style={styles.textLabel}> Friends </Text>
            <View style={styles.miniTextview}>
            <Text> <Icon2
              name={'gesture-swipe-left'}
              size={30}/>  Decline  </Text>
            <Text> Accept <Icon2
              name={'gesture-swipe-right'}
              size={30}/></Text>
            </View>
            <FlatList
            data={this.state.friendReq}
            renderItem={this.friendRequests}
            keyExtractor={this.extractKey1}
            />
            </View>
            </View>
          );
        }
      }
>>>>>>> 872145d67c418a9b32a0481cbc70431212767069

            acceptFriend(friendItem) {
              var that = this
              var user = firebase.auth().currentUser;
              var userID = user.uid;
              var db = firebase.firestore();
              db.collection("Users").doc(userID).collection("Friends").doc(friendItem.id).set({
              })
              db.collection("Users").doc(userID).collection("FriendRequests").doc(friendItem.id).delete().then(function() {
                console.log("FriendReq successfully deleted!" + friendItem.id);
              }).catch(function(error) {
                console.error("Error removing document: ", error);
              });
              this.setState(prevState => ({friendReq: prevState.friendReq.filter(item => item !== friendItem) }));

              db.collection("Users").doc(friendItem.id).collection("Friends").doc(userID).set({
              })
              db.collection("Users").doc(friendItem.id).collection("PendingFriendRequests").doc(userID).delete().then(function() {
                console.log("FriendReq successfully deleted!" + friendItem.id);
              }).catch(function(error) {
                console.error("Error removing document: ", error);
              });
            }

            declineFriend(friendItem) {
              var that = this
              var user = firebase.auth().currentUser;
              var userID = user.uid;
              var db = firebase.firestore();
              db.collection("Users").doc(userID).collection("FriendRequests").doc(friendItem.id).delete().then(function() {
                console.log("FriendReq successfully deleted!" + friendItem.id);
              }).catch(function(error) {
                console.error("Error removing document: ", error);
              });
              this.setState(prevState => ({friendReq: prevState.friendReq.filter(item => item !== friendItem) }));

              db.collection("Users").doc(friendItem.id).collection("PendingFriendRequests").doc(userID).delete().then(function() {
                console.log("FriendReq successfully deleted!" + friendItem.id);
              }).catch(function(error) {
                console.error("Error removing document: ", error);
              });
            }

            render() {
              return (
                <View style={styles.container}>
                <Text style={styles.requestLabel}> {data.requests} </Text>

                <View style={styles.voteReq}>
                <Text style={styles.textLabel}> Votes </Text>

                <Modal visible={this.state.showMe}>
                <View style={styles.modalView}>
                <Text style={styles.modalText}> Hej hej hej </Text>

                <Text style={styles.textLabel}> You are invited by: </Text>
                <Text style={styles.miniTextview}> Participants: </Text>

                <FlatList
                data={this.state.rows}
                renderItem={this.voteRequests}
                keyExtractor={this.extractKey}
                />

                <View style={styles.buttonBottomContainer}>
                <TouchableOpacity
                style={styles.declineButt}
                onPress={() => this.props.navigation.navigate('RequestScreen')}              >
                <Text> DECLINE </Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={() => this.props.navigation.navigate('RequestScreen')}
                style={styles.acceptButt}>
                <Text> ACCEPT </Text>
                </TouchableOpacity>
                </View>





                <TouchableOpacity style={styles.closeContainer}onPress={()=>{
                  this.setState({
                    showMe: false
                  })}}>


                  <Text style={styles.closeText}> Close Window </Text>
                  </TouchableOpacity>

                  </View>
                  </Modal>





                    <View style={styles.miniTextview}>
                    <Text> <Icon2
                    name={'gesture-swipe-left'}
                    size={30}/>  Decline  </Text>
                    <Text> Accept <Icon2
                    name={'gesture-swipe-right'}
                    size={30}/></Text>
                    </View>

                    <View>
                    <TouchableOpacity
                    onPress={()=>{
                      this.setState({
                        showMe: true
                      })}}>
                    <FlatList
                    data={this.state.rows}
                    renderItem={this.voteRequests}
                    keyExtractor={this.extractKey}
                    />

                    </TouchableOpacity>
                    </View>
                    </View>


                    <View style={styles.friendReq}>
                    <Text style={styles.textLabel}> Friends </Text>
                    <View style={styles.miniTextview}>
                    <Text> <Icon2
                    name={'gesture-swipe-left'}
                    size={30}/>  Decline  </Text>
                    <Text> Accept <Icon2
                    name={'gesture-swipe-right'}
                    size={30}/></Text>
                    </View>
                    <FlatList
                    data={this.state.friendReq}
                    renderItem={this.friendRequests}
                    keyExtractor={this.extractKey}
                    />
                    </View>
                    </View>
                  );
                }
              }

              const styles = StyleSheet.create({
                container: {
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                },
                requestLabel: {
                  fontSize: 40,
                  color: '#000000',
                  textAlign: 'center',
                  fontFamily: "Roboto-Light",
                  marginTop: 15,
                },
                textLabel: {
                  marginTop: 10,
                  fontSize: 30,
                  color: '#000000',
                  textAlign: 'center',
                  fontFamily: "Roboto-Light",
                },
                miniTextview: {
                  marginLeft: 10,
                  width: 340,
                  flexDirection:'row',
                  justifyContent: 'space-between',
                  color: '#000000',
                  fontFamily: "Roboto-Light",
                },
                voteReq: {
                  height: 260,
                },
                friendReq: {
                  height: 260,
                },
                arrowBack: {
                  marginLeft: 10,
                  flexDirection:'row',
                  justifyContent: 'space-between',
                },
                modalView:{
                  flex: 1,
                  width: '100%',
                  marginTop: 10,
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                },
                modalText: {
                  paddingTop: 50,
                  fontFamily: 'Roboto-Light',
                  fontSize: 25,
                  paddingBottom: 10,
                },
                closeText: {
                  marginBottom: 10,
                  marginTop: 10,
                  alignItems: 'center',
                  fontSize: 15,
                  color: 'white',
                  justifyContent:'center',

                },

                closeContainer: {
                  marginBottom: 30,
                  marginTop: 10,
                  backgroundColor: '#CBA3D5',
                  alignItems: 'center',
                  borderRadius: 20,
                  width:150,
                  height: 50,
                  alignItems:'center',
                  justifyContent:'center',
                },
                declineButt: {
                  height: 50,
                  width: 150,
                  color: '#000',
                  backgroundColor: '#FF0000',
                },
                acceptButt: {
                  height: 50,
                  width: 150,
                  color: '#000',
                  backgroundColor: '#008000',
                },

                buttonBottomContainer: {
                  flexDirection:'row',
                  justifyContent: 'space-between',
                  width: 340,
                  marginTop: 50,

                },
              });
