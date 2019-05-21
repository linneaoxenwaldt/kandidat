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
import 'firebase/firestore';

export default class AddAlternativeScreen extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    this.extractKey = ({id}) => id
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    this.userID = this.user.uid;
    this.vote = this.props.navigation.state.params.vote
    this.VoteID = this.vote.VoteID
    this.createrID = this.vote.sentFromID
    this.participants = this.props.navigation.state.params.participants
    this.state = {
      rows: [],
      text: '',
      newAlternatives: [],
      answers: [],
    }
    this.getFriendsAlt()
    this.getAnswers()
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
      };
    };

    getFriendsAlt() {
      var that = this
      var docRef = this.db.collection("Users").doc(this.createrID).collection("PendingVotes").doc(this.vote.VoteID).collection('Alternatives')
      docRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const name = doc.get('Name');
          const votes = doc.get('Votes');
          that.setState(prevState => ({
            rows: [...prevState.rows, {id: doc.id, text: name, votes: votes, readyMade: true}]
          }))
        });
      });
    }

    addNewAlternative() {
      var that = this
      if(this.state.text == "") {
        Alert.alert(
          data.missingAltName,
        )
      }
      else {
        this.db.collection("Users").doc(this.userID).collection("PendingVotes").doc(this.VoteID).collection('Alternatives').add({
          Name: this.state.text,
          Votes: 0,
        })
        .then(function(docRef) {
          console.log("AddAlt: Document written with ID: ", docRef.id);
          that.textInput.clear()
          that.setState(prevState => ({
            rows: [...prevState.rows, {id: docRef.id, text: that.state.text, votes: 0, readyMade: false}]
          }))
          that.setState(prevState => ({
            newAlternatives: [...prevState.newAlternatives, {id: docRef.id, text: that.state.text, votes: 0, readyMade: false}]
          }))
          that.state.text = ""
        })
        .catch(function(error) {
          console.error("AddAlt: Error adding document: ", error);
        });
      }
    }

    deleteAlternative(delItem) {
      var delItemID = delItem.id
      this.db.collection("Users").doc(this.userID).collection("PendingVotes").doc(this.voteID).collection("Alternatives").doc(delItemID).delete().then(function() {
        console.log("delAlt: Document successfully deleted!" + delItem.id);
      }).catch(function(error) {
        console.error("delAlt: Error removing document: ", error);
      });
      this.setState(prevState => ({rows: prevState.rows.filter(item => item !== delItem) }));
      this.setState(prevState => ({newAlternatives: prevState.newAlternatives.filter(item => item !== delItem) }));
    }

    addAlternativesToParticipants() {
      for(let i=0; i<this.state.newAlternatives.length; i++) {
        this.db.collection("Users").doc(this.createrID).collection("PendingVotes").doc(this.VoteID).collection('Alternatives').doc(this.state.newAlternatives[i].id).set({
          Name: this.state.newAlternatives[i].text,
          Votes: this.state.newAlternatives[i].votes,
        })
        .then(function(docRef) {
        })
        .catch(function(error) {
          console.error("AddAlt: Error adding document: ", error);
        });

        for(let i=0; i < this.participants.length; i++) {
          if(this.VoteID === this.participants[i].VoteID){
            var participantID = this.participants[i].ParticipantID
            var docRef = this.db.collection('Users').doc(participantID).collection('PendingVotes').doc(this.VoteID);
            var getDoc = docRef.get()
            .then(doc => {
              if (!doc.exists) {
                console.log("No such document")
              } else {
                docRef.doc(this.state.newAlternatives[i].id).set({
                  Name: this.state.newAlternatives[i].text,
                  Votes: this.state.newAlternatives[i].votes,
                })
                console.log('Document data:', doc.data());
              }
            })
            .catch(err => {
              console.log('Error getting document', err);
            });
          }}}
          this.checkAnswers()
        }

        getAnswers() {
          var that = this
          var docRef = this.db.collection("Users").doc(this.createrID).collection("PendingVotes").doc(this.VoteID).collection('Participants')
          docRef.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              const answer = doc.get('Answer');
              that.setState(prevState => ({
                answers: [...prevState.answers, {ParticipantID: doc.id, Answer: answer}]
              }))
            });
          });
        }

        checkAnswers() {
          var allAnswerYes = true
          for(let i=0; i < this.state.answers.length; i++){
            if(this.state.answers[i].Answer === "noAnswer") {
              allAnswerYes = false
            }
          }
          if(allAnswerYes === true) {
            this.startTheVote()
          }
          else if(allAnswerYes === false) {
            this.props.navigation.navigate('OngoingVote')
          }
        }

        startTheVote() {
          this.createVoteForUser()
          this.createVoteForCreater()
          this.createVoteForParticipants()
          this.props.navigation.navigate('OngoingVote')
        }

        createVoteForUser(){
          var docRef = this.db.collection("Users").doc(this.userID).collection("Votes").doc(this.VoteID)
          docRef.set({
            CatName: this.vote.CatName,
            CatImg: this.vote.CatImg,
            Finished: "No",
          })
          for(let i=0; i<this.state.rows.length; i++) {
            var altID = this.state.rows[i].id;
            var altName = this.state.rows[i].text
            var altVotes = this.state.rows[i].votes
            docRef.collection('Alternatives').doc(altID).set({
              Name: altName,
              Votes: altVotes,
            })
          }
          docRef.collection('Participants').doc(this.createrID).set({
          })
          for(let i=0; i < this.participants.length; i++) {
            var partID = this.participants[i].ParticipantID;
            docRef.collection('Participants').doc(partID).set({
            })
          }
          var docRef2 = this.db.collection("Users").doc(this.userID).collection("PendingVotes").doc(this.VoteID)
          docRef2.collection('Alternatives').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              const id = doc.id
              docRef2.collection('Alternatives').doc(id).delete().then(function() {
              }).catch(function(error) {
                console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
              });
            });
          });
          docRef2.collection('Participants').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              const id = doc.id
              docRef2.collection('Participants').doc(id).delete().then(function() {
              }).catch(function(error) {
                console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
              });
            });
          });
          docRef2.delete().then(function() {
          }).catch(function(error) {
            console.error("pendingVotes - startVote: Error removing document: ", error);
          });
        }

        createVoteForCreater(){
          var docRef = this.db.collection("Users").doc(this.createrID).collection("Votes").doc(this.VoteID)
          docRef.set({
            CatName: this.vote.CatName,
            CatImg: this.vote.CatImg,
            Finished: "No",
          })
          for(let i=0; i<this.state.rows.length; i++) {
            var altID = this.state.rows[i].id;
            var altName = this.state.rows[i].text
            var altVotes = this.state.rows[i].votes
            docRef.collection('Alternatives').doc(altID).set({
              Name: altName,
              Votes: altVotes,
            })
          }
          docRef.collection('Participants').doc(this.userID).set({
          })
          for(let i=0; i < this.participants.length; i++) {
            var partID = this.participants[i].ParticipantID;
            docRef.collection('Participants').doc(partID).set({
            })
          }
          var docRef2 = this.db.collection("Users").doc(this.createrID).collection("PendingVotes").doc(this.VoteID)
          docRef2.collection('Alternatives').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              const id = doc.id
              docRef2.collection('Alternatives').doc(id).delete().then(function() {
              }).catch(function(error) {
                console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
              });
            });
          });
          docRef2.collection('Participants').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              const id = doc.id
              docRef2.collection('Participants').doc(id).delete().then(function() {
              }).catch(function(error) {
                console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
              });
            });
          });
          docRef2.delete().then(function() {
          }).catch(function(error) {
            console.error("pendingVotes - startVote: Error removing document: ", error);
          });
        }

        createVoteForParticipants(){
          for(let i=0; i < this.participants.length; i++) {
            if(this.VoteID === this.participants[i].VoteID) {
              var participantID = this.participants[i].ParticipantID
              var docRef = this.db.collection("Users").doc(participantID).collection("Votes").doc(this.VoteID)
              docRef.set({
                CatName: this.vote.CatName,
                CatImg: this.vote.CatImg,
                Finished: "No",
              })
              for(let i=0; i < this.state.rows.length; i++) {
                var altID = this.state.rows[i].id;
                var altName = this.state.rows[i].text
                var altVotes = this.state.rows[i].votes
                docRef.collection('Alternatives').doc(altID).set({
                  Name: altName,
                  Votes: altVotes,
                })
              }
              docRef.collection('Participants').doc(this.createrID).set({
              })
              docRef.collection('Participants').doc(this.userID).set({
              })
              for(let i=0; i < this.participants.length; i++) {
                var partID = this.participants[i].ParticipantID;
                if(partID !== participantID){
                  docRef.collection('Participants').doc(partID).set({
                  })
                }
              }
              var docRef2 = this.db.collection("Users").doc(participantID).collection("PendingVotes").doc(this.VoteID)
              docRef2.collection('Alternatives').get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  const id = doc.id
                  docRef2.collection('Alternatives').doc(id).delete().then(function() {
                  }).catch(function(error) {
                    console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
                  });
                });
              });
              docRef2.collection('Participants').get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  const id = doc.id
                  docRef2.collection('Participants').doc(id).delete().then(function() {
                  }).catch(function(error) {
                    console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
                  });
                });
              });
              docRef2.delete().then(function() {
              }).catch(function(error) {
                console.error("pendingVotes - startVote: Error removing document: ", error);
              });
            }
          }
        }

        renderItem = ({item, index}) => {
          var msg = `${data.sureMsg} ${item.text}?`
          if(item.readyMade === false) {
            return (
              <ListItem
              containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
              titleStyle={{color: '#FFFFFF', fontSize: 30}}
              title={item.text}
              rightIcon = {<Icon name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
              size={30}
              style={styles.RemoveIcon}
              color= {"#fff"}
              onPress={() => Alert.alert(
                data.deleteAlternative,
                msg,
                [
                  {text: data.cancel, onPress: () => this.props.navigation.navigate('AddAlternative')},
                  {text: data.ok, onPress: () => this.deleteAlternative(item)},
                ],
                { cancelable: false })}/>}
                />)
              }
              else if(item.readyMade === true){
                return (
                  <ListItem
                  containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
                  titleStyle={{color: '#FFFFFF', fontSize: 30}}
                  title={item.text}
                  />)
                }
              }

              render() {
                return (
                  <View style={styles.container}>
                  <Text style={styles.alternativeLabel}>{data.alternatives.toUpperCase()}</Text>
                  <View style={styles.addMoreAlt}>
                  <TextInput
                  ref={input => { this.textInput = input }}
                  style={styles.textInput}
                  placeholder={data.addNew}
                  maxLength={28}
                  onChangeText={(text) => this.setState({text})}
                  />
                  <TouchableOpacity
                  style = {styles.saveButton}
                  onPress={() => this.addNewAlternative()}
                  >
                  <Icon name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
                  size={40}
                  style={styles.RemoveIcon}
                  color= {"#fff"}
                  />
                  </TouchableOpacity>
                  </View>

                  <FlatList
                  data={this.state.rows}
                  renderItem={this.renderItem}
                  keyExtractor={this.extractKey}
                  />

                  <View style={styles.buttonBottomContainer}>
                  <TouchableOpacity
                  onPress={() => this.addAlternativesToParticipants()}
                  style = {styles.startButton}
                  >
                  <Text style={styles.startText}>{data.start}{data.vote}</Text>
                  </TouchableOpacity>
                  </View>
                  </View>
                );
              }
            }

            const styles = StyleSheet.create({
              container: {
                flex: 1,
                paddingTop: 20,
                backgroundColor: '#FFFFFF',
                justifyContent:'center',
              },
              alternativeLabel: {
                //textTransform: 'uppercase',
                fontSize: 40,
                color: '#000000',
                textAlign: 'center',
                fontFamily: "Roboto-Light",
              },
              addMoreAlt: {
                alignItems: 'center',
              },
              row: {
                fontFamily: "Roboto-Light",
                color: '#FFFFFF',
                padding: 10,
                marginBottom: 5,
                fontSize: 20,
                justifyContent: 'center',
              },
              textInput: {
                backgroundColor: '#6BCDFD',
                fontSize: 25,
                textAlign:'center',
                alignItems: 'center',
                width: 350,
                height: 70,
                borderRadius: 30,
                margin: 20,
                padding: 10,
                color: '#FFFFFF',
                borderColor: '#3BCDFD',
                borderWidth:4,
              },
              saveButton: {
                backgroundColor: "#BA55B3",
                width: 70,
                height: 70,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100,
                marginTop:10,
                marginBottom: 20,
              },
              startButton:{
                backgroundColor: "#6BCDFD",
                width: 150,
                height: 55,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                marginBottom:10,
                margin: 20,
              },
              startText:{
                textAlign: 'center',
                fontSize: 20,
                color:'white',
                fontFamily: "Roboto-Light",
              },
              buttonBottomContainer: {
                flexDirection:'row',
                justifyContent: 'center',
                marginLeft: 10,
                marginRight: 10,
              },
            });
