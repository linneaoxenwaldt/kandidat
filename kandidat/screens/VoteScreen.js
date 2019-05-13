import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  Alert,
  Modal,
  FlatList,
  PanResponder,
  Animated,
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from 'react-native-vector-icons/AntDesign'
import { LinearGradient } from 'expo';
import * as firebase from 'firebase';
import data from '../data/engWord.json';


const Alternatives = [
  { id: "1", text: 'hej1'},
  { id: "2", text: 'hej2'},
  { id: "3", text: 'hej3'},
  { id: "4", text: 'hej4'},
  { id: "5", text: 'hej5'},
]

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
    this.position = new Animated.ValueXY()
    this.extractKey = ({AltID}) => AltID
    var user = firebase.auth().currentUser;
    var userID = user.uid;
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']

    this.state = {
      myText: 'I\'m ready to get swiped!',
      gestureName: 'none',
      backgroundColor: '#fff',
      alternatives: [],
      currentNumber: 0,
      partFinished: [],
      allParticipants: [{ParticipantID: userID}],
      result: [],
      currentIndex: 0,
      CatName: [],
    };
    this.getAllAlt()
    this.getFinishedAnswers()
    this.getCatName()

    this.rotate = this.position.x.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: ['-15deg', '0deg', '15deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
    ]
  }

  this.likeOpacity = this.position.x.interpolate({
    inputRange: [-150, 0, 150],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  })
  this.dislikeOpacity = this.position.x.interpolate({
    inputRange: [-150, 0, 150],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp'
  })
  this.nextCardOpacity = this.position.x.interpolate({
    inputRange: [-150, 0, 150],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp'
  })
  this.nextCardScale = this.position.x.interpolate({
    inputRange: [-150, 0, 150],
    outputRange: [1, 0.6, 1],
    extrapolate: 'clamp'
  })
  }

getCatName() {
  var that = this
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var voteID = this.props.navigation.state.params.VoteID
  var docRef = db.collection('Users').doc(userID).collection('Votes').doc(voteID)
  docRef.get().then(function(doc) {
    if (doc.exists) {
      var catName = doc.get('CatName')
        that.setState({CatName: catName})
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
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

giveLike(altID, origin){
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
this.updateCurrentNumber(origin)
}

updateCurrentNumber(origin){
  console.log("num update " + this.state.currentNumber)
  console.log("index update " + this.state.currentIndex)
  console.log(origin)
  if(origin === "button"){
  this.setState(prevState => ({ currentIndex: prevState.currentIndex + 1 }));
  }
  var numberAlt = this.state.alternatives.length
  var nowNumber = this.state.currentNumber
this.setState(prevState => ({ currentNumber: prevState.currentNumber + 1 }));
if(this.state.alternatives.length === this.state.currentNumber + 1){
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
    this.createResult()
    console.log(this.state.partFinished)
    this.props.navigation.navigate('ResultScreen', {VoteID: voteID, saved: false})
    //this.getResults()
  }
  else if(allAnswerYes === false) {
    this.props.navigation.navigate('OngoingVote')
  }
}

createResult(){
  var that = this;
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var alternatives = this.state.alternatives
  var participants = this.state.allParticipants
  var voteID = this.props.navigation.state.params.VoteID
  var docRef1 = db.collection("Users").doc(userID).collection("Votes").doc(voteID)
  docRef1.get().then(function(doc) {
    if (doc.exists) {
      var catName = doc.get('CatName')
      var catImg = doc.get('CatImg')
      //console.log(participants)
      for(let k=0; k < participants.length; k++){
        //console.log(participants[k])
      var docRef = db.collection("Users").doc(participants[k].ParticipantID).collection("Result").doc(voteID)
      docRef.set({
        CatName: catName,
        CatImg: catImg,
        Saved: false,
      })
      for(let i=0; i<alternatives.length; i++) {
        //var finalVote = this.checkVotes(alternatives[i].AltID)
        docRef.collection('Alternatives').doc(alternatives[i].AltID).set({
          Name: alternatives[i].Name,
          Votes: 0,
        })
      }
    }
      for(let j=0; j< participants.length; j++){
        console.log(participants[j])
        var partID = participants[j].ParticipantID
        docRef2 = db.collection("Users").doc(partID).collection("Votes").doc(voteID)
        docRef2.collection('Alternatives').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            const altID = doc.id;
            const votes = doc.get('Votes')
           //console.log("blaa " + votes)
            if(votes === 1) {
              for(let h=0; h < participants.length; h++) {
              db.collection("Users").doc(participants[h].ParticipantID).collection("Result").doc(voteID).collection('Alternatives').doc(altID).update({
                Votes: firebase.firestore.FieldValue.increment(1)
              })
            }
            }
          })
        })
      }
    }
    that.deleteVote()
      }).catch(function(error) {
    console.log("Error getting document:", error);
  });
}

deleteVote() {
  var that = this;
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var alternatives = this.state.alternatives
  var participants = this.state.allParticipants
  var voteID = this.props.navigation.state.params.VoteID
  for(let m=0; m < participants.length; m++){
    db.collection("Users").doc(participants[m].ParticipantID).collection("Votes").doc(voteID).collection('Alternatives').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            const id = doc.id
            db.collection("Users").doc(participants[m].ParticipantID).collection("Votes").doc(voteID).collection('Alternatives').doc(id).delete().then(function() {
              console.log("delete alternatives ");
            }).catch(function(error) {
              console.error("delete alternatives ", error);
            });
        });
    });
  db.collection("Users").doc(participants[m].ParticipantID).collection("Votes").doc(voteID).collection('Participants').get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          const id = doc.id
          db.collection("Users").doc(participants[m].ParticipantID).collection("Votes").doc(voteID).collection('Participants').doc(id).delete().then(function() {
            console.log("delete participant " + id);
          }).catch(function(error) {
            console.error("delete participant ", error);
          });
      });
  });
  db.collection("Users").doc(participants[m].ParticipantID).collection("Votes").doc(voteID).delete().then(function() {
  console.log("delete vote " + voteID);
  }).catch(function(error) {
  console.error("delete vote ", error);
  });
}}

  onSwipeUp(gestureState) {
    this.setState({myText: 'You swiped up!'});
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: 400, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
          this.giveLike(this.state.alternatives[this.state.currentIndex].AltID, "swipe")
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -400, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
          this.updateCurrentNumber("swipe")
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 10
          }).start()
        }
      }
    })
  }

  renderAlternatives = () => {

    return this.state.alternatives.map((item, i) => {

      if (i < this.state.currentIndex) {
        return null
      }
      else if (i == this.state.currentIndex) {

        return (
          <Animated.View
          {...this.PanResponder.panHandlers}
          key={item.AltID} style={[this.rotateAndTranslate, { backgroundColor: this.colors[i % this.colors.length], height: 280, width: 280, borderRadius: 20, position: 'absolute'}]}
         >
         <Animated.View style = {styles.pinIcon}>
         <Icon2 name="pushpin" size={50} color={'grey'}/>
         <Icon2 style = {styles.pin2}name="pushpin" size={50} color={'grey'} />
         </Animated.View>
          <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
          <Text style={styles.likeText}>{data.yes}</Text>
          </Animated.View>
          <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
          <Text style={styles.dislikeText}>{data.no}</Text>
          </Animated.View>

          <Text style={styles.alternativeText}>{item.Name}</Text>
          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View key={item.AltID} style={[{
            opacity: this.nextCardOpacity,
            transform: [{ scale: this.nextCardScale }], backgroundColor: this.colors[i % this.colors.length],
            height: 280, width: 280, borderRadius: 20, position: 'absolute'}]}>
            <Animated.View style = {styles.pinIcon}>
            <Icon2  name="pushpin" size={50} color={'grey'}/>
            <Icon2 style = {styles.pin2} name="pushpin" size={50} color={'grey'} />
            </Animated.View>

          <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
          <Text style={styles.likeText}>{data.yes}</Text>
          </Animated.View>
          <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
          <Text style={styles.dislikeText}>{data.no}</Text>
          </Animated.View>

          <Text style={styles.alternativeText}>{item.Name}</Text>
          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.catLabel}> {this.state.CatName} </Text>
      <View style={styles.card}>
      {this.renderAlternatives()}
      </View>


      <View style={styles.thumbsContain}>
      <TouchableOpacity onPress={() => this.updateCurrentNumber("button")}>
      <Icon name={Platform.OS === "ios" ? "ios-thumbs-down" : "md-thumbs-down"}
      color="#008080"
      size={80}/>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => this.giveLike(this.state.alternatives[this.state.currentIndex].AltID, "button")}>
      <Icon name={Platform.OS === "ios" ? "ios-thumbs-up" : "md-thumbs-up"}
      color="#008080"
      size={80}/>
      </TouchableOpacity>

      </View>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    alignItems: 'center',
    textAlign:'center',
    margin: 40,

  },
  catLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "Roboto-Light",
    fontSize: 40,
    textAlign: 'center',
    marginTop: 50,

  },

  alternativeText: {
    marginTop: 70,
    textAlign: "center",
    color: "#000",
    fontFamily: "Roboto-Light",
    fontSize: 40,
    color:'white',
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center'

  },
  likeText: {
    borderWidth: 1,
    borderColor: 'green',
    color: 'green',
    fontSize: 28,
    fontWeight: '800',
    padding: 10
  },
  dislikeText: {
    borderWidth: 1,
    borderColor: 'red',
    color: 'red',
    fontSize: 28,
    fontWeight: '800',
    padding: 10
  },
  thumbsContain: {
    flexDirection:'row',
    justifyContent: 'space-between',
    marginTop: 300,
    padding: 15,
  },
  pinIcon: {
    flexDirection:'row',
    justifyContent: 'space-between',
    marginLeft: -20,
    marginRigh:-20,
    width:320,


  },
  pin2:{transform: [{ rotate: '90deg' }]

  },
});
