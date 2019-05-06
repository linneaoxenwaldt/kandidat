import React from 'react';
import * as firebase from 'firebase';
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
  Modal,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';






export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props);

    const info = (<Icon name={Platform.OS === "ios" ? "ios-information-circle" : "md-information-circle"} size={40} color='#FFFFFF'/>)
    const sound = (<Icon name={Platform.OS === "ios" ? "ios-musical-notes" : "md-musical-notes"} size={40} color='#FFFFFF'/>)
    const results = (<Icon name={Platform.OS === "ios" ? "ios-stats" : "md-stats"} size={40} color='#FFFFFF'/>)
    const notifications = (<Icon name={Platform.OS === "ios" ? "ios-notifications" : "md-notifications"} size={40} color='#FFFFFF'/>)
    const account = (<Icon name={Platform.OS === "ios" ? "ios-contact" : "md-contact"} size={40} color='#FFFFFF'/>)
    const help = (<Icon name={Platform.OS === "ios" ? "ios-help-circle" : "md-help-circle"} size={40} color='#FFFFFF'/>)

    this.icons = [info, results, sound, notifications, account, help]
    this.colors = ['#94B4C1', '#689999', '#94B4C3', '#689999', '#94B4C5', '#689999']
    const rows = [
      {id: '0', text: 'Info'},
      {id: '1', text: 'Results'},
      {id: '2', text: 'Sound'},
      {id: '3', text: 'Notificatios'},
      {id: '4', text: 'Account'},
      {id: '5', text: 'Logout'},

    ]
    this.extractKey = ({id}) => id
    this.state = {
      rows: rows,
      showMe : false,
    }
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

onPressRouter(id){
  if ( id == 5 ){
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        {
          text: "Cancel",
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'ok',
          onPress: () => firebase.auth().signOut()
        },
      ]
    )

  }else if(id == 1){
    Alert.alert('id 1')
  }else if(id == 2){
    Alert.alert('id 2')
  }else if(id == 3){
    Alert.alert('id 3')
  }else if(id == 4){
    Alert.alert('id 4')
  }else if(id == 0){
    //Alert.alert('id 0')
    this.setState({
      showMe : true
    })
    }
}

showInfo() {
  this.setState({
    showMe : false
  })
}

    renderItem = ({item, index}) => {
      var msg = `${data.sureMsg} ${item.text}?`
      return (
        <ListItem
        onPress={() => this.onPressRouter(item.id)}
        containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 20}}
        roundAvatar
        title={item.text}
        leftAvatar={this.icons[index % this.icons.length]}
        rightIcon = {<Icon
          name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-trash"}
          size={40}
          color='#FFFFFF'

          />}
          />)
        }

        render() {
          return (
            <View style={styles.container}>
            <Text style={styles.settingsLabel}>Settings
            <Icon name={Platform.OS === "ios" ? "ios-settings" : "md-settings"}
            size={40} color='grey'/>
            </Text>

            <FlatList
            data={this.state.rows}
            extraData = {this.state.icon}
            renderItem={this.renderItem}
            keyExtractor={this.extractKey}
            />

            <Modal visible = {this.state.showMe}
            onRequestClose = {() => {this.setState({ showMe : false })}}>
            <View>
            <TouchableOpacity onPress = {() =>{
            this.setState({
              showMe : false
            })}}>
            <Icon name={Platform.OS === "ios" ? "ios-settings" : "md-settings"}
            size={40} color='grey'/>
            <Text>
            Close Modal
            </Text>
            </TouchableOpacity>
            <Text>{data.infoText}</Text>
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
      },

      settingsLabel: {
        fontSize: 40,
        color: '#000000',
        textAlign: 'center',
        fontFamily: "Roboto-Light",
        padding: 40,
      },

      row: {
        fontFamily: "Roboto-Light",
        color: '#FFFFFF',
        padding: 15,
        marginBottom: 5,
        fontSize: 20,
        justifyContent: 'center',
      },

      saveResult: {
        alignItems:'center',
        justifyContent: 'center',
        width: 200,
        height: 70,
        margin: 10,
        padding: 10,
        marginTop:10,
        backgroundColor:'#BA55B3',
        borderRadius:20,
        borderWidth: 1,
        borderColor: '#fff'
      },

      saveResultText:{
        alignItems:'center',
        fontSize:25,
        textAlign:'center',
        alignItems:'center',
        color: 'white',
      },
    });
