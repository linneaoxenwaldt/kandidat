import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  FlatList,
  Text,
  Modal,
  ImageBackground,
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
    this.extractKey2 = ({id}) => id
    this.extractKey3 = ({ParticipantID, VoteID}) => ParticipantID+VoteID
    this.state = {
      // rows: rows,
      friendReq: [],
      showMe: false,
      voteReq: [],
      participants: [],
      alternatives: [],
      currentVote: [],
      answers: [],
      otherParticipants: [],
    }
    this.getFriendReq()
    this.getVoteReq()
    this.getParticipants()
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
          <TouchableOpacity
          onPress={()=>{
            this.setState({
              showMe: true,
              currentVote: item,
              //participants: item.participants
            })}}>
          <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
          <ListItem
          containerStyle={{ backgroundColor: 'transparent'}}
        //  containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
          titleStyle={{color: '#FFFFFF', fontSize: 30}}
          title={item.CatName}
          roundAvatar
          rightAvatar= {{source: {uri: item.sentFromProfilePic}}}
          rightTitle={data.sentFrom}
          rightSubtitle={item.sentFromUsername}
          />
          </ImageBackground>
          </TouchableOpacity>

        )}

        showRequest = ({item, index}) => {
        if(this.state.currentVote.VoteID === item.VoteID) {
          // var user = firebase.auth().currentUser;
          // var userID = user.uid;
          // if(item.participantID !== userID) {
          // this.setState(prevState => ({
          //   otherParticipants: [...prevState.otherParticipants, {VoteID: item.VoteID, ParticipantID: item.participantID, username: item.username, profilePic: item.profilePic}]
          // }))
          // }
            return (
              <ListItem
            containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
              titleStyle={{color: '#FFFFFF', fontSize: 30}}
              title={item.username}
              roundAvatar
              leftAvatar= {{source: {uri: item.profilePic}}}
              />
            )}}

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
                      console.log("getFriendReq: No such document!");
                    }
                  }).catch(function(error) {
                    console.log("getFriendReq: Error getting document:", error);
                  });
                })
              });
            }

        acceptFriend(friendItem) {
          var that = this
          var user = firebase.auth().currentUser;
          var userID = user.uid;
          var db = firebase.firestore();
          db.collection("Users").doc(userID).collection("Friends").doc(friendItem.id).set({
          })
          db.collection("Users").doc(userID).collection("FriendRequests").doc(friendItem.id).delete().then(function() {
            console.log("acceptFriend: successfully deleted!" + friendItem.id);
          }).catch(function(error) {
            console.error("acceptFriend: Error removing document: ", error);
          });
          this.setState(prevState => ({friendReq: prevState.friendReq.filter(item => item !== friendItem) }));

          db.collection("Users").doc(friendItem.id).collection("Friends").doc(userID).set({
          })
          db.collection("Users").doc(friendItem.id).collection("PendingFriendRequests").doc(userID).delete().then(function() {
            console.log("acceptFriend: FriendReq successfully deleted!" + friendItem.id);
          }).catch(function(error) {
            console.error("acceptFriend: Error removing document: ", error);
          });
        }

        declineFriend(friendItem) {
          var that = this
          var user = firebase.auth().currentUser;
          var userID = user.uid;
          var db = firebase.firestore();
          db.collection("Users").doc(userID).collection("FriendRequests").doc(friendItem.id).delete().then(function() {
            console.log("declineFriend: FriendReq successfully deleted!" + friendItem.id);
          }).catch(function(error) {
            console.error("declineFriend: Error removing document: ", error);
          });
          this.setState(prevState => ({friendReq: prevState.friendReq.filter(item => item !== friendItem) }));

          db.collection("Users").doc(friendItem.id).collection("PendingFriendRequests").doc(userID).delete().then(function() {
            console.log("declineFriend: FriendReq successfully deleted!" + friendItem.id);
          }).catch(function(error) {
            console.error("declineFriend: Error removing document: ", error);
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
                //  that.getParticipants(userID, voteID)
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
                        voteReq: [...prevState.voteReq, {VoteID: voteID, sentFromID: sentFromID, sentFromUsername: username, sentFromProfilePic: profilePic, CatName: catName, CatImg: catImg}]
                      }))
                  }})
              }});
        });
      });
    }

    getParticipants() {
      var localID = 0
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var that = this
      var db = firebase.firestore();
      db.collection("Users").doc(userID).collection("VoteRequests").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var voteID = doc.id;
      db.collection("Users").doc(userID).collection("VoteRequests").doc(voteID).collection('Participants').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var partcipantID = doc.id;
            db.collection('Users').doc(partcipantID).get().then(function(doc){
              if(doc.exists) {
                const username = doc.data().Username
                const profilePic = doc.data().ProfilePic
                String(localID)
                //console.log(localID)
                that.setState(prevState => ({
                  participants: [...prevState.participants, {LocalID: localID, VoteID: voteID, ParticipantID: partcipantID, username: username, profilePic: profilePic}]
                }))
                localID = Number(localID)
                localID++
              //  console.log(that.state.participants)
              }
            })
          })})})})
    }

    acceptVote() {
      var that = this
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      var vote = this.state.currentVote
      this.setUpPendingVote()
      //this.getAnswers()
      //this.checkAnswers()
      //this.deleteVoteReq()
    }

    setUpPendingVote(){
      var that = this
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      var vote = this.state.currentVote
      db.collection("Users").doc(userID).collection("PendingVotes").doc(vote.VoteID).set({
        CatName: vote.CatName,
        CatImg: vote.CatImg,
      })
      db.collection("Users").doc(vote.sentFromID).collection("PendingVotes").doc(vote.VoteID).collection('Alternatives').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              const name = doc.get('Name');
              const votes = doc.get('Votes')
              db.collection("Users").doc(userID).collection("PendingVotes").doc(vote.VoteID).collection('Alternatives').doc(doc.id).set({
                Name: name,
                Votes: votes,
              })
              that.setState(prevState => ({
                alternatives: [...prevState.alternatives, {id: doc.id, text: name, votes: votes}]
              }))
          });
      });
      db.collection("Users").doc(vote.sentFromID).collection("PendingVotes").doc(vote.VoteID).collection('Participants').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              const answer = doc.get('Answer');
              db.collection("Users").doc(userID).collection("PendingVotes").doc(vote.VoteID).collection('Participants').doc(doc.id).set({
                Answer: answer,
              })
          });
      });
      this.giveAcceptAnswer()
    }

giveAcceptAnswer() {
  var that = this
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var vote = this.state.currentVote
  db.collection("Users").doc(userID).collection("PendingVotes").doc(vote.VoteID).collection('Participants').doc(userID).set({
    Answer: "Yes",
  })
  db.collection("Users").doc(vote.sentFromID).collection("PendingVotes").doc(vote.VoteID).collection('Participants').doc(userID).update({
    Answer: "Yes",
  })
  console.log("längd " + this.state.otherParticipants.length)
  for(let i=0; i < this.state.otherParticipants.length; i++){
    var participantID = this.state.otherParticipants[i].ParticipantID
      var docRef = db.collection('Users').doc(participantID).collection('PendingVotes').doc(vote.VoteID).collection('Participants').doc(userID);
      var getDoc = docRef.get()
          .then(doc => {
              if (!doc.exists) {
                  db.collection('Users').doc(participantID).collection('VoteRequests').doc(vote.VoteID).collection('Participants').doc(userID).update({
                    Answer: "Yes",
                  })
                  //console.log("sagt ja till Test")
              } else {
                docRef.update({
                  Answer: "Yes",
                })
                  console.log('Document data:', doc.data());
              }
          })
          .catch(err => {
              console.log('Error getting document', err);
          });
}
this.deleteVoteReq()
}

deleteVoteReq() {
  var that = this
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var vote = this.state.currentVote

  db.collection("Users").doc(userID).collection("VoteRequests").doc(vote.VoteID).collection('Participants').get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          const id = doc.id
          db.collection("Users").doc(userID).collection("VoteRequests").doc(vote.VoteID).collection('Participants').doc(id).delete().then(function() {
            console.log("deleteVoteReq - participants: Alt successfully deleted!" + id);
          }).catch(function(error) {
            console.error("deleteVoteReq - participants: Alt Error removing document: ", error);
          });
      });
  });

db.collection("Users").doc(userID).collection("VoteRequests").doc(vote.VoteID).delete().then(function() {
  console.log("deleteVoteReq - voteReq: Req successfully deleted!" + vote.VoteID);
}).catch(function(error) {
  console.error("deleteVoteReq - voteReq: Error removing document: ", error);
});

this.setState(prevState => ({voteReq: prevState.voteReq.filter(item => item !== vote) }));
this.setState({
  showMe: false
})
console.log(this.state.otherParticipants)
this.props.navigation.navigate('AddAlternative', {vote: this.state.currentVote, participants: this.state.otherParticipants})
}

declineVote() {
  var that = this
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var vote = this.state.currentVote

  db.collection("Users").doc(userID).collection("VoteRequests").doc(vote.VoteID).delete().then(function() {
    console.log("declineVote: FriendReq successfully deleted!" + vote.VoteID);
  }).catch(function(error) {
    console.error("declineVote: Error removing document: ", error);
  });
  this.setState(prevState => ({voteReq: prevState.voteReq.filter(item => item !== vote) }));

  db.collection("Users").doc(vote.sentFromID).collection("PendingVotes").doc(vote.VoteID).collection('Alternatives').get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          const id = doc.id
          db.collection("Users").doc(vote.sentFromID).collection("PendingVotes").doc(vote.VoteID).collection('Alternatives').doc(id).delete().then(function() {
            console.log("declineVote: Alt successfully deleted!" + id);
          }).catch(function(error) {
            console.error("declineVote: Alt Error removing document: ", error);
          });
      });
  });
  db.collection("Users").doc(vote.sentFromID).collection("PendingVotes").doc(vote.VoteID).delete().then(function() {
    console.log("declineVote - pendingVote: FriendReq successfully deleted!" + vote.VoteID);
  }).catch(function(error) {
    console.error("declineVote - pendingVote: Error removing document: ", error);
  });
  this.setState({
    showMe: false
  })
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
<Image style={{width: 50, height: 50}}
source={{uri: this.state.currentVote.sentFromProfilePic}}/>
<Text style={styles.modalText}>{this.state.currentVote.sentFromUsername}</Text>

                <Text style={styles.miniTextview}> Participants: </Text>
<View style={styles.modalList}>
                <FlatList
                data={this.state.participants}
                extraData={this.state}
                renderItem={this.showRequest}
                keyExtractor={this.extractKey3}
                />
                </View>

                <View style={styles.buttonBottomContainer}>
                <TouchableOpacity
                style={styles.declineButt}
                onPress={() => this.declineVote()}>
                <Text> DECLINE </Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={() => this.acceptVote()}
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
                    <FlatList
                    extraData={this.state}
                    data={this.state.voteReq}
                    renderItem={this.voteRequests}
                    keyExtractor={this.extractKey1}
                    />
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
                    extraData={this.state}
                    data={this.state.friendReq}
                    renderItem={this.friendRequests}
                    keyExtractor={this.extractKey2}
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
                modalList: {
                  width: '100%'
                }
              });

              //   render() {
              //     return (
              //       <View style={styles.container}>
              //       <Text style={styles.requestLabel}> {data.requests} </Text>
              //
              //       <View style={styles.voteReq}>
              //       <Text style={styles.textLabel}> Votes </Text>
              //       <View style={styles.miniTextview}>
              //       <Text> <Icon2
              //         name={'gesture-swipe-left'}
              //         size={30}/>  Decline  </Text>
              //       <Text> Accept <Icon2
              //         name={'gesture-swipe-right'}
              //         size={30}/></Text>
              //       </View>
              //       <FlatList
              //       data={this.state.voteReq}
              //       renderItem={this.voteRequests}
              //       keyExtractor={this.extractKey2}
              //       />
              //       </View>
              //
              //
              //       <View style={styles.friendReq}>
              //       <Text style={styles.textLabel}> Friends </Text>
              //       <View style={styles.miniTextview}>
              //       <Text> <Icon2
              //         name={'gesture-swipe-left'}
              //         size={30}/>  Decline  </Text>
              //       <Text> Accept <Icon2
              //         name={'gesture-swipe-right'}
              //         size={30}/></Text>
              //       </View>
              //       <FlatList
              //       data={this.state.friendReq}
              //       renderItem={this.friendRequests}
              //       keyExtractor={this.extractKey1}
              //       />
              //       </View>
              //       </View>
              //     );
              //   }
              // }
