import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Header,
} from 'react-native';
import { WebBrowser, LinearGradient } from 'expo';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';
import * as firebase from 'firebase';

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
  this.state = {
    notificationOngoingVotes: false,
    notificationRequests: false,
    notificationResults: false,
  }
  this.getnotificationOngoingVotes()
  this.getnotificationRequests()
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

    getnotificationOngoingVotes() {
      var that = this
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      db.collection('Users').doc(userID)
       .get().then(
       doc => {
         if (doc.exists) {
           db.collection('Users').doc(userID).collection('Votes').where("Finished", "==", "No").get().
             then(sub => {
               if (sub.docs.length > 0) {
                 that.setState({
                   notificationOngoingVotes: true,
                 })
               }
             });
         }
       });
    }

    showNotificationOngoingVotes() {
      if(this.state.notificationOngoingVotes === true) {
        return(
        <Icon style={{ position: 'absolute', top: 320, left: 240 }}
                name={Platform.OS === "ios" ? "ios-notifications" : "md-notifications-outline"}
                size={40}
                color='#EB2C2C'/>)
      }
    }

    getnotificationRequests() {
      var that = this
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      db.collection('Users').doc(userID)
       .get().then(
       doc => {
         if (doc.exists) {
           db.collection('Users').doc(userID).collection('VoteRequests').get().
             then(sub => {
               if (sub.docs.length > 0) {
                 that.setState({
                   notificationRequests: true,
                 })
               }
             });
         }
       });
       db.collection('Users').doc(userID)
        .get().then(
        doc => {
          if (doc.exists) {
            db.collection('Users').doc(userID).collection('FriendRequests').get().
              then(sub => {
                if (sub.docs.length > 0) {
                  that.setState({
                    notificationRequests: true,
                  })
                }
              });
          }
        });
    }

    showNotificationRequests() {
      if(this.state.notificationRequests === true) {
        return(
        <Icon style={{ position: 'absolute' }}
                name={Platform.OS === "ios" ? "ios-notifications" : "md-notifications-outline"}
                size={40}
                color='#EB2C2C'/>)
      }
    }

    render() {
      return (
        <View style={styles.container}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={styles.createVote}
        onPress={() => this.props.navigation.navigate('NewVote')}>
        <Text style={styles.buttonText}>{data.createNewVote}</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.ongoingVote}
        onPress={() => this.props.navigation.navigate('OngoingVote')}>
        <Text style={styles.buttonText}>{data.ongoingVotes}
        {this.showNotificationOngoingVotes()}
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.ongoingRequest}
        onPress={() => this.props.navigation.navigate('RequestScreen')}>
        <Text style={styles.buttonText}> {data.requests}
        {this.showNotificationRequests()}
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.resultsButt}
        onPress={() => this.props.navigation.navigate('SavedResult')}>
        <Text style={styles.buttonText}> {data.results}  <Icon style={{ position: 'absolute', top: 320, left: 240 }}
        name={Platform.OS === "ios" ? "ios-notifications" : "md-notifications-outline"}
        size={40}
        color='#EB2C2C'/></Text>
        </TouchableOpacity>
        </View>

        <LinearGradient
        colors={['#FFFFFF', '#6ACCCB', '#6ACCCB']}
        style={{ height: '30%', zIndex: -10}}>
        </LinearGradient>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:'center'
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
    },
    buttonText:{
      fontFamily: "Roboto-Light",
      color:'#fff',
      fontSize: 32,
      textAlign:'center',
    },
    createVote: {
      width: 300,
      height: 100,
      marginTop: 80,
      marginBottom:10,
      padding: 10,
      backgroundColor: '#BA55B3',
      borderRadius:50,
      justifyContent:'center',
    },
    ongoingVote:{
      width: 300,
      height: 100,
      marginTop: 10,
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#6BCDFD',
      borderRadius:50,
      justifyContent:'center'
    },
    ongoingRequest: {
      width: 300,
      height: 100,
      marginTop: 10,
      padding: 10,
      marginBottom: 10,
      backgroundColor:'#8FBC8F',
      borderRadius:50,
      justifyContent:'center'
    },
    resultsButt: {
      width: 300,
      height: 100,
      marginTop: 10,
      padding: 10,
      marginBottom: 10,
      backgroundColor:'#94B4C1',
      borderRadius:50,
      justifyContent:'center'
    }
  });
