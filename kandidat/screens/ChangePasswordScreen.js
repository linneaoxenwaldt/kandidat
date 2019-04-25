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
import { ExpoLinksView } from '@expo/samples';
import data from '../data/engWord.json';

export default class ChangePasswordScreen extends React.Component {
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
  onPress={() => navigation.navigate('Profile')}
>
<Icon
  name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
  size={50}
  color='#FFFFFF'/>
</TouchableOpacity>
        ),
      };
    };

  render() {
    return (
      <View style={styles.container}>
      <View style={styles.passwordInfoContainer}>
      <Text style={styles.descriptionText}>{data.currentPassword}</Text>
      <TextInput
      style={styles.textInfo}
      backgroundColor='#94B4C1'
      borderColor='#758e99'
      borderWidth= '4'
      placeholder="Password"/>
      <Text style={styles.descriptionText}>{data.newPassword}</Text>
      <TextInput
      style={styles.textInfo}
      backgroundColor='#8FBC8F'
      borderColor='#6f936f'
      borderWidth= '4'
      placeholder="New password"/>
      <Text style={styles.descriptionText}>{data.confirmPassword}</Text>
      <TextInput
      style={styles.textInfo}
      backgroundColor='#6ACCCB'
      borderColor='#5db3b2'
      borderWidth= '4'
      placeholder="New password"/>
<TouchableOpacity
style = {styles.saveButton}
  onPress={() => this.props.navigation.navigate('ChangePassword')}
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
  passwordInfoContainer: {
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
    fontSize: 25,
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
