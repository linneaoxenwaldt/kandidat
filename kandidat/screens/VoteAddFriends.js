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
  Modal,
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

export default class VoteAddFriends extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    this.extractKey = ({id}) => id
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    this.userID = this.user.uid;
    this.state = {
      friends: [],
      isDateTimePickerVisible: false,
      date: [] ,
      choosenFriends: [],
      checked: [],
      showMe: false,
      text: "",
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
      };
    };

    showDateTimePicker = () => {
      this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
      this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
      this.hideDateTimePicker();
    };

    getYourFriends() {
      var localID = -1
      var that = this
      this.db.collection("Users").doc(this.userID).collection("Friends").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const id = doc.id;
          var docRef = that.db.collection('Users').doc(id);
          docRef.get().then(function(doc) {
            if (doc.exists) {
              localID++
              const username = doc.data().Username
              const profilePic = doc.data().ProfilePic
              that.setState(prevState => ({
                friends: [...prevState.friends, {localID: localID, id: id, username: username, profilePic: profilePic}]
              }))
              that.setState(prevState => ({
                checked: [...prevState.checked, false]
              }))
            } else {
              console.log("No such document!");
            }
          }).catch(function(error) {
            console.log("Error getting document:", error);
          });
        })
      });
    }

    createVote() {
      var check = []
      if (this.state.choosenFriends.length === 0) {
        Alert.alert(
          data.missingFriends,
          undefined,
          [
            {text: data.ok,
              onPress: () => this.props.navigation.navigate('VoteAddFriends')
            },
          ],
          { cancelable: false })
        }
        else if (this.state.choosenFriends.length !== 0) {
          var alternatives = this.props.navigation.state.params.alternatives
          var category = this.props.navigation.state.params.category
          var catName = category[0].catName
          var catImg = category[0].catImg
          var that = this
          this.db.collection("Users").doc(this.userID).collection("PendingVotes").add({
            CatName: catName,
            CatImg: catImg,
            Msg: this.state.text,
          })
          .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            that.createAlternatives(docRef.id, alternatives, that.userID)
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
        }
      }

      createAlternatives(voteID, alternatives, userID) {
        var that = this
        for(let i=0; i < alternatives.length; i++) {
          this.db.collection("Users").doc(userID).collection("PendingVotes").doc(voteID).collection("Alternatives").add({
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
        for (let i=0; i<this.state.choosenFriends.length; i++) {
          this.db.collection("Users").doc(userID).collection("PendingVotes").doc(voteID).collection('Participants').doc(this.state.choosenFriends[i].id).set({
            Answer: "noAnswer",
          })
        }
        this.sendVoteRequest(voteID, userID)
      }

      sendVoteRequest(voteID, userID) {
        for (let i=0; i<this.state.choosenFriends.length; i++) {
          var friendID = this.state.choosenFriends[i].id
          this.db.collection("Users").doc(friendID).collection("VoteRequests").doc(voteID).set({
            SentFrom: userID,
          })
          for (let i=0; i<this.state.choosenFriends.length; i++) {
            this.db.collection("Users").doc(friendID).collection("VoteRequests").doc(voteID).collection('Participants').doc(this.state.choosenFriends[i].id).set({
              Answer: "noAnswer"
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
        return (
          <ListItem
          containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
          titleStyle={{color: '#FFFFFF', fontSize: 25}}
          roundAvatar
          title={item.username}
          leftAvatar = {{source: {uri: item.profilePic}}}
          rightSubtitle = {
            <View style = {styles.checkbox}>
            <CheckBox
            style = {styles.checkbox}
            checkedIcon='check-circle'
            uncheckedIcon='circle-o'
            checkedColor='#fff'
            uncheckedColor='#fff'
            size = {35}
            checked={this.state.checked[item.localID]}
            onPress={() => this.putInFriendsArray(item)}
            />
            </View>}

            />)
          }

          render() {
            return (
              <View style={styles.container}>
              <Text style={styles.friendLabel}>{data.invitefriends.toUpperCase()}</Text>
              <View style= {styles.buttonContainer}>
              <TouchableOpacity
              style={styles.messageContainer}
              underlayColor='#fff'
              onPress={()=>{
                this.setState({
                  showMe: true})}}>
              <Text style={styles.addFriendsText}> {data.description}</Text>
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
              <Text style={styles.sendText}>{data.start}{data.vote}</Text>
              </TouchableOpacity>
              </View>



              <Modal visible={this.state.showMe}
              style={styles.modalView}
              transparent={true}
              animationType='fade'
              onRequestClose = {() => {this.setState({ showMe : false })}}>
              <View style={styles.modalView}>
              <Text style={styles.modalText}> {data.message}</Text>
              <View style ={styles.textInput}>
              <TextInput
              multiline={true}
              placeholder="Write a message..."
              value={this.state.text}
              onChangeText={(text) => this.setState({text})}
              />
              </View>
              <TouchableOpacity style={styles.addContainer}onPress={()=>{
                this.setState({
                  showMe: false
                })}}>

                <Text style={styles.addText}> {data.add} {data.message} </Text>
                </TouchableOpacity>

                </View>
                </Modal>

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
            //alignItems:'center',
            flexDirection:'row',
            justifyContent: 'space-between',
            //width: 350,
            //marginTop:50
            margin: 10,
          },
          friendLabel: {
            fontSize: 40,
            color: '#000000',
            textAlign: 'center',
            fontFamily: "Roboto-Light",
            margin: 20,
          },
          expireDateContainer: {
            justifyContent: 'center',
            width: 170,
            height: 70,
            margin: 0,
            padding: 10,
            backgroundColor:'#BA55B3',
            borderRadius:20,
            borderColor: '#fff',
            shadowColor: 'grey',
            shadowOpacity: 2,
            shadowRadius: 2,
            shadowOffset: {width: 0,height: 4},
          },
          messageContainer:{
          justifyContent: 'center',
          width: 350,
          height: 70,
          margin: 0,
          padding: 10,
          backgroundColor:'#BA55B3',
          borderRadius:50,
          borderColor: '#fff',
          shadowColor: 'grey',
          shadowOpacity: 2,
          shadowRadius: 2,
          shadowOffset: {width: 0,height: 4},
        },

          addFriendsText: {
            fontFamily: "Roboto-Light",
            color:'#fff',
            fontSize: 25,
            textAlign:'center',
            paddingLeft : 1,
            paddingRight : 1,
            justifyContent: 'center',
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
            marginTop: 10,
            flexDirection:'row',
            justifyContent: 'space-between',
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
            shadowColor: 'grey',
            shadowOpacity: 2,
            shadowRadius: 2,
            shadowOffset: {width: 0,height: 4},
          },
          sendText:{
            fontSize:20,
            color:'white',
            fontFamily: "Roboto-Light",
          },
          checkbox:{
            alignItems: 'flex-end'
          },
          modalView:{
            justifyContent:'center',
            textAlign:'center',
            alignItems: 'center',
            flex: 0,
            marginRight:50,
            backgroundColor: '#689999',
            height:400,
            width: 300,
            borderRadius: 20,
            borderColor: 'white',
            borderWidth: 2,
            marginLeft:40,
            marginTop:100,


          },
          modalText: {
            paddingTop: 20,
            fontFamily: 'Roboto-Light',
            fontSize: 25,
            color: 'white',
            paddingBottom: 10,
          },


          textInput:{
            width: 250,
            height: 200,
            backgroundColor:'white',
            borderRadius:20,
            padding: 20,


          },
          addContainer: {
            marginTop: 30,
            marginBottom: 10,
            backgroundColor: '#BA55B3',
            alignItems: 'center',
            borderRadius: 20,
            width:220,
            height: 50,
            alignItems:'center',
            justifyContent:'center',
            shadowColor: 'grey',
            shadowOpacity: 2,
            shadowRadius: 2,
            shadowOffset: {width: 0,height: 4},

          },
          addText:{
            fontSize: 20,
            color: 'white',
            fontFamily: 'Roboto-Light',
            padding: 10,

          }
        });
