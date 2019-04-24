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
import * as firebase from 'firebase';
import 'firebase/firestore';

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

    constructor(props) {
      super(props)
      this.state={
        showMe: false,
        borderSize: 0,
        text: "",
      }
    }

    createNewCat() {
      var that = this
      console.log(this.state.text)
      if(this.state.text == "") {
        Alert.alert(
          data.missingCatName,
        )
      }
      else {
      var db = firebase.firestore();
      db.collection("Category").add({
    CatName: this.state.text,
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
    that.props.navigation.navigate('AlternativeScreen', {CatID: docRef.id, prePage: "New"})
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});
>>>>>>> b051ffb851143040e7d1be4ba38b439aa1985da8
    }

    handleClick = () => {
      if (this.state.borderWidth === 0){
        this.setState({borderSize: 12});
      } else {
        this.setState({borderSize: 0});
      }
    }

    render() {
      return (
        <View style={styles.container}>
        <Modal visible={this.state.showMe}>
        <View style={styles.modalView}>
        <Text style={styles.modalText}> Här kan vi lägga bilder kanske? </Text>

        <TouchableOpacity>
        <Image borderWidth={this.state.borderSize} onPress={() => handleClick(this)} source={require('../assets/images/tacobock.jpg')} style={styles.picStyle}/>
        </TouchableOpacity>

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
            placeholder="Enter a category name..."
            onChangeText={(text) => this.setState({text})}/>
            </View>
            <View style={styles.buttonBottomContainer}>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('NewVote')}
            >
            <Icon
            name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
            size={70}
            color="#A9A9A9"/>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => this.createNewCat()}
            >
            <Icon
            name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
            size={70}
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
          //marginLeft: 30,
          textAlign: "center",
          alignItems: "center",
        },
        picContain: {
          height:200,
          width:200,
          backgroundColor: '#CBA3D5',
          alignItems: 'center',
          justifyContent: 'center',
          //marginLeft: 50,
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
        picStyle: {
          height: 100,
          width: 100,
          padding: 10,
          borderColor: 'blue',
          borderWidth: 10,
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
        buttonBottomContainer: {
          flexDirection:'row',
          justifyContent: 'space-between',
          width: 340,
        },
      });
