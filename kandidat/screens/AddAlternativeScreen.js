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
  this.state = {
    rows: [],
    text: '',
    newAlternatives: [],
    answers: [],
    //category: [],
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
      var vote = this.props.navigation.state.params.vote
      var createrID = vote.sentFromID
      //console.log(this.props.navigation.state.params.vote)
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      var docRef = db.collection("Users").doc(createrID).collection("PendingVotes").doc(vote.VoteID).collection('Alternatives')
      docRef.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
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
     var vote = this.props.navigation.state.params.vote
     if(this.state.text == "") {
       Alert.alert(
         data.missingAltName,
       )
     }
     else {
       var user = firebase.auth().currentUser;
       var userID = user.uid;
       var db = firebase.firestore();
       db.collection("Users").doc(userID).collection("PendingVotes").doc(vote.VoteID).collection('Alternatives').add({
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
     var that = this
     var vote = this.props.navigation.state.params.vote
     var user = firebase.auth().currentUser;
     var userID = user.uid;
     var db = firebase.firestore();
     var voteID = vote.VoteID
     var delItemID = delItem.id
     db.collection("Users").doc(userID).collection("PendingVotes").doc(voteID).collection("Alternatives").doc(delItemID).delete().then(function() {
       console.log("delAlt: Document successfully deleted!" + delItem.id);
     }).catch(function(error) {
       console.error("delAlt: Error removing document: ", error);
     });
     this.setState(prevState => ({rows: prevState.rows.filter(item => item !== delItem) }));
     this.setState(prevState => ({newAlternatives: prevState.newAlternatives.filter(item => item !== delItem) }));
   }

   addAlternativesToParticipants() {
      var participants = this.props.navigation.state.params.participants
      var vote = this.props.navigation.state.params.vote
      var db = firebase.firestore();
      var voteID = vote.VoteID
      var createrID = vote.sentFromID
      var user = firebase.auth().currentUser;
      var userID = user.uid;

      for(let i=0; i<this.state.newAlternatives.length; i++) {
        db.collection("Users").doc(createrID).collection("PendingVotes").doc(vote.VoteID).collection('Alternatives').doc(this.state.newAlternatives[i].id).set({
          Name: this.state.newAlternatives[i].text,
          Votes: this.state.newAlternatives[i].votes,
        })
        .then(function(docRef) {
          console.log("AddAlt: Document written with ID: ", );
        })
        .catch(function(error) {
          console.error("AddAlt: Error adding document: ", error);
        });

for(let i=0; i<participants.length; i++) {
  var participantID = participants[i].ParticipantID
        var docRef = db.collection('Users').doc(participantID).collection('PendingVotes').doc(vote.VoteID);
        var getDoc = docRef.get()
            .then(doc => {
                if (!doc.exists) {
                  console.log("no doc")
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
      }}
  this.checkAnswers()
   }

   getAnswers() {
     var that = this
     var user = firebase.auth().currentUser;
     var userID = user.uid;
     var db = firebase.firestore();
     var vote = this.props.navigation.state.params.vote
     var createrID = vote.sentFromID

     var docRef = db.collection("Users").doc(createrID).collection("PendingVotes").doc(vote.VoteID).collection('Participants')
     docRef.get().then(function(querySnapshot) {
           querySnapshot.forEach(function(doc) {
               // doc.data() is never undefined for query doc snapshots
               const answer = doc.get('Answer');
               //console.log("ANSWER" + answer)
               that.setState(prevState => ({
                 answers: [...prevState.answers, {ParticipantID: doc.id, Answer: answer}]
               }))
           });
       });
   }

   checkAnswers() {
     var allAnswerYes = true
     //console.log(this.state.answers)
     for(let i=0; i < this.state.answers.length; i++){
       //console.log("ANSER " + this.state.answers[i].Answer)
       if(this.state.answers[i].Answer === "noAnswer") {
       //console.log(allAnswerYes)
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
  var participants = this.props.navigation.state.params.participants
  var vote = this.props.navigation.state.params.vote
  var db = firebase.firestore();
  var voteID = vote.VoteID
  var createrID = vote.sentFromID
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var docRef = db.collection("Users").doc(userID).collection("Votes").doc(voteID)
  docRef.set({
    CatName: vote.CatName,
    CatImg: vote.CatImg,
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
var docRef2 = db.collection("Users").doc(userID).collection("PendingVotes").doc(voteID)
docRef2.collection('Alternatives').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        const id = doc.id
        docRef2.collection('Alternatives').doc(id).delete().then(function() {
          console.log("deletePendingVoteFromFriend: Alt successfully deleted!" + id);
        }).catch(function(error) {
          console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
        });
    });
});
docRef2.collection('Participants').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        const id = doc.id
        docRef2.collection('Participants').doc(id).delete().then(function() {
          console.log("deletePendingVoteFromFriend: Alt successfully deleted!" + id);
        }).catch(function(error) {
          console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
        });
    });
});
docRef2.delete().then(function() {
console.log("pendingVotes - startVote: Document successfully deleted!" + voteID);
}).catch(function(error) {
console.error("pendingVotes - startVote: Error removing document: ", error);
});
}

createVoteForCreater(){
  var participants = this.props.navigation.state.params.participants
  var vote = this.props.navigation.state.params.vote
  var db = firebase.firestore();
  var voteID = vote.VoteID
  var createrID = vote.sentFromID
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var docRef = db.collection("Users").doc(createrID).collection("Votes").doc(voteID)
  docRef.set({
    CatName: vote.CatName,
    CatImg: vote.CatImg,
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
var docRef2 = db.collection("Users").doc(createrID).collection("PendingVotes").doc(voteID)
docRef2.collection('Alternatives').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        const id = doc.id
        docRef2.collection('Alternatives').doc(id).delete().then(function() {
          console.log("deletePendingVoteFromFriend: Alt successfully deleted!" + id);
        }).catch(function(error) {
          console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
        });
    });
});
docRef2.collection('Participants').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        const id = doc.id
        docRef2.collection('Participants').doc(id).delete().then(function() {
          console.log("deletePendingVoteFromFriend: Alt successfully deleted!" + id);
        }).catch(function(error) {
          console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
        });
    });
});
docRef2.delete().then(function() {
console.log("pendingVotes - startVote: Document successfully deleted!" + voteID);
}).catch(function(error) {
console.error("pendingVotes - startVote: Error removing document: ", error);
});
}

createVoteForParticipants(){
  var participants = this.props.navigation.state.params.participants
  var vote = this.props.navigation.state.params.vote
  var voteID = vote.VoteID
  console.log("alla " + participants)
  var db = firebase.firestore();
  console.log("längd " + participants.length)
  for(let i=0; i< participants.length; i++) {
    var participantID = participants[i].ParticipantID
    console.log("id " + participantID)
  var docRef = db.collection("Users").doc(participantID).collection("Votes").doc(voteID)
  docRef.set({
    CatName: vote.CatName,
    CatImg: vote.CatImg,
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
var docRef2 = db.collection("Users").doc(participantID).collection("PendingVotes").doc(voteID)
docRef2.collection('Alternatives').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        const id = doc.id
        docRef2.collection('Alternatives').doc(id).delete().then(function() {
          console.log("deletePendingVoteFromFriend: Alt successfully deleted!" + id);
        }).catch(function(error) {
          console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
        });
    });
});
docRef2.collection('Participants').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        const id = doc.id
        docRef2.collection('Participants').doc(id).delete().then(function() {
          console.log("deletePendingVoteFromFriend: Alt successfully deleted!" + id);
        }).catch(function(error) {
          console.error("deletePendingVoteFromFriend: Alt Error removing document: ", error);
        });
    });
});
docRef2.delete().then(function() {
console.log("pendingVotes - startVote: Document successfully deleted!" + voteID);
}).catch(function(error) {
console.error("pendingVotes - startVote: Error removing document: ", error);
});
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
       color= {'white'}
       onPress={() => Alert.alert(
     data.deleteAlternative,
     msg,
     [
       {text: 'Cancel', onPress: () => this.props.navigation.navigate('AddAlternative')},
       {text: 'OK', onPress: () => this.deleteAlternative(item)},
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
      <Text style={styles.alternativeLabel}>{data.alternatives}</Text>
      <View style={styles.addMoreAlt}>
      <TextInput
      ref={input => { this.textInput = input }}
      style={styles.textInput}
      placeholder="Add new"
      onChangeText={(text) => this.setState({text})}
      />
      <TouchableOpacity
      style = {styles.saveButton}
        onPress={() => this.addNewAlternative()}
        >
        <Icon name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
        size={40}
        style={styles.RemoveIcon}
        color= {'white'}
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
  onPress={() => this.checkPrePage()}
  >
  <Icon
  name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
  size={55}
  color="#A9A9A9"/>
</TouchableOpacity>
<TouchableOpacity
  onPress={() => this.addAlternativesToParticipants()}
  >
<Icon
name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
size={55}
color="#A9A9A9"/>
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
    fontSize: 40,
    color: '#000000',
    textAlign: 'center',
    fontFamily: "Roboto-Light",
  },
  addMoreAlt: {
    alignItems: 'center',
  },
  // addAlternative: {
  //   justifyContent: 'center',
  //   width: 350,
  //   height: 70,
  //   margin: 10,
  //   padding: 10,
  //   backgroundColor:'#BA55B3',
  //   borderRadius:30,
  //   borderWidth: 1,
  //   borderColor: '#fff'
  // },
  // addAlternativeText: {
  //   fontFamily: "Roboto-Light",
  //   color:'#fff',
  //   fontSize: 25,
  //   textAlign:'center',
  //   paddingLeft : 1,
  //   paddingRight : 1,
  // },
  // alternativeContainer: {
  //   marginTop: 40,
  //   textAlign: 'center',
  //   alignItems: 'center',
  // },
  // alternativeText: {
  //   fontFamily: "Roboto-Light",
  //   color: '#000000',
  //   fontSize: 25,
  // },
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
  //backgroundColor: '#8FBC8F',
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
addIcon: {
  color: "#FFFFFF",
  fontSize: 30,
  fontFamily: 'Roboto-Light',
},
buttonBottomContainer: {
flexDirection:'row',
justifyContent: 'space-between',
//width: '100%',
marginLeft: 10,
marginRight: 10,
},
});
