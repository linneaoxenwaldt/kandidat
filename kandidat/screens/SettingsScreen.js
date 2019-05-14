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
      this.state = {
      }
    }

      render() {
        return (
          <View style={styles.container}>
          <Text style={styles.settingsLabel}>{data.info}</Text>
          <View style={styles.modalView}>
          <Text style={styles.modalText}>{data.infoText}</Text>
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
      settingsLabel: {
        fontSize: 40,
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
      modalView: {
        alignItems: 'center',
        padding: 10,
        //marginTop: 5,
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
