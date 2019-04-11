import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';

export default class NewCategory extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Image source={require('../assets/images/100whitte.png')}/>),
        headerStyle: {
          backgroundColor: '#008080',
          height: 70,
          marginLeft: 10,
        },
      };
    };

    constructor() {
      super()
      this.state={
        showMe: false,
      }
    };

    render() {
      return (
        <View style={styles.container}>
          <Modal visible={this.state.showMe}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}> Här kan vi lägga bilder kanske? </Text>
              <Icon name={Platform.OS === "ios" ? "ios-image" : "md-image"} size={50} color="blue"/>
              <Icon name={Platform.OS === "ios" ? "ios-image" : "md-image"}  size={50} color="purple"/>
              <Icon name={Platform.OS === "ios" ? "ios-image" : "md-image"}  size={50} color="green"/>
              <TouchableOpacity onPress={()=>{
                this.setState({
                  showMe: false
                })}}>
                <Text style={styles.closeText}> Close Window </Text>
                </TouchableOpacity>
            </View>
          </Modal>


        <View style={styles.picContain}>
        <TouchableOpacity
        onPress={()=>{
          this.setState({
            showMe: true
          })}}>
        <Icon name={Platform.OS === "ios" ? "ios-image" : "md-image"}
        color='#FFFFFF'
        size={150}/>
        </TouchableOpacity>
        <Text style={styles.picText}>Upload a photo...
        </Text>
        </View>

        <View style={styles.nameCategoryCon}>
        <TextInput
        style={styles.nameText}
        placeholder="Enter a category name..."/>
        </View>
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
      paddingTop: 20,
      backgroundColor: '#FFFFFF',
      marginLeft: 30,
    },
    picContain: {
      height:200,
      width:200,
      backgroundColor: '#CBA3D5',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 50,
      borderRadius: 5,
      borderWidth: 6,
      borderColor: '#BA55B3',
    },
    picText:{
      marginBottom: 15,
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 20,
    },
    modalView:{
      marginTop: 20,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#BA55B3',
    },
    modalText: {
      paddingTop: 10,
      fontFamily: 'Roboto-Light',
      fontSize: 20,
      paddingBottom: 10,
    },
    closeText: {
      marginBottom: 20,
      marginTop: 10,
      backgroundColor: '#CBA3D5',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 3,
      borderColor: '#BA55B3',
    },
    nameCategoryCon: {
      width: 300,
      height: 70,
      backgroundColor: '#6BCDFD',
      marginTop: 30,
      justifyContent: 'center',
      borderRadius: 30,
      borderWidth: 6,
      borderColor: '#3BCDFD',
    },
    nameText: {
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 24,
      textAlign: 'center',
    },
    forwardArrow: {
      marginTop: 30,
      marginLeft:280,
    },
    backArrow: {
      margin: 0,
      padding: 0,
    }
  });
