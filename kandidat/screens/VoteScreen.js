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
  Modal,
  FlatList
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import data from '../data/engWord.json';
import { LinearGradient } from 'expo';
import * as firebase from 'firebase';

export default class VoteScreen extends React.Component {

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

    constructor(props) {
    super(props);
    this.extractKey = ({AltID}) => AltID
    var user = firebase.auth().currentUser;
    var userID = user.uid;
    this.state = {
      myText: 'I\'m ready to get swiped!',
      gestureName: 'none',
      backgroundColor: '#fff',
      alternatives: [],
      currentNumber: 0,
      partFinished: [],
      allParticipants: [{ParticipantID: userID}],
      result: [],
    };
    this.getAllAlt()
    this.getFinishedAnswers()
  }

getAllAlt(){
  var that = this
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var voteID = this.props.navigation.state.params.VoteID
  //console.log(voteID)
  db.collection("Users").doc(userID).collection("Votes").doc(voteID).collection('Alternatives').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            const altID = doc.id;
            const name = doc.get('Name');
            const votes = doc.get('Votes');
            that.setState(prevState => ({
              alternatives: [...prevState.alternatives, {AltID: altID, Name: name, Votes: votes}]
            }))
        });
    });
}

renderItem = ({item, index}) => {
  //console.log("len " + this.state.alternatives.length)
//  console.log("curr " + this.state.currentNumber)
  if(this.state.alternatives.length === this.state.currentNumber){
    return(
      Alert.alert(
    data.noMoreAlt,
    undefined,
    [
      //{text: 'Cancel', onPress: () => this.props.navigation.navigate('VoteScreen')},
      {text: 'OK', onPress: () => this.finishVote()},
    ],
    { cancelable: false })
    )
  }
  else {
  if(this.state.alternatives[this.state.currentNumber].AltID === item.AltID) {
  return (
    <View style={styles.thumbsContain}>
    <TouchableOpacity
    onPress={() => this.updateCurrentNumber()}>
    <Icon name={Platform.OS === "ios" ? "ios-thumbs-down" : "md-thumbs-down"}
    color="#008080"
    size={80}/>
    </TouchableOpacity>
    <Text>{item.Name}</Text>
    <TouchableOpacity
    onPress={() => this.giveLike(item.AltID)}>
    <Icon name={Platform.OS === "ios" ? "ios-thumbs-up" : "md-thumbs-up"}
    color="#008080"
    size={80}/>
    </TouchableOpacity>
    </View>)
  }
}
}

giveLike(altID){
  var that = this
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var voteID = this.props.navigation.state.params.VoteID
  db.collection("Users").doc(userID).collection("Votes").doc(voteID).collection('Alternatives').doc(altID).update({
    "Votes": 1,
})
.then(function() {
    console.log("Document successfully updated!");
});
this.updateCurrentNumber()
}

updateCurrentNumber(){
  var numberAlt = this.state.alternatives.length
  var nowNumber = this.state.currentNumber
this.setState(prevState => ({ currentNumber: prevState.currentNumber + 1 }));
//  console.log(this.state.currentNumber)
}

getFinishedAnswers(){
  var that = this
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var voteID = this.props.navigation.state.params.VoteID
  // this.setState(prevState => ({
  //   allParticipants: [...prevState.allParticipants, {ParticipantID: userID}]
  // }))
  db.collection("Users").doc(userID).collection("Votes").doc(voteID).collection('Participants').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const participantID = doc.id;
          that.setState(prevState => ({
            allParticipants: [...prevState.allParticipants, {ParticipantID: participantID}]
          }))
          var docRef = db.collection('Users').doc(participantID).collection('Votes').doc(voteID).get().then(function(doc) {
              if (doc.exists) {
                const finished = doc.get("Finished")
                that.setState(prevState => ({
                  partFinished: [...prevState.partFinished, {Finished: finished}]
                }))
                  console.log("Document data:", doc.data());
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });
        });
    });
}

finishVote(){
  var that = this
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var voteID = this.props.navigation.state.params.VoteID
  db.collection("Users").doc(userID).collection("Votes").doc(voteID).update({
    "Finished": "Yes",
})
this.checkFinishedAnswers()
}

checkFinishedAnswers(){
  var voteID = this.props.navigation.state.params.VoteID
  var allAnswerYes = true
  //console.log(this.state.answers)
  for(let i=0; i < this.state.partFinished.length; i++){
    //console.log("ANSER " + this.state.answers[i].Answer)
    if(this.state.partFinished[i].Finished === "No") {
    //console.log(allAnswerYes)
    allAnswerYes = false
  }
  }
  if(allAnswerYes === true) {
    console.log(this.state.partFinished)
    this.props.navigation.navigate('ResultScreen', {VoteID: voteID, Participants: this.state.allParticipants, Alternatives: this.state.alternatives})
    //this.getResults()
  }
  else if(allAnswerYes === false) {
    this.props.navigation.navigate('OngoingVote')
  }
}


  onSwipeUp(gestureState) {
    this.setState({myText: 'You swiped up!'});
  }

  onSwipeDown(gestureState) {
    this.setState({myText: 'You swiped down!'});
  }

  onSwipeLeft(gestureState) {
    this.setState({myText: 'You swiped left!'});
  }

  onSwipeRight(gestureState) {
    this.setState({myText: 'You swiped right!'});
  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        this.setState({backgroundColor: 'red'});
        break;
      case SWIPE_DOWN:
        this.setState({backgroundColor: 'green'});
        break;
      case SWIPE_LEFT:
        this.setState({backgroundColor: 'blue'});
        break;
      case SWIPE_RIGHT:
        this.setState({backgroundColor: 'yellow'});
        break;
    }
  }

    render() {

      const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
          };

      return (
        <View style={styles.container}>

        <View style={styles.swipecontain}>

        <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
        >
        <Text>{this.state.myText}</Text>
        <Text>onSwipe callback received gesture: {this.state.gestureName}</Text>
      </GestureRecognizer>
      <FlatList
      extraData={this.state}
 data={this.state.alternatives}
 renderItem={this.renderItem}
 keyExtractor={this.extractKey}
 />

        </View>

        <LinearGradient
        colors={['#FFFFFF', '#6ACCCB']}
        style={{ height: '100%', alignItems: 'center', borderRadius: 5 }}>
        </LinearGradient>


        </View>
      );
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    swipecontain: {
      height: 230,
      width: 200,
    },
    thumbsContain: {
      flexDirection:'row',
      justifyContent: 'space-between',

    },
  });
