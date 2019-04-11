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
      placeholder="Password"/>
      <Text style={styles.descriptionText}>{data.newPassword}</Text>
      <TextInput
      style={styles.textInfo}
      backgroundColor='#8FBC8F'
      placeholder="New password"/>
      <Text style={styles.descriptionText}>{data.confirmPassword}</Text>
      <TextInput
      style={styles.textInfo}
      backgroundColor='#6ACCCB'
      placeholder="New password"/>
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
  onPress={() => this.props.navigation.navigate('ChangePassword')}
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
  passwordInfoContainer: {
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
