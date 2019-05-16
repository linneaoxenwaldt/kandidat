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
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    this.userID = this.user.uid;
    this.state = {
      notificationOngoingVotes: false,
      notificationRequests: false,
      notificationResults: false,
    }
    this.getnotificationOngoingVotes()
    this.getnotificationRequests()
    this.getnotificationResults()
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

    getnotificationResults() {
      var that = this
      this.db.collection('Users').doc(this.userID)
       .get().then(
       doc => {
         if (doc.exists) {
           that.db.collection('Users').doc(that.userID).collection('Result').where("Saved", "==", false).onSnapshot(sub => {
               if (sub.docs.length > 0) {
                 that.setState({
                   notificationResults: true,
                 })
               }else {
                 that.setState({
                   notificationResults : false,
                 })
               }
             });
         }
       });
    }

    showNotificationResults() {
      if(this.state.notificationResults === true) {
        return(
        <Icon style={{ position: 'absolute', top: 320, left: 240 }}
                name={Platform.OS === "ios" ? "ios-notifications" : "md-notifications-outline"}
                size={40}
                color='#EB2C2C'/>)
      }
    }



    getnotificationOngoingVotes() {
      var that = this
      this.db.collection('Users').doc(this.userID)
       .onSnapshot(
       doc => {
         if (doc.exists) {
           that.db.collection('Users').doc(that.userID).collection('Votes').where("Finished", "==", "No").onSnapshot(sub => {
               if (sub.docs.length > 0) {
                 that.setState({
                   notificationOngoingVotes: true,
                 })
               }else{
                 that.setState({
                   notificationOngoingVotes: false,
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
      this.db.collection('Users').doc(this.userID).onSnapshot(
       doc =>
       {
         if (doc.exists)
         {
           that.db.collection('Users').doc(that.userID).collection('VoteRequests').get().
             then(sub =>
               {
               if (sub.docs.length > 0)
               {
                 that.setState(
                   {
                   notificationRequests: true,
                   })
               }else
               {
                 that.db.collection('Users').doc(that.userID).collection('FriendRequests').onSnapshot(sub =>
                   {
                     if (sub.docs.length > 0)
                     {
                       that.setState(
                         {
                         notificationRequests: true,
                         })
                     }else
               {
                 that.setState(
                   {
                   notificationRequests: false,
                   })
               }
             });
         }
       });
     }})
       this.db.collection('Users').doc(this.userID)
        .onSnapshot(
        doc => {
          if (doc.exists) {
            that.db.collection('Users').doc(that.userID).collection('FriendRequests').onSnapshot(sub => {
                if (sub.docs.length > 0) {
                  that.setState({
                    notificationRequests: true,
                  })
                }else {
                  that.db.collection('Users').doc(that.userID).collection('VoteRequests').onSnapshot(sub => {
                    if (sub.docs.length > 0) {
                      that.setState({
                        notificationRequests: true,
                      })
                    }else {
                      that.setState({
                        notificationRequests: false,
                      })
                    }
                }
              );
          }
        });
    }})}

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
                  <Text style={styles.buttonText}> {data.results}
                  {this.showNotificationResults()}
                  </Text>
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
