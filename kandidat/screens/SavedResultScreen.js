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
    this.state = {
      rows: rows,
      results:[],

    }
    this.getResults()
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
  db.collection("Users").doc(userID).collection("Result").get().then(function(querySnapshot) {
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

    deleteResult(delItem) {
      this.setState(prevState => ({rows: prevState.rows.filter(item => item !== delItem) }));
    }


    renderItem1 = ({item, index}) => {
      console.log(item)
      return (
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ResultScreen', {VoteID: item.VoteID})}>
        <ImageBackground source={{uri: item.CatImg}} style={{width: '100%', height: 100}}>
        <ListItem
        containerStyle={{ backgroundColor: 'transparent'}}
        //  containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 30}}
        title={item.CatName}
        //rightSubtitle={item.expdate}
        />
        </ImageBackground>
        </TouchableOpacity>
      )
    }

    renderItem = ({item, index}) => {
      var msg = `${data.sureMsg} ${item.text}?`
      return (
        <ListItem
        containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 30}}
        roundAvatar
        title={item.text}
        rightIcon = {<Icon
          name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
          size={25}
          color='#FFFFFF'
          onPress={() => Alert.alert(
            data.deleteResult,
            msg,
            [
              {text: 'Cancel', onPress: () => this.props.navigation.navigate('SavedResults')},
              {text: 'OK', onPress: () => this.deleteResult(item)},
            ],
            { cancelable: false })}/>}
            />)
          }

          render() {
            return (
              <View style={styles.container}>
              <View style={styles.resultContainer}>
              <Text style={styles.savedResultLabel}>Results
              <Text> </Text>
              <Icon
                name={Platform.OS === "ios" ? "ios-stats" : "md-stats"}
                size={30}/></Text>

              <FlatList
              data={this.state.results}
              renderItem={this.renderItem1}
              keyExtractor={this.extractKey1}
              />
              </View>

              <View style={styles.savedesultContainer}>
              <Text style={styles.savedResultLabel}>Saved Results
              <Text> </Text>
              <Icon
                name={Platform.OS === "ios" ? "ios-save" : "md-save"}
                size={30}/>
                </Text>

              <FlatList
              data={this.state.rows}
              renderItem={this.renderItem}
              keyExtractor={this.extractKey}
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
          resultContainer:{
            height: '50%'
          },

          savedResultLabelresultContainer:{
            height: '50%'
          },

          savedResultLabel: {
            fontSize: 25,
            color: '#000000',
            textAlign: 'center',
            fontFamily: "Roboto-Light",
            padding: 20,
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
