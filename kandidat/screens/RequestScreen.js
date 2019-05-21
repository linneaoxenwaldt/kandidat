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

export default class RequestScreen extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    this.extractKey1 = ({VoteID}) => VoteID
    this.extractKey2 = ({id}) => id
    this.extractKey3 = ({ParticipantID, VoteID}) => ParticipantID+VoteID
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    this.userID = this.user.uid;
    this.state = {
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
          })}}>
          <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
          <ListItem
          containerStyle={{ backgroundColor: 'transparent'}}
          titleStyle={{color: '#FFFFFF', fontSize: 30}}
          title={item.CatName}
          roundAvatar
          />
          </ImageBackground>
          </TouchableOpacity>
        )}

        showRequest = ({item, index}) => {
          if(this.state.currentVote.VoteID === item.VoteID) {
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
              return (
                <ListItem
                containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
                titleStyle={{color: '#FFFFFF', textAlign:'left', fontSize: 20,}}
                title={item.username}
                leftAvatar = {{source: {uri: item.profilePic}}}
                rightSubtitle={
                  <View style = {styles.friendReqButton}>
                  <Icon
                  onPress={() => this.declineFriend(item)}
                  name={Platform.OS === "ios" ? "ios-close-circle-outline": "md-close-circle-outline"}
                  color={'#fff'}
                  size={40}/>
                  <Icon
                  onPress={() => this.acceptFriend(item)}
                  name={Platform.OS === "ios" ? "ios-checkmark-circle-outline": "md-checkmark-circle-outline"}
                  color={'#fff'}
                  size={40}/>
                  </View>}
                  />
                )}

                getFriendReq() {
                  var that = this
                  this.db.collection("Users").doc(this.userID).collection("FriendRequests").onSnapshot(function(querySnapshot) {
                    that.setState({friendReq: []})
                    querySnapshot.forEach(function(doc) {
                      const id = doc.id;
                      var docRef = that.db.collection('Users').doc(id);
                      docRef.get().then(function(doc) {
                        if (doc.exists) {
                          const username = doc.data().Username
                          const profilePic = doc.data().ProfilePic
                          that.setState(prevState => ({
                            friendReq: [...prevState.friendReq, {id: id, username: username, profilePic: profilePic}],
                          }))
                        }else {
                          console.log("getFriendReq: No such document!");
                        }
                      }).catch(function(error) {
                        console.log("getFriendReq: Error getting document:", error);
                      });
                    }  );
                  });
                }

                acceptFriend(friendItem) {
                  this.db.collection("Users").doc(this.userID).collection("Friends").doc(friendItem.id).set({
                  })
                  this.db.collection("Users").doc(this.userID).collection("FriendRequests").doc(friendItem.id).delete().then(function() {
                  }).catch(function(error) {
                    console.error("acceptFriend: Error removing document: ", error);
                  });
                  this.setState(prevState => ({friendReq: prevState.friendReq.filter(item => item !== friendItem) }));

                  this.db.collection("Users").doc(friendItem.id).collection("Friends").doc(this.userID).set({
                  })
                  this.db.collection("Users").doc(friendItem.id).collection("PendingFriendRequests").doc(this.userID).delete().then(function() {
                  }).catch(function(error) {
                    console.error("acceptFriend: Error removing document: ", error);
                  });
                }

                declineFriend(friendItem) {
                  this.db.collection("Users").doc(this.userID).collection("FriendRequests").doc(friendItem.id).delete().then(function() {
                  }).catch(function(error) {
                  });
                  this.setState(prevState => ({friendReq: prevState.friendReq.filter(item => item !== friendItem) }));

                  this.db.collection("Users").doc(friendItem.id).collection("PendingFriendRequests").doc(this.userID).delete().then(function() {
                  }).catch(function(error) {
                    console.error("declineFriend: Error removing document: ", error);
                  });
                }

                getVoteReq() {
                  var that = this
                  var docRef = this.db.collection("Users").doc(this.userID).collection("VoteRequests")
                  docRef.onSnapshot(function(querySnapshot) {
                    that.setState({ voteReq: [] })
                    querySnapshot.forEach(function(doc) {
                      var voteID = doc.id;
                      docRef.doc(voteID).collection('Participants').get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                          var participantID = doc.id;
                          if(participantID !== that.userID) {
                            that.setState(prevState => ({
                              otherParticipants: [...prevState.otherParticipants, {VoteID: voteID, ParticipantID: participantID}]
                            }))
                          }})})
                          var sentFromID = doc.get("SentFrom")
                          var docRef2 = that.db.collection('Users').doc(sentFromID);
                          docRef2.get().then(function(doc) {
                            if (doc.exists) {
                              const username = doc.data().Username
                              const profilePic = doc.data().ProfilePic

                              var docRef2 = that.db.collection('Users').doc(sentFromID).collection("PendingVotes").doc(voteID);
                              docRef2.get().then(function(doc) {
                                if (doc.exists) {
                                  const catName = doc.get('CatName');
                                  const catImg = doc.get('CatImg');
                                  const msg = doc.get('Msg');
                                  that.setState(prevState => ({
                                    voteReq: [...prevState.voteReq, {VoteID: voteID, sentFromID: sentFromID, sentFromUsername: username, sentFromProfilePic: profilePic, CatName: catName, CatImg: catImg, Msg: msg}]
                                  }))
                                }})
                              }});
                            });
                          });
                        }

  getParticipants() {
    var localID = 0
    var that = this
    this.db.collection("Users").doc(this.userID).collection("VoteRequests").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var voteID = doc.id;
        that.db.collection("Users").doc(that.userID).collection("VoteRequests").doc(voteID).collection('Participants').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var partcipantID = doc.id;
            that.db.collection('Users').doc(partcipantID).get().then(function(doc){
              if(doc.exists) {
                const username = doc.data().Username
                const profilePic = doc.data().ProfilePic
                String(localID)
                that.setState(prevState => ({
                  participants: [...prevState.participants, {LocalID: localID, VoteID: voteID, ParticipantID: partcipantID, username: username, profilePic: profilePic}]
                }))
                localID = Number(localID)
                localID++
              }
            })
          })})})})
        }

        // acceptVote() {
        //   var that = this
        //   var user = firebase.auth().currentUser;
        //   var userID = user.uid;
        //   var db = firebase.firestore();
        //   var vote = this.state.currentVote
        //   var user = firebase.auth().currentUser;
        //   var userID = user.uid;
        //   this.setUpPendingVote()
        // }

        setUpPendingVote(){
          var that = this
          var vote = this.state.currentVote
          this.db.collection("Users").doc(this.userID).collection("PendingVotes").doc(vote.VoteID).set({
            CatName: vote.CatName,
            CatImg: vote.CatImg,
          })
          this.db.collection("Users").doc(vote.sentFromID).collection("PendingVotes").doc(vote.VoteID).collection('Alternatives').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              const name = doc.get('Name');
              const votes = doc.get('Votes')
              that.db.collection("Users").doc(that.userID).collection("PendingVotes").doc(vote.VoteID).collection('Alternatives').doc(doc.id).set({
                Name: name,
                Votes: votes,
              })
              that.setState(prevState => ({
                alternatives: [...prevState.alternatives, {id: doc.id, text: name, votes: votes}]
              }))
            });
          });
          this.db.collection("Users").doc(vote.sentFromID).collection("PendingVotes").doc(vote.VoteID).collection('Participants').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              const answer = doc.get('Answer');
              that.db.collection("Users").doc(that.userID).collection("PendingVotes").doc(vote.VoteID).collection('Participants').doc(doc.id).set({
                Answer: answer,
              })
            });
          });
          this.giveAcceptAnswer()
        }

        giveAcceptAnswer() {
          var that = this
          var vote = this.state.currentVote
          this.db.collection("Users").doc(this.userID).collection("PendingVotes").doc(vote.VoteID).collection('Participants').doc(this.userID).set({
            Answer: "Yes",
          })
          this.db.collection("Users").doc(vote.sentFromID).collection("PendingVotes").doc(vote.VoteID).collection('Participants').doc(this.userID).update({
            Answer: "Yes",
          })
          for(let i=0; i < this.state.otherParticipants.length; i++){
            if(this.state.otherParticipants[i].VoteID === vote.VoteID) {
              var participantID = this.state.otherParticipants[i].ParticipantID
              var docRef = this.db.collection('Users').doc(participantID).collection('PendingVotes').doc(vote.VoteID).collection('Participants').doc(this.userID);
              var getDoc = docRef.get()
              .then(doc => {
                if (!doc.exists) {
                  that.db.collection('Users').doc(participantID).collection('VoteRequests').doc(vote.VoteID).collection('Participants').doc(that.userID).update({
                    Answer: "Yes",
                  })
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
            }}
            this.deleteVoteReq()
          }

          deleteVoteReq() {
            var that = this
            var vote = this.state.currentVote
            this.db.collection("Users").doc(this.userID).collection("VoteRequests").doc(vote.VoteID).collection('Participants').get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                const id = doc.id
                that.db.collection("Users").doc(that.userID).collection("VoteRequests").doc(vote.VoteID).collection('Participants').doc(id).delete().then(function() {
                }).catch(function(error) {
                  console.error("deleteVoteReq - participants: Alt Error removing document: ", error);
                });
              });
            });

            this.db.collection("Users").doc(this.userID).collection("VoteRequests").doc(vote.VoteID).delete().then(function() {
            }).catch(function(error) {
              console.error("deleteVoteReq - voteReq: Error removing document: ", error);
            });

            this.setState(prevState => ({voteReq: prevState.voteReq.filter(item => item !== vote) }));
            this.setState({
              showMe: false
            })
            this.props.navigation.navigate('AddAlternative', {vote: this.state.currentVote, participants: this.state.otherParticipants})
          }

          declineVote() {
            var that = this
            var vote = this.state.currentVote
            var docRef = this.db.collection("Users").doc(this.userID).collection("VoteRequests").doc(vote.VoteID)
            docRef.collection('Participants').get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                const id = doc.id
                docRef.collection('Participants').doc(id).delete().then(function() {
                }).catch(function(error) {
                  console.error("declineVote - Part: Alt Error removing document: ", error);
                });
              });
            });
            docRef.delete().then(function() {
            }).catch(function(error) {
              console.error("declineVote: Error removing document: ", error);
            });
            this.setState(prevState => ({voteReq: prevState.voteReq.filter(item => item !== vote) }));
            this.declineVoteCreator()
          }

          declineVoteCreator() {
            var that = this
            var vote = this.state.currentVote
            var docRef = this.db.collection("Users").doc(vote.sentFromID).collection("PendingVotes").doc(vote.VoteID)
            docRef.collection('Alternatives').get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                const id = doc.id
                docRef.collection('Alternatives').doc(id).delete().then(function() {
                }).catch(function(error) {
                  console.error("declineVote: Alt Error removing document: ", error);
                });
              });
            });
            docRef.collection('Participants').get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                const id = doc.id
                docRef.collection('Participants').doc(id).delete().then(function() {
                }).catch(function(error) {
                  console.error("declineVote - Part: Alt Error removing document: ", error);
                });
              });
            });
            docRef.delete().then(function() {
            }).catch(function(error) {
              console.error("declineVote - pendingVote: Error removing document: ", error);
            });
            this.declineVoteParticipants()
          }

          declineVoteParticipants() {
            var that = this
            var vote = this.state.currentVote
            for(let i=0; i < this.state.otherParticipants.length; i++){
              if(this.state.otherParticipants[i].VoteID === vote.VoteID) {
                var participantID = this.state.otherParticipants[i].ParticipantID
                var docRef = this.db.collection('Users').doc(participantID).collection('PendingVotes').doc(vote.VoteID);
                var docRef2 = this.db.collection("Users").doc(participantID).collection("VoteRequests").doc(vote.VoteID)
                var getDoc = docRef.get()
                .then(doc => {
                  if (!doc.exists) {
                    docRef2.collection('Participants').get().then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                        const id = doc.id
                        docRef2.collection('Participants').doc(id).delete().then(function() {
                        }).catch(function(error) {
                          console.error("declineVote - Part: Alt Error removing document: ", error);
                        });
                      });
                    });
                    docRef2.delete().then(function() {
                    }).catch(function(error) {
                      console.error("declineVote: Error removing document: ", error);
                    });
                  } else {
                    docRef.collection('Alternatives').get().then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                        const id = doc.id
                        docRef.collection('Alternatives').doc(id).delete().then(function() {
                        }).catch(function(error) {
                          console.error("declineVote: Alt Error removing document: ", error);
                        });
                      });
                    });
                    docRef.collection('Participants').get().then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                        const id = doc.id
                        docRef.collection('Participants').doc(id).delete().then(function() {
                        }).catch(function(error) {
                          console.error("declineVote - Part: Alt Error removing document: ", error);
                        });
                      });
                    });
                    docRef.delete().then(function() {
                    }).catch(function(error) {
                      console.error("declineVote - pendingVote: Error removing document: ", error);
                    });
                  }
                })
                .catch(err => {
                  console.log('Error getting document', err);
                });
              }}
              this.setState({
                showMe: false
              })
            }


            render() {
              return (
                <View style={styles.container}>
                <Text style={styles.requestLabel}> {data.requests.toUpperCase()} </Text>
                <View style={styles.requestHeight}>
                <Text style={styles.textLabel}>{data.votes}</Text>
                <View
                style={{
                  borderBottomColor: '#94B4C1',
                  borderBottomWidth: 3 }}
                  />
                  <View style = {styles.container}>
                  <FlatList
                  extraData={this.state}
                  data={this.state.voteReq}
                  renderItem={this.voteRequests}
                  keyExtractor={this.extractKey1}
                  />
                  </View>

                  <Modal visible={this.state.showMe}
                  onRequestClose = {() => {this.setState({ showMe : false })}}>
                  <View style={styles.modalView}>
                  <Text style={styles.modalText}> {this.state.currentVote.CatName}</Text>

                  <View style={styles.invitedContainer}>
                  <Text style={styles.textLabel}> {data.invited} </Text>
                  <Image style={styles.profilePicContainer}
                  source={{uri: this.state.currentVote.sentFromProfilePic}}/>
                  <Text style={styles.invitedByText}>{this.state.currentVote.sentFromUsername}</Text>
                  </View>
                  <Text style={styles.miniTextview}> {data.description}: </Text>

                  <View style={styles.message}>
                  <ScrollView>
                  <Text style={styles.messageText}> {this.state.currentVote.Msg} </Text>
                  </ScrollView>
                  </View>

                  <Text style={styles.miniTextview}> {data.participants} </Text>
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
                  <Text style={styles.closeText}> {data.decline} </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                  onPress={() => this.setUpPendingVote()}
                  style={styles.acceptButt}>
                  <Text style={styles.closeText}>{data.accept} </Text>
                  </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.closeContainer}onPress={()=>{
                    this.setState({
                      showMe: false
                    })}}>

                    <Text style={styles.closeText}> {data.closeWindow} </Text>
                    </TouchableOpacity>

                    </View>
                    </Modal>
                    </View>

                    <View style={styles.requestHeight}>
                    <Text style={styles.textLabel}> {data.friends} </Text>
                    <View
                    style={{
                      borderBottomColor: '#94B4C1',
                      borderBottomWidth: 3 }}
                      />

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
                    fontSize: 25,
                    color: '#000000',
                    textAlign: 'center',
                    fontFamily: "Roboto-Light",
                    margin: 10,
                  },
                  miniTextview: {
                    marginLeft: 5,
                    width: 340,
                    flexDirection:'row',
                    justifyContent: 'space-between',
                    color: '#000000',
                    fontFamily: "Roboto-Light",
                    fontSize: 20
                  },
                  requestHeight: {
                    height: 260,
                    paddingBottom: 5,
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
                    fontSize: 40,
                    paddingBottom: 0,
                  },
                  invitedByText: {
                    fontFamily: 'Roboto-Light',
                    fontSize: 20,

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
                    marginBottom: 10,
                    backgroundColor: '#6BCDFD',
                    alignItems: 'center',
                    borderRadius: 20,
                    width:120,
                    height: 50,
                    alignItems:'center',
                    justifyContent:'center',
                    fontSize: 10,
                    shadowColor: 'grey',
                    shadowOpacity: 2,
                    shadowRadius: 2,
                    shadowOffset: {width: 0,height: 4},
                  },
                  declineButt: {
                    color:'white',
                    marginBottom: 0,
                    marginTop: 10,
                    backgroundColor: '#CBA3D5',
                    alignItems: 'center',
                    borderRadius: 20,
                    width:150,
                    height: 50,
                    alignItems:'center',
                    justifyContent:'center',
                    shadowColor: 'grey',
                    shadowOpacity: 2,
                    shadowRadius: 2,
                    shadowOffset: {width: 0,height: 4},
                  },
                  acceptButt: {
                    color:'white',
                    marginBottom: 0,
                    marginTop: 10,
                    backgroundColor: '#8FBC8F',
                    alignItems: 'center',
                    borderRadius: 20,
                    width:150,
                    height: 50,
                    alignItems:'center',
                    justifyContent:'center',
                    shadowColor: 'grey',
                    shadowOpacity: 2,
                    shadowRadius: 2,
                    shadowOffset: {width: 0,height: 4},
                  },
                  buttonBottomContainer: {
                    flexDirection:'row',
                    justifyContent: 'space-between',
                    width: 340,
                    margin: 10,
                    marginTop:10
                  },
                  message:{
                    marginBottom: 20,
                    height: 100,
                    width: '100%',
                    backgroundColor:'#689999',
                    //borderWidth: 3,
                  },
                  messageText:{
                    fontSize: 20,
                    color: 'white',
                    fontFamily: 'Roboto-Light',
                    padding: 10,

                  },

                  modalList: {
                    marginBottom:0,
                    width: '100%',
                    height: 150,
                  },
                  friendReqButton:{
                    flexDirection:'row',
                    justifyContent: 'space-between',
                    width: 90,
                  },
                  invitedContainer:{
                    flexDirection:'row',
                    alignItems:'center',
                    borderRadius: 10,
                    justifyContent: 'center',
                    width:'100%',
                    margin: 20
                  },
                  profilePicContainer: {
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#689999',
                    margin: 5,
                  },
                });
