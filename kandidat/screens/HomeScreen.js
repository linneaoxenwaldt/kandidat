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
import LinksScreen from '../screens/LinksScreen';
import Icon from "react-native-vector-icons/Ionicons";


export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: (
      <Image source={require('../assets/images/100whitte.png')}/>),
      headerStyle: {
        backgroundColor: 'red',
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
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.getStartedContainer}>
            <TouchableOpacity
                      style={styles.createVote}
                      onPress={() => this.props.navigation.navigate('HomeScreen')}
                      underlayColor='#fff'>
                      <Text style={styles.loginText}>Create new vote</Text>
             </TouchableOpacity>
             <TouchableOpacity
                       style={styles.ongoingVote}
                       onPress={() => this.props.navigation.navigate('SettingsScreen')}
                       underlayColor='#fff'>
                       <Text style={styles.loginText}>On going votes</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000FF',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 0,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  logoImage: {
    width: 300,
    height: 80,
    resizeMode: 'contain',
    marginTop: 20,
    marginLeft: 0,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  createVote:{
  width: 350,
  height: 200,
  marginRight:10,
  marginLeft:10,
  marginTop:10,
  paddingTop:10,
  paddingBottom:10,
  paddingRight:10,
  paddingLeft:10,
  backgroundColor:'#1E6738',
  borderRadius:50,
  borderWidth: 1,
  borderColor: '#fff'
},
loginText:{
    color:'#fff',
    fontSize: 70,
    textAlign:'center',
    paddingLeft : 1,
    paddingRight : 1
},
ongoingVote:{
width: 350,
height: 200,
marginRight:10,
marginLeft:10,
marginTop:10,
paddingTop:10,
paddingBottom:10,
paddingRight:10,
paddingLeft:10,
backgroundColor:'#1E6738',
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
buttonText: {
  color: 'white'
}
});
