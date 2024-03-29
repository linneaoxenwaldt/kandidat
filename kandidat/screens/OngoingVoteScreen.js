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
    this.extractKey1 = ({VoteID}) => VoteID
    this.extractKey2 = ({VoteID}) => VoteID
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    this.userID = this.user.uid;
    this.state = {
      yourTurn: [],
      yourFriendsTurn: [],
      notification: false,
      pendingArray : [],
      finishedArray : [],
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
      this.db.collection("Users").doc(this.userID).collection("Votes").where("Finished", "==", "No").onSnapshot(function(querySnapshot) {
        that.setState({ yourTurn: []})
            querySnapshot.forEach(function(doc) {
                const name = doc.get('CatName');
                const img = doc.get('CatImg');
                that.setState(prevState => ({
                  yourTurn: [...prevState.yourTurn, {VoteID: doc.id, CatName: name, CatImg: img}],
                }))
            });
        });}

    getYourFriendsTurn() {
      var that = this
      this.db.collection("Users").doc(this.userID).collection("PendingVotes").onSnapshot(function(querySnapshot)
      {
        that.setState({ pendingArray: [], yourFriendsTurn : []})
            querySnapshot.forEach(function(doc)
            {
                const name = doc.get('CatName');
                const img = doc.get('CatImg');
                that.setState(prevState => (
                  {
                  pendingArray: [...prevState.pendingArray, {VoteID: doc.id, CatName: name, CatImg: img}],
                  //yourFriensTurn : [...that.state.pendingArray,...that.state.finishedArray]
                }))

            });
            that.setState({
              yourFriendsTurn : [...that.state.pendingArray,...that.state.finishedArray]
            })
        });

        this.db.collection("Users").doc(this.userID).collection("Votes").where("Finished", "==", "Yes").onSnapshot(function(querySnapshot) {
          that.setState({ finishedArray: [],yourFriendsTurn : []})
          querySnapshot.forEach(function(doc) {
            const name = doc.get('CatName');
            const img = doc.get('CatImg');
            that.setState(prevState => ({
              finishedArray: [...prevState.finishedArray, {VoteID: doc.id, CatName: name, CatImg: img}],
              //yourFriensTurn : [...that.state.finishedArray, ...that.state.pendingArray]
            }))

          });
          that.setState({
            yourFriendsTurn : [...that.state.finishedArray,...that.state.pendingArray]
          })
        });
      }


      renderItem1 = ({item, index}) => {
        return (
          <TouchableOpacity
          onPress={() => this.props.navigation.navigate('VoteScreen', {VoteID: item.VoteID})}>
          <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
          <ListItem
          containerStyle={{ backgroundColor: 'transparent'}}
          titleStyle={{color: '#FFFFFF', fontSize: 30}}
          title={item.CatName}
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
          titleStyle={{color: '#FFFFFF', fontSize: 30}}
          title={item.CatName}
          />
          </ImageBackground>
        )
      }

      render() {
        return (
          <View style={styles.container}>
          <View style={styles.voteActContainer}>
          <Text style={styles.ongoingVotesLabel}>{data.labelOngoing.toUpperCase()}</Text>
          <Text style={styles.voteLabel}>
          {data.yourTurn}
          </Text>
          <View
          style={{
            borderBottomColor: '#94B4C1',
            borderBottomWidth: 3
          }}
          />
          <FlatList
          extraData={this.state}
          data={this.state.yourTurn}
          renderItem={this.renderItem1}
          keyExtractor={this.extractKey1}
          />
          </View>

          <View style={styles.votePenContainer}>

          <Text style={styles.voteLabel}>
          {data.yourFriendsTurn}
          </Text>

          <View style={{
            borderBottomColor: '#94B4C1',
            borderBottomWidth: 3,
          }}
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
      voteActContainer: {
        marginTop: 5,
        height:300,
      },
      votePenContainer: {
        marginTop: 10,
        paddingBottom: 50,
        height: 300,
      },
    });
