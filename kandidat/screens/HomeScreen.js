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


export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Image source={require('../assets/images/100whitte.png')}/>),
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
          size={40}/>
          </TouchableOpacity>
        ),
      };
    };

    render() {
      return (
        <View style={styles.container}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={styles.createVote}
        onPress={() => this.props.navigation.navigate('NewVote')}
        underlayColor='#fff'>
        <Text style={styles.buttonText}>Create new vote</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.ongoingVote}
        onPress={() => this.props.navigation.navigate('OngoingVote')}
        underlayColor='#fff'>
        <Text style={styles.buttonText}>On going votes</Text>
        </TouchableOpacity>
        </View>
        </View>
      );
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    buttonContainer: {
      alignItems: 'center',
      marginHorizontal: 50,
    },
    createVote: {
      width: 350,
      height: 200,
      margin:10,
      padding: 10,
      backgroundColor: '#BA55B3',
      borderRadius:50,
      borderWidth: 1,
      borderColor: '#fff',
    },
    buttonText:{
      fontFamily: "Roboto-Light",
      color:'#fff',
      fontSize: 70,
      textAlign:'center',
      paddingLeft : 1,
      paddingRight : 1
    },
    ongoingVote:{
      width: 350,
      height: 200,
      margin: 10,
      padding: 10,
      backgroundColor:'#6BCDFD',
      borderRadius:50,
      borderWidth: 1,
      borderColor: '#fff'
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
