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
  //   const rows = [
  //   {id: '0', text: 'Alternativ 1'},
  //   {id: '1', text: 'Alternativ 2'},
  //   {id: '2', text: 'Alternativ 3'},
  //   {id: '3', text: 'Alternativ 4'},
  //   {id: '4', text: 'Alternativ 5'},
  //   {id: '5', text: 'Alternativ 6'},
  //   {id: '6', text: 'Alternativ 7'},
  //   {id: '7', text: 'Alternativ 8'},
  //   {id: '8', text: 'Alternativ 9'},
  // ]
  this.extractKey = ({id}) => id
  this.state = {
    rows: [],
    text: ''
  }
  this.getReadyMadeAlt()
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
        headerRight: (
          <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}
>
<Icon
  name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
  size={40}
  color='#FFFFFF'/>
</TouchableOpacity>
        ),
      };
    };

    getReadyMadeAlt() {
      var that = this
      if(this.props.navigation.state.params !== undefined) {
        var catID = this.props.navigation.state.params.CatID
        var db = firebase.firestore();
        db.collection("Category").doc(catID).collection('Alternative').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
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
     var index = this.state.rows.length
     var newIDnum = parseInt(this.state.rows[index-1].id, 10) + 1
     var newID = newIDnum.toString()
     var newAlternative = {id: newID, text: this.state.text}
     this.state.rows.push(newAlternative)



     }

  deleteAlternative(delItem) {
    this.setState(prevState => ({rows: prevState.rows.filter(item => item !== delItem) }));
  }

renderItem = ({item, index}) => {
  var msg = `${data.sureMsg} ${item.text}?`
  return (
    <ListItem
    containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
    titleStyle={{color: '#FFFFFF', fontSize: 20}}
    title={item.text}
    rightIcon = {<Icon name={Platform.OS === "ios" ? "ios-remove-circle-outline" : "md-add-circle-outline"}
    size={40}
    style={styles.RemoveIcon}
    color= {'white'}
    onPress={() => Alert.alert(
  data.deleteAlternative,
  msg,
  [

    {text: 'OK', onPress: () => this.deleteAlternative(item)},
  ],
  { cancelable: false })}/>}
    />)
}

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.alternativeLabel}>{data.alternatives}</Text>
      <TextInput
      style={styles.textInput}
      placeholder="Add new"
      onChangeText={(text) => this.setState({text})}
      />

      <TouchableOpacity
      style = {styles.saveButton}
        onPress={() => this.addNewAlternative()}
        >
        <Icon name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
        size={40}
        style={styles.RemoveIcon}
        color= {'white'}
        />
       </TouchableOpacity>

     <FlatList
data={this.state.rows}
renderItem={this.renderItem}
keyExtractor={this.extractKey}
/>

<View>
<TouchableOpacity style={styles.forwardArrow}
onPress={() => this.props.navigation.navigate('AlternativeScreen')}>
<Icon
name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
size={50}/>
</TouchableOpacity>
<TouchableOpacity style={styles.backArrow}
onPress={() => this.props.navigation.navigate('NewVote')}>
<Icon
name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
size={50}/>
</TouchableOpacity>
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
    justifyContent:'center',
  },
  alternativeLabel: {
    fontSize: 50,
    color: '#000000',
    textAlign: 'center',
    fontFamily: "Roboto-Light",
  },
  addAlternative: {
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
  addAlternativeText: {
    fontFamily: "Roboto-Light",
    color:'#fff',
    fontSize: 25,
    textAlign:'center',
    paddingLeft : 1,
    paddingRight : 1,
  },
  alternativeContainer: {
    marginTop: 40,
    textAlign: 'center',
    alignItems: 'center',
  },
  alternativeText: {
    fontFamily: "Roboto-Light",
    color: '#000000',
    fontSize: 25,
  },
  row: {
  fontFamily: "Roboto-Light",
  color: '#FFFFFF',
  padding: 15,
  marginBottom: 5,
  fontSize: 20,
  justifyContent: 'center',
},
textInput: {
  backgroundColor: '#6BCDFD',
  fontSize: 30,
  textAlign:'center',
  alignItems: 'center',
  width: 350,
  height: 70,
  //backgroundColor: '#8FBC8F',
  borderRadius: 30,
  marginBottom: 10,
  padding: 10,
  color: '#FFFFFF',
},
saveButton: {
  backgroundColor: "#BA55B3",
  width: 70,
  height: 70,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 100,
  marginBottom: 10,
  marginTop: 50,
},
addIcon: {
  color: "#FFFFFF",
  fontSize: 30,
  fontFamily: 'Roboto-Light',
},
forwardArrow: {
  justifyContent: 'center',
},
backArrow: {
  justifyContent: 'center',
},
});
