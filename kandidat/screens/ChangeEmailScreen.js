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
      <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/100whitte.png?alt=media&token=46064aae-8998-4a9e-81fe-0af7174862fa'}} style={{width: 200, height: 50}}/>),
      headerStyle: {
        backgroundColor: '#008080',
        height: 70,
        marginLeft: 10,
        },
        headerLeft: (
          <TouchableOpacity
  onPress={() => navigation.navigate('Profile')}
>
<Icon
  name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
  size={55}
  color='#FFFFFF'/>
</TouchableOpacity>
        ),
      };
    };

  render() {
    return (
      <View style={styles.container}>
      <View style={styles.emailInfoContainer}>
      <Text style={styles.descriptionText}>{data.currentEmail}</Text>
      <TextInput
      style={styles.textInfo}
      borderColor='#758e99'
      borderWidth= '4'
      backgroundColor='#94B4C1'
      placeholder="Email"/>
      <Text style={styles.descriptionText}>{data.newEmail}</Text>
      <TextInput
      style={styles.textInfo}
      backgroundColor='#8FBC8F'
      borderColor='#6f936f'
      borderWidth= '4'
      placeholder="New email"/>
      <Text style={styles.descriptionText}>{data.confirmEmail}</Text>
      <TextInput
      style={styles.textInfo}
      backgroundColor='#6ACCCB'
      borderColor='#5db3b2'
      borderWidth= '4'
      placeholder="New email"/>
      <TouchableOpacity
      style = {styles.saveButton}
        onPress={() => this.props.navigation.navigate('ChangeEmail')}
        >
        <Text style={styles.saveText}>{data.save}</Text>
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
    fontSize: 25,
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
  saveButton: {
    backgroundColor: "#BA55B3",
    width: 150,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 50,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontFamily: 'Roboto-Light',
  },
});
