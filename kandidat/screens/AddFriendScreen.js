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

export default class AddFriendsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: ''
    }
  }
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
  onPress={() => navigation.navigate('Friends')}
>
<Icon
  name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
  size={50}
  color='#FFFFFF'/>
</TouchableOpacity>
        ),
      };
    };

saveNewFriend() {
 var index = this.props.navigation.state.params.currentRows.length
 var newIDnum = parseInt(this.props.navigation.state.params.currentRows[index-1].id, 10) + 1
 var newID = newIDnum.toString()
 var newFriend = {id: newID, text: this.state.text, img: require('../assets/images/robot-dev.png')}
 this.props.navigation.state.params.currentRows.push(newFriend)
 this.props.navigation.navigate('Friends')
 }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.descriptionText}>{data.friendUsername}</Text>
      <TextInput
      style={styles.textInfo}
      placeholder="Friends user name"
      onChangeText={(text) => this.setState({text})}
      />
      <TouchableOpacity
      style = {styles.saveButton}
        onPress={() => this.saveNewFriend()}
        >
        <Text style={styles.saveText}>Save</Text>
       </TouchableOpacity>
       </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    textAlign:'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInfo: {
    backgroundColor: '#6BCDFD',
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
    fontSize: 30,
    fontFamily: 'Roboto-Light',
  },
});
