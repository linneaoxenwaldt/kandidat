import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  TextInput,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';

export default class ChangeEmailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: (
      <Image source={require('../assets/images/100whitte.png')}/>),
      headerStyle: {
        backgroundColor: '#008080',
        height: 70,
        marginLeft: 10,
        },
      };
    };

  render() {
    return (
      <View style={styles.container}>
      <View style={styles.emailInfoContainer}>
      <Text style={styles.descriptionText}>{data.currentEmail}</Text>
      <TextInput
      style={styles.textInfo}
      backgroundColor='#94B4C1'
      placeholder="Email"/>
      <Text style={styles.descriptionText}>{data.newEmail}</Text>
      <TextInput
      style={styles.textInfo}
      backgroundColor='#8FBC8F'
      placeholder="New email"/>
      <Text style={styles.descriptionText}>{data.confirmEmail}</Text>
      <TextInput
      style={styles.textInfo}
      backgroundColor='#6ACCCB'
      placeholder="New email"/>
      </View>
      <View style={styles.buttonBottomContainer}>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Profile')}
        >
        <Icon
        name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
        size={70}
        color='#000000'/>
</TouchableOpacity>
<TouchableOpacity
  onPress={() => this.props.navigation.navigate('ChangeEmail')}
  >
  <Icon
  name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
  size={70}
  color='#000000'/>
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
  emailInfoContainer: {
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
  },
  textInfo: {
    fontSize: 30,
    textAlign:'center',
    alignItems: 'center',
    width: 350,
    height: 70,
    //backgroundColor: '#8FBC8F',
    borderRadius: 30,
    marginBottom: 10,
    padding: 10,
    color: '#FFFFFF',
  },
  descriptionText: {
    marginTop:20,
    textAlign:'center',
    fontSize: 30,
    fontFamily: 'Roboto-Light',
    color: '#000000',
  },
  buttonBottomContainer: {
    flexDirection:'row',
    justifyContent: 'space-between',
    width: 340,
  },
});
