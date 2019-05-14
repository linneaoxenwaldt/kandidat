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
import 'firebase/firestore';

export default class NewVoteScreen extends React.Component {
  constructor(props){
    super(props)
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    this.userID = this.user.uid;
    this.extractKey = ({id}) => id
    this.state = {
      rows: [],
    }
    this.getReadyMadeCat();
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

    getReadyMadeCat() {
      var that = this
      this.db.collection("Users").doc(this.userID).collection('Category').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const value = doc.get('CatName');
          const img = doc.get('CatImg');
          that.setState(prevState => ({
            rows: [...prevState.rows, {id: doc.id, text: value, img: img}]
          }))
        });
      });
    }

    deleteCategory(delItem) {
      var that = this
      var docRef = this.db.collection("Users").doc(this.userID).collection('Category').doc(delItem.id)
      docRef.collection('Alternative').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              const id = doc.id
              docRef.collection('Alternative').doc(id).delete().then(function() {
                console.log("delete alternatives ");
              }).catch(function(error) {
                console.error("delete alternatives ", error);
              });
          });
      });

      docRef.delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
      this.setState(prevState => ({rows: prevState.rows.filter(item => item !== delItem) }));
    }

    addToCategoryList(newCat) {
      var catID = newCat.id
      var docRef = this.db.collection('Users').doc(this.userID).collection('Category').doc(catID);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          const catName = doc.data().CatName
          const img = doc.data().CatImg
          that.setState(prevState => ({
            rows: [...prevState.rows, {id: catID, text: catName, img: img}]
          }))
        } else {
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
    }

    renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('AlternativeScreen', {CatID: item.id, prePage: "Old"})}>
        <ImageBackground source={{uri: item.img}} style={{width: '100%', height: 100}}>
        <ListItem
        containerStyle={{ backgroundColor: 'transparent'}}
        titleStyle={{color: '#FFFFFF', fontSize: 30}}
        title={item.text}
        rightIcon = {<Icon
          name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
          size={40}
          color='#FFFFFF'
          onPress={() => Alert.alert(
            data.deleteCategory,
            `${data.sureMsg} ${item.text}?` ,
            [
              {text: data.cancel, onPress: () => this.props.navigation.navigate('NewVote')},
              {text: data.ok, onPress: () => this.deleteCategory(item)},
            ],
            { cancelable: false })}/>}
            /></ImageBackground></TouchableOpacity>)
          }

          render() {
            return (
              <View style={styles.container}>
              <Text style={styles.categoryLabel}>{data.categories}</Text>
              <View style ={styles.buttonContainer}>
              <TouchableOpacity
              style={styles.createOwnCategoryContainer}
              onPress={() => this.props.navigation.navigate('NewCategory', {addToCategoryList: this.addToCategoryList.bind(this)})}
              underlayColor='#fff'>
              <Text style={styles.ownCategoryText}>{data.createOwnCate} <Icon
              name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
              size={25}
              /></Text>
              </TouchableOpacity>
              </View>
              <View style={styles.readyMadeCategoryContainer}>
              <Text style={styles.readyMadeCategoryLabel}>{data.readyMadeCate}</Text>
              </View>
              <FlatList
              data={this.state.rows}
              renderItem={this.renderItem}
              keyExtractor={this.extractKey}
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
          buttonContainer:{
            alignItems:'center',
          },
          categoryLabel: {
            fontSize: 40,
            color: '#000000',
            textAlign: 'center',
            fontFamily: "Roboto-Light",
          },
          createOwnCategoryContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            width: 350,
            height: 70,
            margin: 20,
            padding: 10,
            backgroundColor:'#BA55B3',
            borderRadius:50,
            borderWidth: 1,
            borderColor: '#fff'
          },
          ownCategoryText: {
            justifyContent: 'center',
            fontFamily: "Roboto-Light",
            color:'#fff',
            fontSize: 25,
            textAlign:'center',
            paddingLeft : 1,
            paddingRight : 1,
          },
          readyMadeCategoryContainer: {
            alignItems: 'center',
          },
          readyMadeCategoryLabel: {
            fontFamily: "Roboto-Light",
            color: '#000000',
            fontSize: 25,
            margin: 20,
          },
          row: {
            fontFamily: "Roboto-Light",
            padding: 15,
            marginBottom: 5,
          },
        });
