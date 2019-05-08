import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  Alert,
  FlatList
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as firebase from 'firebase';

export default class ResultScreen extends React.Component {
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

    constructor(props) {
    super(props);
    this.extractKey = ({AltID, ParticipantID}) => AltID+ParticipantID
    var user = firebase.auth().currentUser;
    var userID = user.uid;
    this.state = {
      result: [],
      winner: [],
      second: [],
      third: [],
      highestVote: 0,
      secondHighestVote: 0,
    };
    this.getResult()
  }

  getResult() {
    var that = this
    var user = firebase.auth().currentUser;
    var userID = user.uid;
    var db = firebase.firestore();
    var voteID = this.props.navigation.state.params.VoteID
    var alternatives = this.props.navigation.state.params.Alternatives
    var participants = this.props.navigation.state.params.Participants
  for(let i=0; i < alternatives.length; i++){
    for(let j=0; j< participants.length; j++){
       var partID = participants[j].ParticipantID
       var altID = alternatives[i].AltID
      // var name = alternatives[i].Name
        var docRef = db.collection('Users').doc(partID).collection('Votes').doc(voteID).collection('Alternatives').doc(altID)
        docRef.get().then(function(doc) {
        var vote = doc.get('Votes')
        // console.log("i " + i)
        // console.log("j " + j)
        that.setState(prevState => ({
          result: [...prevState.result, {ParticipantID: participants[j].ParticipantID, AltID: alternatives[i].AltID, Name: alternatives[i].Name, Votes: vote}]
        }))
        console.log("Document data:", doc.data());
    })
    // that.setState(prevState => ({
    //   result: [...prevState.result, {AltID: altID, Name: name, Votes: finalVotes}]
    // }))
    // finalVotes = 0;
  }
  }
}

getWinner() {
var voteCounter = 0;
var highestVote = 0;
var winner = this.state.result[0]
for(let i=0; i<this.state.result.length; i++){
  for(let j=0; j<this.state.result.length; j++){
    if(this.state.result[i].ParticipantID !== this.state.result[j].ParticipantID){
    if(this.state.result[i].AltID === this.state.result[i].AltID) {
      voteCounter++
    }
  }
  if(voteCounter > highestVote) {
    highestVote = voteCounter
    winner = this.state.result[i]
  voteCounter = 0
}
}
}
this.setState(prevState => ({result: prevState.result.filter(item => item.AltID !== winner.AltID) }));
  return (
    <Text>{winner.Name}</Text>
  )
}

getSecond(){
var voteCounter = 0;
var secondHighestVote = 0;
for(let i=0; i<this.state.result.length; i++){
  for(let j=0; j<this.state.result.length; j++){
    if(this.state.result[i].ParticipantID !== this.state.result[j].ParticipantID){
    if(this.state.result[i].AltID === this.state.result[i].AltID) {
      voteCounter++
    }
  }
  if(voteCounter > secondHighestVote) {
    secondHighestVote = voteCounter
    var second = this.state.result[i]
    voteCounter = 0
}
}
}
  return (
    <Text>{second.Name}</Text>
  )
}

  // getResult(){
  //   var result = this.props.navigation.state.params.result
  //   console.log("resultat")
  //   console.log(result)
  //   this.setState({
  //     result: result
  //   })
  //   var winner = 0
  //   for(let i=0; i<result.length; i++){
  //     var votes = this.state.result[i].Votes
  //     if(votes > winner) {
  //       winner = votes
  //       this.setState({
  //         first: this.state.result[i]
  //       })
  //     }
  //   }
  //   this.setState(prevState => ({result: prevState.result.filter(item => item !== first) }));
  // }

  // <View style={styles.firstContainer}>
  // <Text style={styles.firstText}>{this.state.result[0].Name}</Text>
  // <View style={styles.trophyIcon}>
  // <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
  // size={40}
  // color='#daa520'/>
  // </View>
  // </View>

    render() {
      return (
        <View style={styles.container}>
        <Image source={require('../assets/images/medal.png')} style={styles.medalPic}/>
        <Text style={styles.resultLabel}>Result</Text>

        <View style={styles.firstContainer}>
        <Text style={styles.firstText}>{this.getWinner()}</Text>
        <View style={styles.trophyIcon}>
        <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
        size={40}
        color='#daa520'/>
        </View>
        </View>

        <View style={styles.secondContainer}>
        <Text style={styles.secondText}>{this.getSecond()}</Text>
        <View style={styles.trophyIcon}>
        <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
        size={40}
        color='#c0c0c0'/>
        </View>
        </View>

        <View style={styles.thirdContainer}>
        <Text style={styles.thirdText}>Alternativ 3</Text>
        <View style={styles.trophyIcon}>
        <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
        size={40}
        color='#a0522d'/>
        </View>
        </View>

        <TouchableOpacity
                  style = {styles.saveResult}
                  //onPress={spara resultatet}
                  underlayColor='#fff'>
                  <Text style= {styles.saveResultText}> Save Result
                  </Text>
         </TouchableOpacity>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 15,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
    },
    medalPic: {
      height: 200,
      width: 200,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: 'white',
    },

    resultLabel:{
      fontFamily: 'Roboto-Light',
      color: 'black',
      fontSize: 40,
      padding: 20,
    },

    firstContainer: {
      flexDirection:'row',
      width: 350,
      height: 70,
      backgroundColor: '#8FBC8F',
      justifyContent: 'center',
      borderRadius: 30,
      margin: 5,
      padding: 10,
    },
    firstText: {
      textAlign: 'center',
      flexGrow: 1,
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 25,
      alignSelf: 'center',
    },
    secondContainer: {
      flexDirection:'row',
      width: 350,
      height: 70,
      backgroundColor: '#6ACCCB',
      justifyContent: 'center',
      borderRadius: 30,
      margin: 5,
      padding: 10,
    },
    secondText: {
      textAlign: 'center',
      flexGrow: 1,
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 25,
      alignSelf: 'center',
    },
    thirdContainer: {
      flexDirection:'row',
      width: 350,
      height: 70,
      backgroundColor: '#94B4C1',
      justifyContent: 'center',
      borderRadius: 30,
      margin: 5,
      padding: 10,
    },
    thirdText: {
      textAlign: 'center',
      flexGrow: 1,
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 25,
      alignSelf: 'center',
    },
    trophyIcon: {
      justifyContent:'center',
      alignItems:'center',
      alignSelf: 'center',
      textAlign:'center',
      backgroundColor: 'white',
      borderRadius:100,
      alignSelf: 'center',
      color: '#daa520',
      paddingRight: 0,
      height: 50,
      width: 50,
      borderWidth: 2,
      borderColor: 'white'

    },
    saveResult: {
      justifyContent: 'center',
      width: 200,
      height: 70,
      margin: 10,
      padding: 10,
      marginTop:100,
      backgroundColor:'#BA55B3',
      borderRadius:20,
      borderWidth: 1,
      borderColor: '#fff'
    },
    saveResultText:{
      fontSize:20,
      textAlign:'center',
      alignItems:'center',
      color: 'white',
    },
  });
