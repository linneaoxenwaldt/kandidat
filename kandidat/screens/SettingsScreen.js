import React from 'react';
import * as firebase from 'firebase';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';

export default class SettingsScreen extends React.Component {
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

    constructor(props){
      super(props);
      this.state = {
      }
    }

    render() {
      return (
        <View style={styles.container}>
        <Text style={styles.infoLabel}>{data.info}</Text>
        <Text style={styles.infoText}>{data.infoText}</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => this.props.navigation.navigate('HomeScreen')}>
        <Text style={styles.startText}>{data.start}</Text>
        </TouchableOpacity>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 5,
      backgroundColor: '#FFFFFF',
      borderWidth: 5,
      borderColor: "#6ACCCB",
    },
    infoLabel: {
      fontSize: 40,
      color: '#000000',
      textAlign: 'center',
      fontFamily: "Roboto-Light",
      marginTop: 30,
    },
    infoText: {
      textAlign: 'center',
      fontFamily: "Roboto-Light",
      fontSize: 20,
      margin: 20,
    },
    startButton: {
      backgroundColor: "#BA55B3",
      width: 150,
      height: 70,
      borderRadius: 20,
      justifyContent: 'center',
      marginLeft: 100,
      marginBottom: 20,
      marginTop: 20,
    },
    startText: {
      color: "#FFFFFF",
      fontSize: 25,
      fontFamily: 'Roboto-Light',
      textAlign: 'center',
    },
  });
