import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  FlatList,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';

const rows = [
  {id: '0', text: 'Test0', img: require('../assets/images/emil.jpg')},
  {id: '1', text: 'Test1', img: require('../assets/images/robot-dev.png')},
{id: '2', text: 'Test2', img: require('../assets/images/robot-prod.png')},
{id: '3', text: 'Test3', img: require('../assets/images/emil.jpg')},
{id: '4', text: 'Test4', img: require('../assets/images/robot-dev.png')},
{id: '5', text: 'Test5', img: require('../assets/images/robot-prod.png')},
{id: '6', text: 'Test6', img: require('../assets/images/emil.jpg')},
{id: '7', text: 'Test7', img: require('../assets/images/robot-prod.png')},
{id: '8', text: 'Test8', img: require('../assets/images/robot-dev.png')},
]

const colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']

const extractKey = ({id}) => id

export default class FriendsScreen extends React.Component {
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

renderItem = ({item, index}) => {
  return (
    <ListItem
    containerStyle={{ backgroundColor: colors[index % colors.length]}}
    titleStyle={{color: '#FFFFFF'}}
    roundAvatar
    title={item.text}
    leftAvatar = {{source: item.img }}/>)
}

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.friendLabel}>{data.friends}</Text>
      <TouchableOpacity
                style={styles.addFriendsContainer}
                onPress={() => this.props.navigation.navigate('NewCategory')}
                underlayColor='#fff'>
                <Text style={styles.addFriendsText}>{data.addFriend} <Icon
                  name={Platform.OS === "ios" ? "ios-person-add" : "md-add-person-add"}
                  size={25}
                /></Text>
       </TouchableOpacity>
       <View style={styles.myFriendsContainer}>
     <Text style={styles.myFriendsText}>{data.myFriends}</Text>
     </View>
     <FlatList
data={rows}
renderItem={this.renderItem}
keyExtractor={extractKey}
/>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#FFFFFF',
  },
  friendLabel: {
    fontSize: 50,
    color: '#000000',
    textAlign: 'center',
    fontFamily: "Roboto-Light",
  },
  addFriendsContainer: {
    justifyContent: 'center',
    width: 350,
    height: 70,
    margin: 10,
    padding: 10,
    backgroundColor:'#BA55B3',
    borderRadius:30,
    borderWidth: 1,
    borderColor: '#fff'
  },
  addFriendsText: {
    fontFamily: "Roboto-Light",
    color:'#fff',
    fontSize: 25,
    textAlign:'center',
    paddingLeft : 1,
    paddingRight : 1,
  },
  myFriendsContainer: {
    marginTop: 40,
    textAlign: 'center',
    alignItems: 'center',
  },
  myFriendsText: {
    fontFamily: "Roboto-Light",
    color: '#000000',
    fontSize: 25,
  },
  row: {
  fontFamily: "Roboto-Light",
  color: '#FFFFFF',
  padding: 15,
  marginBottom: 5,
  fontSize: 20,
  justifyContent: 'center',
},
});
