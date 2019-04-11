import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  Alert
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';

export default class AlternativeScreen extends React.Component {
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
          size={40}
          color='#FFFFFF'/>
          </TouchableOpacity>
        ),
      };
    };

    render() {
      return (
        <View style={styles.container}>
        <View style={styles.userNameContainer}>
        <Text style={styles.userNameText}>AlternativeScreen NU</Text>
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
    profilePic: {
      height: 150,
      width: 150,
      borderRadius: 75,
      borderWidth: 2,
      borderColor: '#689999',
    },
    userNameContainer: {
      width: 350,
      height: 70,
      backgroundColor: '#94B4C1',
      //alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      marginTop: 20,
      marginBottom: 5,
      padding: 10,
    },
    userNameText: {
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 20,
    },
    emailContainer: {
      flexDirection:'row',
      width: 350,
      height: 70,
      backgroundColor: '#8FBC8F',
      justifyContent: 'center',
      borderRadius: 30,
      margin: 5,
      padding: 10,
    },
    emailText: {
      flexGrow: 1,
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 20,
      alignSelf: 'center',
    },
    passwordContainer: {
      flexDirection:'row',
      width: 350,
      height: 70,
      backgroundColor: '#6ACCCB',
      justifyContent: 'center',
      borderRadius: 30,
      margin: 5,
      padding: 10,
    },
    passwordText: {
      flexGrow: 1,
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 20,
      alignSelf: 'center',
    },
    profilePicContainer: {
      flexDirection:'row',
      width: 350,
      height: 70,
      backgroundColor: '#CBA3D5',
      justifyContent: 'center',
      borderRadius: 30,
      margin: 5,
      padding: 10,
    },
    profilePicText: {
      flexGrow: 1,
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 20,
      alignSelf: 'center',
    },
    changeIcon: {
      //flexBasis: 50,
      //justifyContent: 'flex-end',
      alignSelf: 'center',
      color: '#FFFFFF',
      paddingRight: 20,
    },
  });
