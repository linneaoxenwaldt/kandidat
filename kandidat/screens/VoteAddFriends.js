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
import { ListItem, CheckBox } from 'react-native-elements';
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
    choosenFriends: [],
    checked: [],
    //participants: [],
  }
  this.getYourFriends()
  //this.createVote()
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
   var localID = -1
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
               localID++
               // console.log("local" + localID)
               const username = doc.data().Username
               const profilePic = doc.data().ProfilePic
               that.setState(prevState => ({
                 friends: [...prevState.friends, {localID: localID, id: id, username: username, profilePic: profilePic}]
               }))
               that.setState(prevState => ({
                 checked: [...prevState.checked, false]
               }))
               // console.log(that.state.checked)
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

   createVote() {
     if (this.state.choosenFriends === []) {
       Alert.alert(
         data.missingFriends,
       )
     }
     var alternatives = this.props.navigation.state.params.alternatives
     var category = this.props.navigation.state.params.category
     var catName = category[0].catName
     var catImg = category[0].catImg
     var that = this
     var user = firebase.auth().currentUser;
     var userID = user.uid;
     var db = firebase.firestore();
     //console.log(this.state.choosenFriends)
db.collection("Users").doc(userID).collection("PendingVotes").add({
       CatName: catName,
       CatImg: catImg
     })
.then(function(docRef) {
   console.log("Document written with ID: ", docRef.id);
   that.createAlternatives(docRef.id, alternatives, userID)
})
.catch(function(error) {
   console.error("Error adding document: ", error);
});
   }

   createAlternatives(voteID, alternatives, userID) {
     var that = this
     var db = firebase.firestore();
     for(let i=0; i < alternatives.length; i++) {
       db.collection("Users").doc(userID).collection("PendingVotes").doc(voteID).collection("Alternatives").add({
         Name: alternatives[i].text,
         Votes: 0,
            })
       .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          that.getParticipants(voteID, userID)
          that.props.navigation.navigate('OngoingVote')
       })
       .catch(function(error) {
          console.error("Error adding document: ", error);
       });
     }
   }

   getParticipants(voteID, userID) {
     var db = firebase.firestore();
     for (let i=0; i<this.state.choosenFriends.length; i++) {
         db.collection("Users").doc(userID).collection("PendingVotes").doc(voteID).collection('Participants').doc(this.state.choosenFriends[i].id).set({
           Answer: ""
         })
     }
     this.sendVoteRequest(voteID, userID)
   }

   sendVoteRequest(voteID, userID) {
     var db = firebase.firestore();
     for (let i=0; i<this.state.choosenFriends.length; i++) {
       var friendID = this.state.choosenFriends[i].id
       db.collection("Users").doc(friendID).collection("VoteRequests").doc(voteID).set({
       SentFrom: userID,
       })
   for (let i=0; i<this.state.choosenFriends.length; i++) {
       db.collection("Users").doc(friendID).collection("VoteRequests").doc(voteID).collection('Participants').doc(this.state.choosenFriends[i].id).set({
         Answer: ""
       })
   }
 }
   }

   putInFriendsArray(changeItem) {
     var status = this.state.checked[changeItem.localID]
     if (status === true){
       this.setState(prevState => ({choosenFriends: prevState.choosenFriends.filter(item => item.localID !== changeItem.localID) }));
     } else if (status === false) {
       this.setState(prevState => ({
         choosenFriends: [...prevState.choosenFriends, {localID: changeItem.localID, id: changeItem.id, username: changeItem.username, profilePic: changeItem.profilePic}]
       }))
     }
     // console.log(localID)
     // console.log(this.state.checked)
  this.setState(state => {
    const checked = state.checked.map((item, j) => {
      if (j === changeItem.localID) {
        return !status;
      } else {
        return item;
      }
    });
    return {
      checked,
    };
  });
};


renderItem = ({item, index}) => {
  var msg = `${data.sureMsg} ${item.username}?`
  // console.log(this.state.checked)
  return (
    <ListItem
    containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
    titleStyle={{color: '#FFFFFF', fontSize: 25}}
    roundAvatar
    title={item.username}
    leftAvatar = {{source: {uri: item.profilePic}}}
    rightIcon = {<CheckBox
    style = {styles.checkbox}
      //title='Click Here'
    checkedIcon='check-circle'
    uncheckedIcon='circle-o'
    checkedColor='white'
    uncheckedColor='white'
    size = '35%'


    // checked = {true}
    checked={this.state.checked[item.localID]}
    onPress={() => this.putInFriendsArray(item)}
    />}


//     rightIcon = { <RoundCheckbox
//       checked={this.state.isSelected}
//       onPress={() => this.setState({checked: !this.state.checked})}
//       onPress={() => this.setState(prevState => ({
//         choosenFriends: [...prevState.choosenFriends, {id: item.id, username: item.username, profilePic: item.profilePic}]
//       }))}
//       onValueChange={(newValue) => {console.log(newValue)}}
//       size={30}
// />  }
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
     extraData={this.state}
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
style = {styles.sendButton}
onPress={() => this.createVote()}>
<Text style={styles.sendText}>Start Vote</Text>


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
sendButton:{
    backgroundColor: "#6BCDFD",
    width: 150,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom:10,
  },
  sendText:{
    fontSize:20,
    color:'white',
    fontFamily: "Roboto-Light",
  },
  checkbox:{
    margin: 10,

  }



});
