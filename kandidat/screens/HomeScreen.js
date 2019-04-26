import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
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
        onPress={() => this.props.navigation.navigate('NewVote')}
        underlayColor='#fff'>
        <Text style={styles.buttonText}>{data.createNewVote}</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.ongoingVote}
        onPress={() => this.props.navigation.navigate('OngoingVote')}
        underlayColor='#fff'>
        <Text style={styles.buttonText}>{data.ongoingVotes}</Text>
        </TouchableOpacity>
        </View>

        <LinearGradient
        colors={['#FFFFFF', '#6ACCCB']}
        style={{ height: '35%'}}>
        </LinearGradient>

        </View>
      );
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      justifyContent:'center'
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 40,
      // marginHorizontal: 50,

    },
    createVote: {
      width: 300,
      height: 150,
      marginBottom:20,
      padding: 10,
      backgroundColor: '#BA55B3',
      borderRadius:50,
      justifyContent:'center',
    },
    buttonText:{
      fontFamily: "Roboto-Light",
      color:'#fff',
      fontSize: 40,
      textAlign:'center',
      paddingLeft : 1,
      paddingRight : 1

    },
    ongoingVote:{
      width: 300,
      height: 150,
      marginTop: 20,
      padding: 10,
      backgroundColor:'#6BCDFD',
      borderRadius:50,
      justifyContent:'center'
    },
    logo: {
      color: '#FF7F50',
      fontSize: 50,
      fontFamily: 'Cochin',
    },
    logoPic: {
      width: 10,
      height: 10,
    },
    button: {
      position: 'absolute',
      top: 50,
      left: 0,
      width: 150,
      height: 50,
      backgroundColor: '#f39c12',
      alignItems: 'center',
      justifyContent: 'center'
    },
  });
