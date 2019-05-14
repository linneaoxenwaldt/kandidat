import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';
import * as firebase from 'firebase';

export default class ProfileScreen extends React.Component {
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
      const rows = [
        {id: '0', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fanka.png?alt=media&token=21f921e3-067a-410d-a689-a2997d80611c'},
        {id: '1', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fdinosaurie.png?alt=media&token=ec6ebddf-d0d3-42de-a85e-cd60dea7bc71'},
        {id: '2', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fflodha%CC%88st.png?alt=media&token=c193069f-6973-42f2-b10b-3d8a29f57be1'},
        {id: '3', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fgris.png?alt=media&token=9601dd38-2020-46d1-a39f-7c3d9cca3a06'},
        {id: '4', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fkanin.png?alt=media&token=46721346-926c-4dcc-97ab-016ccfdb6000'},
        {id: '5', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fkatt.png?alt=media&token=9c40ac2d-0ec1-460c-b4a6-00687c30c162'},
        {id: '6', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fka%CC%88nguru.png?alt=media&token=a16346e2-2aa9-427a-b839-5eb575450445'},
        {id: '7', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Flamm.png?alt=media&token=6a3b48b2-2db9-4186-ad14-bd4e46a972ff'},
        {id: '8', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fsa%CC%88l.png?alt=media&token=c07027d6-0243-4359-a13f-f42cd40cc5c7'},
        {id: '9', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fuggla.png?alt=media&token=2c009f52-f1e8-4dc0-a2f7-9f9b8faf8b79'},
        {id: '10', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Profile%20Image%2Fzebra.png?alt=media&token=bb4fbd39-0873-4c9e-9540-40e84b11b16d'},
      ]
      this.db = firebase.firestore();
      this.user = firebase.auth().currentUser;
      this.userID = this.user.uid;
      this.extractKey = ({id}) => id
      this.state = {
        username: "",
        email: "",
        showMe: false,
        rows: rows,
        profilePic: "https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2FColor5.png?alt=media&token=a24c4f41-9995-4fb0-8d61-2a9987204a1d",
      }
      this.getUser()
    }

    getUser() {
      var that = this
      var docRef = this.db.collection('Users').doc(this.userID);
      docRef.onSnapshot(function(doc) {
        if (doc.exists) {
          that.setState({username: doc.data().Username, email : doc.data().Email, profilePic: doc.data().ProfilePic})
          console.log("Document data:", that.state.username);
        } else {
          console.log("No such document!");
        }
      });
    }

    changeProfilePic(item){
      this.state.profilePic = item.img
      var docRef = this.db.collection('Users').doc(this.userID).update({
        "ProfilePic": item.img
      });
      this.setState({
        showMe: false
      })
    }

    renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
        onPress={() => this.changeProfilePic(item)}>
        <Image source={{uri: item.img}} style={styles.picStyle}/>
        </TouchableOpacity>
      )
    }

  logOut() {
      Alert.alert(
      data.logOut,
      data.sureLogOut,
      [
        {
          text: data.cancel,
        },
        {
          text: data.ok,
          onPress: () => firebase.auth().signOut()
        },
      ]
    )
  }

    render() {
      return (
        <View style={styles.container}>
        <TouchableOpacity
        onPress={()=>{
          this.setState({
            showMe: true
          })}}>
        <Image source={{uri: this.state.profilePic}} style={styles.profilePic}/>
        </TouchableOpacity>
        <View style={styles.userNameContainer}>
        <Text style={styles.userNameText}>{this.state.username}</Text>
        </View>
        <View style={styles.emailContainer}>
        <Text style={styles.enText}>{this.state.email}</Text>
        <TouchableOpacity
        style={styles.changeIcon}
        onPress={() => this.props.navigation.navigate('ChangeEmail')}>
        <Icon name={Platform.OS === "ios" ? "ios-create" : "md-create"}
        size={30}
        color='#FFFFFF'/>
        </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
        <Text style={styles.enText}>{data.changePassword}</Text>
        <TouchableOpacity
        style={styles.changeIcon}
        onPress={() => this.props.navigation.navigate('ChangePassword')}>
        <Icon name={Platform.OS === "ios" ? "ios-create" : "md-create"}
        size={30}
        color='#FFFFFF'/>
        </TouchableOpacity>
        </View>
        <View style={styles.profilePicContainer}>
        <Text style={styles.enText}>{data.changeProfilePic}</Text>
        <TouchableOpacity
        style={styles.changeIcon}
        onPress={()=>{
          this.setState({
            showMe: true
          })}}>
          <Icon name={Platform.OS === "ios" ? "ios-create" : "md-create"}
          size={30}
          color='#FFFFFF'/>
          </TouchableOpacity>
          </View>
          <View style={styles.buttonBottomContainer}>
          <TouchableOpacity
          onPress={() => this.logOut()}
          style = {styles.logOutButton}
          >
          <Text style={styles.logOutText}>{data.logOut}</Text>
          </TouchableOpacity>
          </View>

          <Modal visible={this.state.showMe}
          onRequestClose = {() => {this.setState({ showMe: false })}}>
          <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeContainer} onPress={()=>{
            this.setState({
              showMe: false
            })}}>
            <Text style={styles.closeText}>{data.closeWindow}</Text>
            </TouchableOpacity>

            <FlatList
            contentContainerStyle={{
              alignSelf: 'flex-start',
            }}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.rows}
            renderItem={this.renderItem}
            keyExtractor={this.extractKey}
            />
            </View>
            </Modal>
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
          justifyContent: 'center',
          borderRadius: 30,
          marginTop: 20,
          marginBottom: 5,
          padding: 10,
          alignItems:'center'
        },
        userNameText: {
          fontFamily: 'Roboto-Light',
          color: '#FFFFFF',
          fontSize: 20,
          justifyContent:'center',
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
          alignItems:'center'
        },
        enText: {
          flexGrow: 1,
          fontFamily: 'Roboto-Light',
          color: '#FFFFFF',
          fontSize: 20,
          alignSelf: 'center',
          justifyContent:'center',
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
          alignItems:'center'
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
          alignItems:'center'
        },
        changeIcon: {
          alignSelf: 'center',
          color: '#FFFFFF',
          paddingRight: 20,
        },
        closeText: {
          marginBottom: 20,
          marginTop: 10,
          backgroundColor: '#CBA3D5',
          alignItems: 'center',
          borderRadius: 5,
          borderWidth: 3,
          borderColor: '#BA55B3',
        },
        modalView:{
          flex: 1,
          width: '100%',
          marginTop: 20,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
        },
        picStyle: {
          height: 150,
          width: 150,
          borderRadius: 75,
          borderWidth: 2,
          borderColor: '#689999',
          margin: 10,
        },
        closeText: {
          marginBottom: 10,
          marginTop: 10,
          alignItems: 'center',
          fontSize: 15,
          color: 'white',
          justifyContent:'center',
        },
        closeContainer: {
          marginBottom: 20,
          marginTop: 20,
          backgroundColor: '#CBA3D5',
          alignItems: 'center',
          borderRadius: 20,
          width:150,
          height: 50,
          alignItems:'center',
          justifyContent:'center',
        },
        logOutButton:{
          backgroundColor: "#6BCDFD",
          width: 150,
          height: 55,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          marginBottom: 8,
          marginTop: 8,
        },
        logOutText:{
          textAlign: 'center',
          fontSize: 20,
          color:'white',
          fontFamily: "Roboto-Light",
        },
        buttonBottomContainer: {
          flexDirection:'row',
          justifyContent: 'center',
          marginLeft: 10,
          marginRight: 10,
        },
      });
