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
import { WebBrowser } from 'expo';
import { DrawerNavigator, NavigationActions, DrawerActions } from 'react-navigation';
import { MonoText } from '../components/StyledText';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';
import { LinearGradient } from 'expo';

export default class HomeScreen extends React.Component {
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

    render() {

      const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };
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
        <Text style={styles.buttonText}>{data.ongoingVotes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.ongoingRequest}
        onPress={() => this.props.navigation.navigate('RequestScreen')}>
        <Text style={styles.buttonText}> {data.requests} </Text>
        </TouchableOpacity>
        </View>

        <Icon style={{ position: 'absolute', top: 320, left: 240 }}
        name={Platform.OS === "ios" ? "ios-notifications" : "md-notifications-outline"}
        size={40}
        color='red'/>

        <LinearGradient
        colors={['#FFFFFF', '#6ACCCB', '#6ACCCB']}
        style={{ height: '30%'}}>
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
      width: 250,
      height: 100,
      marginTop: 40,
      marginBottom:20,
      padding: 10,
      backgroundColor: '#BA55B3',
      borderRadius:50,
      justifyContent:'center',
    },
    ongoingVote:{
      width: 250,
      height: 100,
      marginTop: 20,
      marginBottom: 20,
      padding: 10,
      backgroundColor: '#6BCDFD',
      borderRadius:50,
      justifyContent:'center'
    },
    ongoingRequest: {
      width: 250,
      height: 100,
      marginTop: 20,
      padding: 10,
      backgroundColor:'#A9A9A9',
      borderRadius:50,
      justifyContent:'center'
    },
    notification: {
      paddingLeft: 180,
    }

  });
