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
import firebase from '@firebase/app';

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
      this.extractKey = ({AltID}) => AltID
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      this.state = {
        myResult: [],
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
    var that = this;
    var user = firebase.auth().currentUser;
    var userID = user.uid;
    var db = firebase.firestore();
    var voteID = this.props.navigation.state.params.VoteID
    var docRef = db.collection("Users").doc(userID).collection("Result").doc(voteID)
docRef.collection("Alternatives").onSnapshot(function(querySnapshot) {
  that.setState({result: []})
    querySnapshot.forEach(function(doc) {
      const altID = doc.id;
      const name = doc.get('Name')
      const votes = doc.get('Votes')
    //  console.log(that.state.result)
      that.setState(prevState => ({
        result: [...prevState.result, {AltID: altID, Name: name, Votes: votes}]
      }))
      that.state.result.sort((a, b) => (a.Votes < b.Votes) ? 1 : -1)
      that.setState({winner: that.state.result[0].Name})
      if(that.state.result.length > 1){
        that.setState({second: that.state.result[1].Name})
      }
      if(that.state.result.length > 2){
          that.setState({third: that.state.result[2].Name})
      }
    })
  })
}

saveResult() {
  //var that = this;
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var voteID = this.props.navigation.state.params.VoteID
  var docRef = db.collection('Users').doc(userID).collection('Result').doc(voteID)
  docRef.update({
    Saved: true
  })
}

deleteResult() {
  var that = this;
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  var voteID = this.props.navigation.state.params.VoteID
  var docRef = db.collection('Users').doc(userID).collection('Result').doc(voteID)
  docRef.collection('Alternatives').get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          const id = doc.id
          docRef.collection('Alternatives').doc(id).delete().then(function() {
            console.log("delete alternatives ");
          }).catch(function(error) {
            console.error("delete alternatives ", error);
          });
      });
  });
  docRef.delete().then(function() {
  console.log("delete vote " + voteID);
  }).catch(function(error) {
  console.error("delete vote ", error);
  });
}

      render() {
        return (
          <View style={styles.container}>
          <Image source={require('../assets/images/medal.png')} style={styles.medalPic}/>
          <Text style={styles.resultLabel}>{data.result}</Text>
          <View style={styles.firstContainer}>
          <Text style={styles.containText}>{this.state.winner}</Text>
          <View style={styles.trophyIcon}>
          <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
          size={40}
          color='#daa520'/>
          </View>
          </View>

          <View style={styles.secondContainer}>
          <Text style={styles.containText}>{this.state.second}</Text>
          <View style={styles.trophyIcon}>
          <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
          size={40}
          color='#c0c0c0'/>
          </View>
          </View>

          <View style={styles.thirdContainer}>
          <Text style={styles.containText}>{this.state.third}</Text>
          <View style={styles.trophyIcon}>
          <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
          size={40}
          color='#a0522d'/>
          </View>
          </View>

          <View style = {styles.buttonContainer}>

          <TouchableOpacity
          style = {styles.saveResult}
          underlayColor='#fff'>
          <Text style= {styles.saveResultText}>{data.delete} </Text>
          </TouchableOpacity>

          <TouchableOpacity
          style = {styles.saveResult}
          underlayColor='#fff'>
          <Text style= {styles.saveResultText}>{data.save}{data.result}</Text>
          </TouchableOpacity>
          </View>
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
        height: 120,
        width: 120,
        //borderRadius: 100,
        //borderWidth: 2,
        //borderColor: 'white',
      },
      resultLabel:{
        fontFamily: 'Roboto-Light',
        color: 'black',
        fontSize: 40,
        padding: 20,
      },
      containText: {
        textAlign: 'center',
        flexGrow: 1,
        fontFamily: 'Roboto-Light',
        color: '#FFFFFF',
        fontSize: 25,
        alignSelf: 'center',
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
      buttonContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
      },
      saveResult: {
        justifyContent: 'center',
        width: 130,
        height: 70,
        margin: 10,
        padding: 10,
        //marginTop:100,
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
