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
  ImageBackground,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';
import * as firebase from 'firebase';



export default class SavedResultScreen extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    const rows = [
      {id: '0', text: 'Vote A'},
      {id: '1', text: 'Vote B'},
      {id: '2', text: 'Vote C'},
      {id: '3', text: 'Vote D'},
      {id: '4', text: 'Vote E'},
    ]

    this.extractKey = ({id}) => id
    this.extractKey1 = ({VoteID}) => VoteID
    this.extractKey2 = ({VoteID}) => VoteID
    this.state = {
      rows: rows,
      results:[],
      savedResults: [],
    }
    this.getResults()
    this.getSavedResults()
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

getResults() {
  var that = this
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  db.collection("Users").doc(userID).collection("Result").where("Saved", "==", false).onSnapshot(function(querySnapshot) {
        that.setState({results: []})
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id)
            const name = doc.get('CatName');
            const img = doc.get('CatImg');
            that.setState(prevState => ({
              results: [...prevState.results, {VoteID: doc.id, CatName: name, CatImg: img}]
            }))
        });
    });
}

getSavedResults(){
  var that = this
  var user = firebase.auth().currentUser;
  var userID = user.uid;
  var db = firebase.firestore();
  db.collection("Users").doc(userID).collection("Result").where("Saved", "==", true).onSnapshot(function(querySnapshot) {
        that.setState({savedResults: []})
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id)
            const name = doc.get('CatName');
            const img = doc.get('CatImg');
            that.setState(prevState => ({
              savedResults: [...prevState.savedResults, {VoteID: doc.id, CatName: name, CatImg: img}]
            }))
        });
    });
}

    deleteResult(delItem) {
      var that = this;
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      //var voteID = this.props.navigation.state.params.VoteID
      var voteID = delItem.VoteID
      var docRef = db.collection('Users').doc(userID).collection('Result').doc(voteID)
      docRef.collection('Alternatives').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              const id = doc.id
              docRef.collection('Alternatives').doc(id).delete().then(function() {
                console.log("delete alternatives ");
              }).catch(function(error) {
                console.error("delete alternatives ", error);
              });
          });
      });
      docRef.delete().then(function() {
      console.log("delete vote " + voteID);
      }).catch(function(error) {
      console.error("delete vote ", error);
      });
    //  this.setState(prevState => ({savedResults: prevState.savedResults.filter(item => item !== delItem) }));
    }


    renderItem1 = ({item, index}) => {
      //console.log(item)
      return (
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ResultScreen', {VoteID: item.VoteID, saved: false})}>
        <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
        <ListItem
        containerStyle={{ backgroundColor: 'transparent'}}
        //  containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 30}}
        title={item.CatName}
        />
        </ImageBackground>
        </TouchableOpacity>
      )
    }

    renderItem2 = ({item, index}) => {
      //console.log(item)
      return (
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ResultScreen', {VoteID: item.VoteID, saved: true})}>
        <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
        <ListItem
        containerStyle={{ backgroundColor: 'transparent'}}
        //  containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 30}}
        title={item.CatName}
        rightIcon = {<Icon
          name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
          size={40}
          color='#FFFFFF'
          onPress={() => Alert.alert(
            data.deleteResult,
            `${data.sureMsg} ${item.CatName}?` ,
            [
              {text: data.cancel, onPress: () => this.props.navigation.navigate('SavedResult')},
              {text: data.ok, onPress: () => this.deleteResult(item)},
            ],
            { cancelable: false })}/>}
        />
        </ImageBackground>
        </TouchableOpacity>
      )
    }

    // renderItem = ({item, index}) => {
    //   var msg = `${data.sureMsg} ${item.text}?`
    //   return (
    //     <ListItem
    //     containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
    //     titleStyle={{color: '#FFFFFF', fontSize: 30}}
    //     roundAvatar
    //     title={item.text}
    //     rightIcon = {<Icon
    //       name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
    //       size={25}
    //       color='#FFFFFF'
    //       onPress={() => Alert.alert(
    //         data.deleteResult,
    //         msg,
    //         [
    //           {text: 'Cancel', onPress: () => this.props.navigation.navigate('SavedResults')},
    //           {text: 'OK', onPress: () => this.deleteResult(item)},
    //         ],
    //         { cancelable: false })}/>}
    //         />)
    //       }

          render() {
            return (
              <View style={styles.container}>
              <Text style={styles.resultLabel}> {data.results} </Text>
              <View style={styles.resultContainer}>
              <Text style={styles.savedResultLabel}>{data.unchecked}
              <Text> </Text>
            </Text>
                <View
                style={{
                  borderBottomColor: '#94B4C1',
                  borderBottomWidth: 3 }}
                  />

              <FlatList
              data={this.state.results}
              renderItem={this.renderItem1}
              keyExtractor={this.extractKey1}
              />
              </View>

              <View style={styles.savedesultContainer}>
              <Text style={styles.savedResultLabel}>{data.savedResults}
              <Text> </Text>

                </Text>
                <View
                style={{
                  borderBottomColor: '#94B4C1',
                  borderBottomWidth: 3 }}
                  />

                <FlatList
                data={this.state.savedResults}
                renderItem={this.renderItem2}
                keyExtractor={this.extractKey2}
                />
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
          },
          resultLabel: {
            fontSize: 40,
            color: '#000000',
            textAlign: 'center',
            fontFamily: "Roboto-Light",
            marginTop: 15,
          },
          resultContainer:{
            height: '50%'
          },

          savedResultLabelresultContainer:{
            height: '50%'
          },

          savedResultLabel: {
            marginTop: 20,
            fontSize: 25,
            color: '#000000',
            textAlign: 'center',
            fontFamily: "Roboto-Light",
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
