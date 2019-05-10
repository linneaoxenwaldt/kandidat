import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  FlatList,
  Text,
  ImageBackground,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import { ListItem } from 'react-native-elements';
import data from '../data/engWord.json';
import * as firebase from 'firebase';

export default class OngoingVoteScreen extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    //   const rows = [
    //   {id: '0', text: 'Test0', expdate: '12h', turn: true},
    //   {id: '1', text: 'Test1', expdate: '4h 2m', turn: false},
    //   {id: '2', text: 'Test2', expdate: '56m', turn: true},
    //   {id: '3', text: 'Test3', expdate: '33s', turn: true},
    //   {id: '4', text: 'Test4', expdate: '4m', turn: false},
    //   {id: '5', text: 'Test5', expdate: '14h 57m', turn: true},
    //   {id: '6', text: 'Test6', expdate: '3v', turn: false},
    //   {id: '7', text: 'Test7', expdate: '57m', turn: true},
    //   {id: '8', text: 'Test8', expdate: '33v', turn: true},
    // ]
    this.extractKey1 = ({VoteID}) => VoteID
    this.extractKey2 = ({VoteID}) => VoteID
    this.state = {
      // rows: rows,
      yourTurn: [],
      yourFriendsTurn: [],
      notification: false,
    }
    this.getYourFriendsTurn()
    this.getYourTurn()
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

    getYourTurn() {
      var that = this
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      db.collection("Users").doc(userID).collection("Votes").where("Finished", "==", "No").onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id)
                const name = doc.get('CatName');
                const img = doc.get('CatImg');
                that.setState(prevState => ({
                  yourTurn: [...prevState.yourTurn, {VoteID: doc.id, CatName: name, CatImg: img}]
                }))
            });
        });}

    getYourFriendsTurn() {
      var that = this
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      db.collection("Users").doc(userID).collection("PendingVotes").onSnapshot(function(querySnapshot)
      {
            querySnapshot.forEach(function(doc)
            {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id)
                const name = doc.get('CatName');
                const img = doc.get('CatImg');
                that.setState(prevState => (
                  {
                  yourFriendsTurn: [...prevState.yourFriendsTurn, {VoteID: doc.id, CatName: name, CatImg: img}]
                }))
            });
        });

        db.collection("Users").doc(userID).collection("Votes").where("Finished", "==", "Yes").get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                  //console.log(doc.id)
                  const name = doc.get('CatName');
                  const img = doc.get('CatImg');
                  that.setState(prevState => ({
                    yourFriendsTurn: [...prevState.yourFriendsTurn, {VoteID: doc.id, CatName: name, CatImg: img}]
                  }))
              });
          });
        }



    renderItem1 = ({item, index}) => {
      return (
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('VoteScreen', {VoteID: item.VoteID})}>
        <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
        <ListItem
        containerStyle={{ backgroundColor: 'transparent'}}
        //  containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 30}}
        title={item.CatName}
        //rightSubtitle={item.expdate}
        />
        </ImageBackground>
        </TouchableOpacity>
      )
    }

    renderItem2 = ({item, index}) => {
      return (
        <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
        <ListItem
        containerStyle={{ backgroundColor: 'transparent'}}
        //  containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 30}}
        title={item.CatName}
        //rightSubtitle={item.expdate}
        />
        </ImageBackground>
      )
    }

    render() {
      return (
        <View style={styles.container}>
        <View style={styles.voteActContainer}>
        <Text style={styles.ongoingVotesLabel}>{data.ongoingVotes}</Text>
        <Text style={styles.voteLabel}>
        {data.yourTurn}
        </Text>
        <View
        style={{
          borderBottomColor: '#94B4C1',
          borderBottomWidth: 3 }}
          />
          <FlatList
          extraData={this.state}
          data={this.state.yourTurn}
          renderItem={this.renderItem1}
          keyExtractor={this.extractKey1}
          />
          </View>


          <View style={styles.votePenContainer}>

          <Text style={styles.voteLabelFriend}>
          {data.yourFriensTurn}
          </Text>
          <View
          style={{
            borderBottomColor: '#94B4C1',
            borderBottomWidth: 3 }}
            />
            <FlatList
            extraData={this.state}
            data={this.state.yourFriendsTurn}
            renderItem={this.renderItem2}
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
          paddingTop: 15,
          backgroundColor: '#FFFFFF',
        },
        voteActContainer: {
          marginTop: 5,
          height:'50%',
        },
        votePenContainer: {
          marginTop: 10,
          height: '75%',

        },
        ongoingVotesLabel: {
          fontSize: 40,
          color: '#000000',
          textAlign: 'center',
          fontFamily: "Roboto-Light",
          marginBottom: 30,
        },
        voteLabel: {
          fontSize: 30,
          color: '#000000',
          textAlign: 'center',
          fontFamily: "Roboto-Light",
        },
        voteLabelFriend: {
          //height: '60%',
          //position:'absolute',
          fontSize: 30,
          color: '#000000',
          textAlign: 'center',
          fontFamily: "Roboto-Light",
        },
      });
