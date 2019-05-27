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

      };
    };

    constructor(props) {
      super(props);
      this.extractKey = ({AltID}) => AltID
      this.db = firebase.firestore();
      this.user = firebase.auth().currentUser;
      this.userID = this.user.uid;
      this.voteID = this.props.navigation.state.params.VoteID
      this.state = {
        myResult: [],
        result: [],
        winner: [],
        second: [],
        third: [],
        highestVote: 0,
        secondHighestVote: 0,
        saved: this.props.navigation.state.params.saved,
      };
      this.getResult()
    }

    componentDidMount() {
  this._ismounted = true;
}

componentWillUnmount() {
   this._ismounted = false;
}

  getResult() {
    var that = this;
    var docRef = this.db.collection("Users").doc(this.userID).collection("Result").doc(this.voteID)
    docRef.collection("Alternatives").onSnapshot(function(querySnapshot) {
      if(that._ismounted === true){
        that.setState({ result: [] })
    querySnapshot.forEach(function(doc) {
      const altID = doc.id;
      const name = doc.get('Name')
      const votes = doc.get('Votes')
      that.setState(prevState => ({
        result: [...prevState.result, {AltID: altID, Name: name, Votes: votes}]
      }))
      that.state.result.sort((a, b) => (a.Votes < b.Votes) ? 1 : -1)
      if(that.state.result.length > 0) {
      that.setState({winner: {Name: that.state.result[0].Name, Votes: that.state.result[0].Votes}})
      }
      if(that.state.result.length > 1){
        that.setState({second: {Name: that.state.result[1].Name, Votes: that.state.result[1].Votes}})
      }
      if(that.state.result.length > 2){
          that.setState({third: {Name: that.state.result[2].Name, Votes: that.state.result[2].Votes}})
      }
    })
  }
  })
}

    saveResult() {
      var docRef = this.db.collection('Users').doc(this.userID).collection('Result').doc(this.voteID)
      docRef.update({
        Saved: true
      })
      this.props.navigation.navigate('SavedResult')
    }

    deleteResult() {
      var that = this;
      var docRef = this.db.collection('Users').doc(this.userID).collection('Result').doc(this.voteID)
      docRef.collection('Alternatives').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const id = doc.id
          docRef.collection('Alternatives').doc(id).delete().then(function() {
            console.log("delete alternatives ");
          }).catch(function(error) {
            console.error("delete alternatives ", error);
          });
        });
      });
      docRef.delete().then(function() {
      }).catch(function(error) {
        console.error("delete vote ", error);
      });
      this.props.navigation.navigate('SavedResult')
    }

    checkSaved() {
      if(this.state.saved === false){
        return(
          <View style = {styles.buttonContainer}>
          <TouchableOpacity
          style = {styles.saveResult}
          underlayColor='#fff'
          onPress={() => Alert.alert(
            data.deleteResult,
            `${data.sureMsg}?` ,
            [
              {text: data.cancel, onPress: () => this.props.navigation.navigate('ResultScreen')},
              {text: data.ok, onPress: () => this.deleteResult()},
            ],
            { cancelable: false })}>
            <Text style= {styles.saveResultText}>{data.delete} </Text>
            </TouchableOpacity>

            <TouchableOpacity
            style = {styles.saveResult}
            underlayColor='#fff'
            onPress={() => this.saveResult()}>
            <Text style= {styles.saveResultText}>{data.save}</Text>
            </TouchableOpacity>
            </View>
          )
        }
        else if(this.state.saved === true){
          return(
            <View style={styles.buttonBottomContainer}>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SavedResult')}
            >
            <Icon
            name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
            size={55}
            color="#A9A9A9"/>
            </TouchableOpacity>
            <TouchableOpacity
            style = {styles.deleteButton}
            onPress={() => this.deleteResult()}>
            <Text style={styles.deleteText}>{data.delete}</Text>
            </TouchableOpacity>
            </View>
          )
        }
      }
      render() {
        return (
          <View style={styles.container}>
          <Image source={require('../assets/images/medal.png')} style={styles.medalPic}/>
          <Text style={styles.resultLabel}>{data.result.toUpperCase()}</Text>
          <View style={styles.firstContainer}>
          <View style={styles.trophyIcon}>
          <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
          size={40}
          color='#daa520'/>
          </View>
          <Text style={styles.containText}>{this.state.winner.Name}</Text>
          <View style={styles.result}>
          <Text style={styles.likesText1}>{this.state.winner.Votes}</Text>
          </View>
          </View>

          <View style={styles.secondContainer}>
          <View style={styles.trophyIcon}>
          <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
          size={40}
          color='#c0c0c0'/>
          </View>
          <Text style={styles.containText}>{this.state.second.Name}</Text>
          <View style={styles.result}>
          <Text style={styles.likesText2}>{this.state.second.Votes}</Text>
          </View>
          </View>

          <View style={styles.thirdContainer}>
          <View style={styles.trophyIcon}>
          <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
          size={40}
          color='#a0522d'/>
          </View>
          <Text style={styles.containText}>{this.state.third.Name}</Text>
          <View style={styles.result}>
          <Text style={styles.likesText3}>{this.state.third.Votes}</Text>
          </View>

          </View>
          {this.checkSaved()}
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
        borderColor: 'white',
        margin: 5
      },
      result: {
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
        borderColor: 'white',
        margin: 5,
        fontSize: 30,
        borderWidth:1,
        borderColor:'black'
      },
      likesText1: {
        justifyContent:'center',
        alignItems:'center',
        alignSelf: 'center',
        textAlign:'center',
        alignSelf: 'center',
        color: '#daa520',
        fontSize: 30,

      },
      likesText2: {
        justifyContent:'center',
        alignItems:'center',
        alignSelf: 'center',
        textAlign:'center',
        alignSelf: 'center',
        color: '#c0c0c0',
        fontSize: 30,

      },
      likesText3: {
        justifyContent:'center',
        alignItems:'center',
        alignSelf: 'center',
        textAlign:'center',
        alignSelf: 'center',
        color: '#a0522d',
        fontSize: 30,

      },
      buttonContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
        //width: 100,
        marginTop:20,
        marginLeft: 10,
        marginRight: 10,

      },
      deleteResult:{
        justifyContent: 'center',
        width: 130,
        height: 70,
        margin: 10,
        padding: 10,
        //marginTop:100,
        backgroundColor:'#6BCDFD',
        borderRadius:20,
        borderWidth: 1,
        borderColor: '#fff'
      },
      saveResult: {
        justifyContent: 'center',
        width: 130,
        height: 70,
        margin: 10,
        padding: 10,
        backgroundColor:'#BA55B3',
        borderRadius:20,
        borderColor: '#fff',
        shadowColor: 'grey',
        shadowOpacity: 2,
        shadowRadius: 2,
        shadowOffset: {width: 0,height: 4},
      },
      saveResultText:{
        fontSize:20,
        textAlign:'center',
        alignItems:'center',
        color: 'white',
      },
      deleteButton:{
        backgroundColor: "#6BCDFD",
        width: 150,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        shadowColor: 'grey',
        shadowOpacity: 2,
        shadowRadius: 2,
        shadowOffset: {width: 0,height: 4},

      },
      deleteText:{
        fontSize:20,
        color:'white',
        fontFamily: "Roboto-Light",
      },
      buttonBottomContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
        width: 350,
        marginTop:50

      },
    });
