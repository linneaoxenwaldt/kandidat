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
    // this.getReadyMadeCat();
  //   const rows = [
  //   {id: '0', text: 'Test0'},
  //   {id: '1', text: 'Test1'},
  //   {id: '2', text: 'Test2'},
  //   {id: '3', text: 'Test3'},
  //   {id: '4', text: 'Test4'},
  //   {id: '5', text: 'Test5'},
  //   {id: '6', text: 'Test6'},
  //   {id: '7', text: 'Test7'},
  //   {id: '8', text: 'Test8'},
  // ]
  // console.log(rows)
  this.extractKey = ({id}) => id
  this.state = {
    rows: [],
  }
  this.getReadyMadeCat();
  // console.log(this.state)
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
      // //const rows = []
      // var db = firebase.firestore();
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      // db.collection("Category").
      db.collection("Users").doc(userID).collection('Category').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              const value = doc.get('CatName');
              const img = doc.get('CatImg');
              // console.log(img)
              that.setState(prevState => ({
                rows: [...prevState.rows, {id: doc.id, text: value, img: img}]
              }))
          });
      });
    }

    deleteCategory(delItem) {
      var that = this
      // var db = firebase.firestore();
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      var db = firebase.firestore();
      db.collection("Users").doc(userID).collection('Category').doc(delItem.id).delete().then(function() {
      // db.collection("Category").doc(delItem.id).delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
      this.setState(prevState => ({rows: prevState.rows.filter(item => item !== delItem) }));
    }

    renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('AlternativeScreen', {CatID: item.id, prePage: "Old"})}>
        <ImageBackground source={{uri: item.img}} style={{width: '100%', height: 100}}>
        <ListItem
        //containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
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
        {text: 'Cancel', onPress: () => this.props.navigation.navigate('NewVote')},
        {text: 'OK', onPress: () => this.deleteCategory(item)},
      ],
      { cancelable: false })}/>}
        /></ImageBackground></TouchableOpacity>)
    }

    render() {
      return (
        <View style={styles.container}>
            <Text style={styles.categoryLabel}>{data.categories}</Text>
            <TouchableOpacity
                      style={styles.createOwnCategoryContainer}
                      onPress={() => this.props.navigation.navigate('NewCategory')}
                      underlayColor='#fff'>
                      <Text style={styles.ownCategoryText}>{data.createOwnCate} <Icon
                        name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
                        size={25}
                      /></Text>
             </TouchableOpacity>
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
  categoryLabel: {
    fontSize: 50,
    color: '#000000',
    textAlign: 'center',
    fontFamily: "Roboto-Light",
  },
  createOwnCategoryContainer: {
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
  ownCategoryText: {
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
  },
  row: {
  fontFamily: "Roboto-Light",
  padding: 15,
  marginBottom: 5,
},
});
