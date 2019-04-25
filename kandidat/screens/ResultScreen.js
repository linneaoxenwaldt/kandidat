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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class ResultScreen extends React.Component {
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
      return (
        <View style={styles.container}>
        <Image source={require('../assets/images/medal.png')} style={styles.medalPic}/>
        <Text style={styles.resultLabel}>Result</Text>

        <View style={styles.firstContainer}>
        <Text style={styles.firstText}>Alternativ 1</Text>
        <View style={styles.trophyIcon}>
        <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
        size={40}
        color='#daa520'/>
        </View>
        </View>

        <View style={styles.secondContainer}>
        <Text style={styles.secondText}>Alternativ 2</Text>
        <View style={styles.trophyIcon}>
        <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
        size={40}
        color='#c0c0c0'/>
        </View>
        </View>

        <View style={styles.thirdContainer}>
        <Text style={styles.thirdText}>Alternativ 3</Text>
        <View style={styles.trophyIcon}>
        <Icon name={Platform.OS === "ios" ? "ios-trophy" : "md-create"}
        size={40}
        color='#a0522d'/>
        </View>
        </View>

        <TouchableOpacity
                  style = {styles.saveResult}
                  //onPress={spara resultatet}
                  underlayColor='#fff'>
                  <Text style= {styles.saveResultText}> Save Result
                  </Text>
         </TouchableOpacity>
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
    medalPic: {
      height: 200,
      width: 200,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: 'white',
    },

    resultLabel:{
      fontFamily: 'Roboto-Light',
      color: 'black',
      fontSize: 40,
      padding: 20,
    },

    firstContainer: {
      flexDirection:'row',
      width: 350,
      height: 70,
      backgroundColor: '#8FBC8F',
      justifyContent: 'center',
      borderRadius: 30,
      margin: 5,
      padding: 10,
    },
    firstText: {
      textAlign: 'center',
      flexGrow: 1,
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 25,
      alignSelf: 'center',
    },
    secondContainer: {
      flexDirection:'row',
      width: 350,
      height: 70,
      backgroundColor: '#6ACCCB',
      justifyContent: 'center',
      borderRadius: 30,
      margin: 5,
      padding: 10,
    },
    secondText: {
      textAlign: 'center',
      flexGrow: 1,
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 25,
      alignSelf: 'center',
    },
    thirdContainer: {
      flexDirection:'row',
      width: 350,
      height: 70,
      backgroundColor: '#94B4C1',
      justifyContent: 'center',
      borderRadius: 30,
      margin: 5,
      padding: 10,
    },
    thirdText: {
      textAlign: 'center',
      flexGrow: 1,
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 25,
      alignSelf: 'center',
    },
    trophyIcon: {
      justifyContent:'center',
      alignItems:'center',
      alignSelf: 'center',
      textAlign:'center',
      backgroundColor: 'white',
      borderRadius:100,
      alignSelf: 'center',
      color: '#daa520',
      paddingRight: 0,
      height: 50,
      width: 50,
      borderWidth: 2,
      borderColor: 'white'

    },
    saveResult: {
      justifyContent: 'center',
      width: 200,
      height: 70,
      margin: 10,
      padding: 10,
      marginTop:100,
      backgroundColor:'#BA55B3',
      borderRadius:20,
      borderWidth: 1,
      borderColor: '#fff'
    },
    saveResultText:{
      fontSize:20,
      textAlign:'center',
      alignItems:'center',
      color: 'white',
    },
  });
