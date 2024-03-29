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
    this.extractKey = ({id}) => id
    this.extractKey1 = ({VoteID}) => VoteID
    this.extractKey2 = ({VoteID}) => VoteID
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    this.userID = this.user.uid;
    this.state = {
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
      this.db.collection("Users").doc(this.userID).collection("Result").where("Saved", "==", false).onSnapshot(function(querySnapshot) {
        that.setState({results: []})
        querySnapshot.forEach(function(doc) {
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
      this.db.collection("Users").doc(this.userID).collection("Result").where("Saved", "==", true).onSnapshot(function(querySnapshot) {
        that.setState({savedResults: []})
        querySnapshot.forEach(function(doc) {
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
      var voteID = delItem.VoteID
      var docRef = this.db.collection('Users').doc(this.userID).collection('Result').doc(voteID)
      docRef.collection('Alternatives').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const id = doc.id
          docRef.collection('Alternatives').doc(id).delete().then(function() {
          }).catch(function(error) {
            console.error("delete alternatives ", error);
          });
        });
      });
      docRef.delete().then(function() {
      }).catch(function(error) {
        console.error("delete vote ", error);
      });
    }

    renderItem1 = ({item, index}) => {
      return (
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ResultScreen', {VoteID: item.VoteID, saved: false})}>
        <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
        <ListItem
        containerStyle={{ backgroundColor: 'transparent'}}
        titleStyle={{color: '#FFFFFF', fontSize: 30}}
        title={item.CatName}
        />
        </ImageBackground>
        </TouchableOpacity>
      )
    }

    renderItem2 = ({item, index}) => {
      return (
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ResultScreen', {VoteID: item.VoteID, saved: true})}>
        <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
        <ListItem
        containerStyle={{ backgroundColor: 'transparent'}}
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

        render() {
          return (
            <View style={styles.container}>
            <Text style={styles.resultLabel}> {data.results.toUpperCase()} </Text>
            <View style={styles.flatlistContain}>
            <Text style={styles.miniResultLabel}>{data.unchecked}
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

              <View style={styles.flatlistContain}>
              <Text style={styles.miniResultLabel}>{data.savedResults}
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
              backgroundColor: '#FFFFFF',
            },
            resultLabel: {
              fontSize: 40,
              color: '#000000',
              textAlign: 'center',
              fontFamily: "Roboto-Light",
              marginTop: 15,
            },
            flatlistContain: {
              height: 260,
              paddingBottom: 5,
            },
            miniResultLabel: {
              marginTop: 20,
              marginBottom: 10,
              fontSize: 25,
              color: '#000000',
              textAlign: 'center',
              fontFamily: "Roboto-Light",
            },
          });
