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
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import data from '../data/engWord.json';

export default class SettingsScreen extends React.Component {
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

      const info = (<Icon name={Platform.OS === "ios" ? "ios-information-circle" : "md-information-circle"} size={40} color='#FFFFFF'/>)
      const results = (<Icon name={Platform.OS === "ios" ? "ios-stats" : "md-stats"} size={40} color='#FFFFFF'/>)
      const sound = (<Icon name={Platform.OS === "ios" ? "ios-musical-notes" : "md-musical-notes"} size={40} color='#FFFFFF'/>)
      const notifications = (<Icon name={Platform.OS === "ios" ? "ios-notifications" : "md-notifications"} size={40} color='#FFFFFF'/>)
      const account = (<Icon name={Platform.OS === "ios" ? "ios-contact" : "md-contact"} size={40} color='#FFFFFF'/>)
      const logout = (<Icon name={Platform.OS === "ios" ? "ios-help-circle" : "md-help-circle"} size={40} color='#FFFFFF'/>)

      this.iconsLeft = [info, results, sound, notifications, account, logout]
      this.colors = ['#94B4C1', '#689999', '#94B4C3', '#689999', '#94B4C5', '#689999']

      const infos = (<Icon name={Platform.OS === "ios" ? "ios-open" : "md-open"} size={40} color='#FFFFFF'/>)
      const resultss = (<Icon2 name={"toggle-switch-outline"} size={40} color='#FFFFFF'/>)
      const sounds = (<Icon2 name={"toggle-switch-off-outline"} size={40} color='#FFFFFF'/>)
      const notificationss = (<Icon2 name={"toggle-switch-outline"} size={40} color='#FFFFFF'/>)
      const accounts = (<Icon2 name={"delete-empty"} size={40} color='#FFFFFF'/>)
      const logouts = (<Icon2 name={"logout"} size={40} color='#FFFFFF'/>)

      this.iconsRight = [infos, resultss, sounds, notificationss, accounts, logouts]
      const rows = [
        {id: '0', text: data.info},
        {id: '1', text: data.results},
        {id: '2', text: data.sound},
        {id: '3', text: data.notifications},
        {id: '4', text: data.deleteAccount},
        {id: '5', text: data.logOut},
      ]
      this.extractKey = ({id}) => id
      this.state = {
        rows: rows,
        showMe : false,
      }
    }

    onPressRouter(id){
      if ( id == 0 ){
        this.setState({
          showMe : true
        })
      }else if(id == 1){
        this.props.navigation.navigate('SavedResult')
      }else if(id == 2){
        Alert.alert(
          data.sound,
          data.enableSound,
          [
            {
              text: data.cancel,
            },
            {
              text: data.ok,
            },
          ]
        )
      }else if(id == 3){
        Alert.alert(
          data.notifications,
          data.disableNotification,
          [
            {
              text: data.cancel,
            },
            {
              text: data.ok,
            },
          ]
        )
      }else if(id == 4){
        Alert.alert(
          data.deleteAccount,
          data.cannotRegret,
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
      }else if(id== 5){
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
        leftAvatar={this.iconsLeft[index % this.iconsLeft.length]}
        rightIcon ={this.iconsRight[index % this.iconsRight.length]}
        />)
      }


      render() {
        return (
          <View style={styles.container}>
          <Text style={styles.settingsLabel}> {data.settings}
          <Icon name={Platform.OS === "ios" ? "ios-settings" : "md-settings"}
          size={40} color='#A9A9A9'/>
          </Text>

          <FlatList
          data={this.state.rows}
          extraData = {this.state.icon}
          renderItem={this.renderItem}
          keyExtractor={this.extractKey}
          />

          <Modal visible = {this.state.showMe}
          onRequestClose = {() => {this.setState({ showMe : false })}}>
          <View style={styles.modalView}>
          <Text style={styles.modalText}>{data.infoText}</Text>
          </View>
          <TouchableOpacity style={styles.closeIcon} onPress = {() =>{this.setState({ showMe : false })}}>
          <Icon name={Platform.OS === "ios" ? "ios-close" : "md-close"}
          size={100} color='#EB2C2C'/>
          </TouchableOpacity>
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
      modalView: {
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 5,
        borderColor: "#6ACCCB",
      },
      modalText: {
        textAlign: 'center',
        fontFamily: "Roboto-Light",
        fontSize: 20,
      },
      closeIcon: {
        marginTop: 30,
        alignItems: 'center',
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
        color: '#fff',
      },
    });
