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
import * as firebase from 'firebase';

export default class ProfileScreen extends React.Component {
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

    constructor(props){
      super(props);
      this.state = {
        username: "",
        email: "",
      }
      this.getUser()
      }

      getUser() {
        var that = this
      var db = firebase.firestore();
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      console.log(user.uid)
      var docRef = db.collection('Users').doc(userID);
docRef.get().then(function(doc) {
    if (doc.exists) {
        that.setState({username: doc.data().Username, email : doc.data().Email})
        console.log("Document data:", that.state.username);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
    }

    render() {
      return (
        <View style={styles.container}>
        <Image source={require('../assets/images/emil.jpg')} style={styles.profilePic}/>
        <View style={styles.userNameContainer}>
        <Text style={styles.userNameText}>{this.state.username}</Text>
        </View>
        <View style={styles.emailContainer}>
        <Text style={styles.emailText}>{this.state.email}</Text>
        <TouchableOpacity
        style={styles.changeIcon}
        onPress={() => this.props.navigation.navigate('ChangeEmail')}>
        <Icon name={Platform.OS === "ios" ? "ios-create" : "md-create"}
        size={30}
        color='#FFFFFF'/>
        </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
        <Text style={styles.passwordText}>{data.changePassword}</Text>
        <TouchableOpacity
        style={styles.changeIcon}
        onPress={() => this.props.navigation.navigate('ChangePassword')}>
        <Icon name={Platform.OS === "ios" ? "ios-create" : "md-create"}
        size={30}
        color='#FFFFFF'/>
        </TouchableOpacity>
        </View>
        <View style={styles.profilePicContainer}>
        <Text style={styles.profilePicText}>{data.changeProfilePic}</Text>
        <TouchableOpacity
        style={styles.changeIcon}
        onPress={() => this.props.navigation.navigate('NewVote')}>
        <Icon name={Platform.OS === "ios" ? "ios-create" : "md-create"}
        size={30}
        color='#FFFFFF'/>
        </TouchableOpacity>
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
