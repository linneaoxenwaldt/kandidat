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
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class AlternativeScreen extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    this.userID = this.user.uid;
    this.catID = this.props.navigation.state.params.CatID
    this.extractKey = ({id}) => id
    this.state = {
      rows: [],
      text: '',
      category: [],
    }
    this.getCategory()
    this.getReadyMadeAlt()
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

    getCategory() {
      var that = this
      var docRef = this.db.collection('Users').doc(this.userID).collection('Category').doc(this.catID);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          const value = doc.get('CatName');
          const img = doc.get('CatImg');
          that.setState(prevState => ({
            category: [...prevState.category, {catID: that.catID, catName: value, catImg: img}]
          }))
        } else {
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
    }

    getReadyMadeAlt() {
      var that = this
      if(this.props.navigation.state.params !== undefined) {
        this.db.collection("Users").doc(this.userID).collection("Category").doc(this.catID).collection('Alternative').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            const name = doc.get('Name');
            const votes = doc.get('Votes')
            that.setState(prevState => ({
              rows: [...prevState.rows, {id: doc.id, text: name, votes: votes}]
            }))
          });
        });
      }
      else {
        that.state.rows = []
      }
    }

    addNewAlternative() {
      var that = this
      if(this.state.text == "") {
        Alert.alert(
          data.missingAltName,
        )
      }
      else {
        this.db.collection("Users").doc(this.userID).collection("Category").doc(this.catID).collection('Alternative').add({
          Name: this.state.text,
          Votes: 0,
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          that.textInput.clear()
          that.setState(prevState => ({
            rows: [...prevState.rows, {id: docRef.id, text: that.state.text, votes: 0}]
          }))
          that.state.text = ""
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      }
    }

    deleteAlternative(delItem) {
      var that = this
      this.db.collection("Users").doc(this.userID).collection("Category").doc(this.catID).collection("Alternative").doc(delItem.id).delete().then(function() {
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
      this.setState(prevState => ({rows: prevState.rows.filter(item => item !== delItem) }));
    }

    checkPrePage() {
      var prePage = this.props.navigation.state.params.prePage
      if (prePage === "New") {
        this.props.navigation.navigate('NewCategory')
      }
      if (prePage === "Old") {
        this.props.navigation.navigate('NewVote')
      }
    }


    createAlternatives() {
      if(this.state.rows.length == 0) {
        Alert.alert(
          data.noAlternatives,
        )
      }
      else {
        this.props.navigation.navigate('VoteAddFriends', {category: this.state.category, alternatives: this.state.rows})
      }
    }

    renderItem = ({item, index}) => {
      var msg = `${data.sureMsg} ${item.text}?`
      return (
        <ListItem
        containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 30}}
        title={item.text}
        rightIcon = {<Icon name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
        size={30}
        style={styles.RemoveIcon}
        color= {'#fff'}
        onPress={() => Alert.alert(
          data.deleteAlternative,
          msg,
          [
            {text: data.cancel, onPress: () => this.props.navigation.navigate('AlternativeScreen')},
            {text: data.ok, onPress: () => this.deleteAlternative(item)},
          ],
          { cancelable: false })}/>}
          />)
        }

        render() {
          return (
            <View style={styles.container}>
            <Text style={styles.alternativeLabel}>{data.alternatives}</Text>
            <View style={styles.addMoreAlt}>
            <TextInput
            ref={input => { this.textInput = input }}
            style={styles.textInput}
            placeholder={data.addNew}
            onChangeText={(text) => this.setState({text})}
            />
            <TouchableOpacity
            style = {styles.saveButton}
            onPress={() => this.addNewAlternative()}
            >
            <Icon name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
            size={40}
            style={styles.RemoveIcon}
            color= {'#fff'}
            />
            </TouchableOpacity>
            </View>

            <FlatList
            data={this.state.rows}
            renderItem={this.renderItem}
            keyExtractor={this.extractKey}
            />

            <View style={styles.buttonBottomContainer}>
            <TouchableOpacity
            onPress={() => this.checkPrePage()}
            >
            <Icon
            name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
            size={55}
            color="#A9A9A9"/>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => this.createAlternatives()}
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
          paddingTop: 20,
          backgroundColor: '#FFFFFF',
          justifyContent:'center',
        },
        alternativeLabel: {
          fontSize: 40,
          color: '#000000',
          textAlign: 'center',
          fontFamily: "Roboto-Light",
        },
        addMoreAlt: {
          alignItems: 'center',
        },
        row: {
          fontFamily: "Roboto-Light",
          color: '#FFFFFF',
          padding: 10,
          marginBottom: 5,
          fontSize: 20,
          justifyContent: 'center',
        },
        textInput: {
          backgroundColor: '#6BCDFD',
          fontSize: 25,
          textAlign:'center',
          alignItems: 'center',
          width: 350,
          height: 70,
          //backgroundColor: '#8FBC8F',
          borderRadius: 30,
          margin: 20,
          padding: 10,
          color: '#FFFFFF',
          borderColor: '#3BCDFD',
          borderWidth:4,
        },
        saveButton: {
          backgroundColor: "#BA55B3",
          width: 70,
          height: 70,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 100,
          marginTop:10,
          marginBottom: 20,
        },
        addIcon: {
          color: "#FFFFFF",
          fontSize: 30,
          fontFamily: 'Roboto-Light',
        },
        buttonBottomContainer: {
          flexDirection:'row',
          justifyContent: 'space-between',
          marginLeft: 10,
          marginRight: 10,
        },
      });
