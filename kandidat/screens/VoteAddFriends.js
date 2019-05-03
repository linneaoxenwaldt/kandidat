import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  FlatList,
  Alert,
  TextInput,

} from 'react-native';
import { ListItem } from 'react-native-elements';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';
import CircleCheckBox from 'react-native-check-box';
import RoundCheckbox from 'rn-round-checkbox';
import DateTimePicker from "react-native-modal-datetime-picker";
import * as firebase from 'firebase';

// const rows = [
//   {id: '0', text: 'Test0', img: require('../assets/images/emil.jpg')},
//   {id: '1', text: 'Test1', img: require('../assets/images/robot-dev.png')},
// {id: '2', text: 'Test2', img: require('../assets/images/robot-prod.png')},
// {id: '3', text: 'Test3', img: require('../assets/images/emil.jpg')},
// {id: '4', text: 'Test4', img: require('../assets/images/robot-dev.png')},
// {id: '5', text: 'Test5', img: require('../assets/images/robot-prod.png')},
// {id: '6', text: 'Test6', img: require('../assets/images/emil.jpg')},
// {id: '7', text: 'Test7', img: require('../assets/images/robot-prod.png')},
// {id: '8', text: 'Test8', img: require('../assets/images/robot-dev.png')},
// ]
//
// const colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']

// const extractKey = ({id}) => id

export default class VoteAddFriends extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
  //   const rows = [
  //   {id: '0', text: 'Test0', img: require('../assets/images/emil.jpg')},
  //   {id: '1', text: 'Test1', img: require('../assets/images/robot-dev.png')},
  //   {id: '2', text: 'Test2', img: require('../assets/images/robot-prod.png')},
  //   {id: '3', text: 'Test3', img: require('../assets/images/emil.jpg')},
  //   {id: '4', text: 'Test4', img: require('../assets/images/robot-dev.png')},
  //   {id: '5', text: 'Test5', img: require('../assets/images/robot-prod.png')},
  //   {id: '6', text: 'Test6', img: require('../assets/images/emil.jpg')},
  //   {id: '7', text: 'Test7', img: require('../assets/images/robot-prod.png')},
  //   {id: '8', text: 'Test8', img: require('../assets/images/robot-dev.png')},
  // ]
  this.extractKey = ({id}) => id
  this.state = {
    friends: [],
    isDateTimePickerVisible: false,
    date: [] ,
  }
  this.getYourFriends()
  }

  static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: (
      <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/100whitte.png?alt=media&token=46064aae-8998-4a9e-81fe-0af7174862fa'}} style={{width: 200, height: 50}}/>),
      headerStyle: {
        backgroundColor: '#008080',
        height: 70,
        marginLeft: 10,
        },
//         headerLeft: (
//           <TouchableOpacity
//   onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
// >
// <Icon
//   name={Platform.OS === "ios" ? "ios-menu" : "md-menu"}
//   size={40}
//   color='#FFFFFF'/>
// </TouchableOpacity>
//         ),
      };
    };

  // deleteFriend(delItem) {
  //   this.setState(prevState => ({rows: prevState.rows.filter(item => item !== delItem) }));
  // }

  showDateTimePicker = () => {
  this.setState({ isDateTimePickerVisible: true });
};

hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({date});
   console.log("A date has been picked: ", date);
   this.hideDateTimePicker();


 };

 getYourFriends() {
   var that = this
   var user = firebase.auth().currentUser;
   var userID = user.uid;
   var db = firebase.firestore();
   db.collection("Users").doc(userID).collection("Friends").get().then(function(querySnapshot) {
       querySnapshot.forEach(function(doc) {
           // doc.data() is never undefined for query doc snapshots
           const id = doc.id;
           var docRef = db.collection('Users').doc(id);
           docRef.get().then(function(doc) {
             if (doc.exists) {
               const username = doc.data().Username
               const profilePic = doc.data().ProfilePic
               that.setState(prevState => ({
                 friends: [...prevState.friends, {id: id, username: username, profilePic: profilePic}]
               }))
               //console.log("Document data: 2");
             } else {
               // doc.data() will be undefined in this case
               console.log("No such document!");
             }
             }).catch(function(error) {
                 console.log("Error getting document:", error);
             });
           })
       });
   }

renderItem = ({item, index}) => {
  var msg = `${data.sureMsg} ${item.username}?`
  return (
    <ListItem
    containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
    titleStyle={{color: '#FFFFFF', fontSize: 25}}
    roundAvatar
    title={item.username}
    leftAvatar = {{source: {uri: item.profilePic}}}
    rightIcon = { <RoundCheckbox
      checked={this.state.isSelected}
      onPress={() => this.setState({checked: !this.state.checked})}
      onValueChange={(newValue) => {console.log(newValue)}}
      size={30}




/>

      }
    />)
}

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.friendLabel}>{data.invitefriends}</Text>


      <View style= {styles.buttonContainer}>
      <TouchableOpacity
                style={styles.addFriendsContainer}
                onPress={this.showDateTimePicker}
                underlayColor='#fff'>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                  mode={'time'}
                  titleIOS={'Pick a time'}

                />
                <Text style={styles.addFriendsText}>Expire date <Icon
                    name={Platform.OS === "ios" ? "ios-calendar" : "md-calendar"}
                    size={25}
                  /></Text>

                  <Text>{[this.state.date]}</Text>

       </TouchableOpacity>
       </View>
       <View style={styles.myFriendsContainer}>
     <Text style={styles.myFriendsText}>{data.myFriends}</Text>
     </View>
     <FlatList
data={this.state.friends}
renderItem={this.renderItem}
keyExtractor={this.extractKey}
/>

<View style={styles.buttonBottomContainer}>
<TouchableOpacity
  onPress={() => this.props.navigation.navigate('AlternativeScreen')}
  >
  <Icon
  name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
  size={55}
  color="#A9A9A9"/>
</TouchableOpacity>
<TouchableOpacity
onPress={() => this.props.navigation.navigate('RequestScreen')}
>
<Icon
name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
size={55}
color="#A9A9A9"/>
</TouchableOpacity>
</View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',

  },
  buttonContainer:{
    alignItems:'center',

  },

  friendLabel: {
    fontSize: 40,
    color: '#000000',
    textAlign: 'center',
    fontFamily: "Roboto-Light",
    margin: 20,
  },
  addFriendsContainer: {
    justifyContent: 'center',
    width: 350,
    height: 70,
    margin: 0,
    padding: 10,
    backgroundColor:'#BA55B3',
    borderRadius:50,
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
    marginTop: 0,
    textAlign: 'center',
    alignItems: 'center',
  },
  myFriendsText: {
    fontFamily: "Roboto-Light",
    color: '#000000',
    fontSize: 20,
    margin:20
  },
  row: {
  fontFamily: "Roboto-Light",
  color: '#FFFFFF',
  padding: 15,
  marginBottom: 5,
  fontSize: 20,
  justifyContent: 'center',
},
buttonBottomContainer: {
flexDirection:'row',
justifyContent: 'space-between',
//width: '100%',
marginLeft: 10,
marginRight: 10,
},
});
