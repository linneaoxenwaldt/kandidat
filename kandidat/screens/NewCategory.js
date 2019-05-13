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
  FlatList,
  ImageBackground,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class NewCategory extends React.Component {
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

    constructor(props) {
      super(props)
      const rows = [
        {id: '0', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fanimals.jpg?alt=media&token=b37a7136-2043-4f5f-ae03-a5afd5aed9a3'},
        {id: '1', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2FColors.jpg?alt=media&token=131c5e18-f477-4b87-8912-e1cdc8ecb2d7'},
        {id: '2', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Ffoodpic.jpg?alt=media&token=33280555-1ee5-44c2-a709-03b5a5b363b4'},
        {id: '3', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2FGavelpic2.jpg?alt=media&token=a12267ee-2e38-4130-a08b-4c809e586a65'},
        {id: '4', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fmoviepic.jpg?alt=media&token=50f1c532-db00-459c-8caf-7f03fd4f80a4'},
        {id: '5', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fnamn.jpg?alt=media&token=efc11782-abdf-46fe-9c50-fc345263c7c3'},
        {id: '6', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fpeople.jpg?alt=media&token=c9177688-9af9-486a-9100-3c1c364ab38f'},
        {id: '7', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fshoppingpic.jpg?alt=media&token=d6810677-0b60-4cbf-974f-1f310bfc1df0'},
        {id: '8', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fsnowpic2.jpg?alt=media&token=0f61a006-4573-4f2f-a08f-92ea98472845'},
        {id: '9', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fsportpic.jpg?alt=media&token=03710174-1ad1-4a11-ad17-efd221189f0f'},
        {id: '10', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fsummer.jpg?alt=media&token=1b1d499c-ee72-4b9b-bc89-7578e03e5f09'},
        {id: '11', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Ftravelpic.jpg?alt=media&token=e28f24e2-64e4-4684-9918-fab44dd46eae'},
        {id: '12', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2Fwinterpic.jpg?alt=media&token=3001be50-c486-416a-88de-a034661459e0'},
        {id: '13', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2FColor1.png?alt=media&token=d4b8ea5f-6502-4ec5-a2ad-e68887e5b9dc'},
        {id: '14', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2FColor2.png?alt=media&token=59a88da8-4e59-4a92-9087-089ad933f332'},
        {id: '15', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2FColor3.png?alt=media&token=387df66e-daee-4045-857d-4748c0d8b73a'},
        {id: '16', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2FColor4.png?alt=media&token=6cb38ec7-d95d-44ec-bf78-02b1cfb0325f'},
        {id: '17', img: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2FColor5.png?alt=media&token=a24c4f41-9995-4fb0-8d61-2a9987204a1d'},
      ]
      this.extractKey = ({id}) => id
      this.state={
        showMe: false,
        borderSize: 0,
        text: "",
        rows: rows,
        choosenImg: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/Category%20Image%2FColor1.png?alt=media&token=d4b8ea5f-6502-4ec5-a2ad-e68887e5b9dc',
      }
    }

    createNewCat() {
      var that = this
      if(this.state.text == "") {
        Alert.alert(
          data.missingCatName,
        )
      }
      else {
        var user = firebase.auth().currentUser;
        var userID = user.uid;
        var db = firebase.firestore();
        db.collection("Users").doc(userID).collection("Category").add({
          CatName: this.state.text,
          CatImg: this.state.choosenImg,
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          var cat = {id: docRef.id}
          that.props.navigation.state.params.addToCategoryList(cat);
          that.props.navigation.navigate('AlternativeScreen', {CatID: docRef.id, prePage: "New"})
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      }
    }

    setBackground(item) {
      this.state.choosenImg = item.img
      this.setState({
        showMe: false
      })
    }

    renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
        onPress={() => this.setBackground(item)}>
        <Image
        source={{uri: item.img}}
        style={styles.picStyle}/>
        </TouchableOpacity>
      )
    }

    render() {
      return (
        <View style={styles.container}>
        <Text style={styles.categoryLabel}>{data.newCategory}</Text>
        <Modal
        visible={this.state.showMe}
        onRequestClose = {() => {this.setState({ showMe : false })}}>
        <View style={styles.modalView}>
        <Text style={styles.modalText}>{data.chooseBackground}</Text>
        <TouchableOpacity
        style={styles.closeContainer}
        onPress={()=>{
          this.setState({
            showMe: false
          })}}>
          <Text style={styles.closeText}>{data.closeWindow}</Text>
          </TouchableOpacity>

          <FlatList
          data={this.state.rows}
          renderItem={this.renderItem}
          keyExtractor={this.extractKey}
          />
          </View>
          </Modal>

          <View style={styles.nameCategoryCon}>
          <TextInput
          style={styles.nameText}
          placeholder={data.enterCatName}
          onChangeText={(text) => this.setState({text})}/>
          </View>

          <View style={styles.picContain}>
          <TouchableOpacity
          onPress={()=>{
            this.setState({
              showMe: true
            })}}>
            <Text style={styles.picText}>{data.photo}
            <Icon name={Platform.OS === "ios" ? "ios-image" : "md-image"}
            color='#FFFFFF'
            size={30}/>
            </Text>
            </TouchableOpacity>
            </View>

            <Text style={styles.catText}>{data.yourNewCat}</Text>

            <View style={styles.createdCat}>
            <ImageBackground
            source={{uri: this.state.choosenImg}}
            style={{width: '100%', height: 100, justifyContent: 'center'}}>
            <Text style={styles.createdCatText}>{this.state.text}</Text>
            </ImageBackground>
            </View>

            <View style={styles.buttonBottomContainer}>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('NewVote')}
            >
            <Icon
            name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
            size={55}
            color="#A9A9A9"/>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => this.createNewCat()}
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
          height: '100%',
          flex: 1,
          backgroundColor: '#FFFFFF',
          textAlign: "center",
          alignItems: "center",
        },
        categoryLabel: {
          marginTop: 40,
          marginBottom: 20,
          fontSize: 34,
          color: '#000000',
          textAlign: 'center',
          fontFamily: "Roboto-Light",
        },
        nameCategoryCon: {
          width: 350,
          height: 70,
          backgroundColor: '#6BCDFD',
          marginTop: 10,
          justifyContent: 'center',
          borderRadius: 50,
          borderWidth: 4,
          borderColor: '#3BCDFD',
        },
        nameText: {
          fontFamily: 'Roboto-Light',
          color: '#FFFFFF',
          fontSize: 24,
          textAlign: 'center',
        },
        picContain: {
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderRadius: 50,
          borderColor: '#BA55B3',
          marginTop: 30,
          height: 70,
          width: 350,
          backgroundColor: '#BA55B3',
          marginBottom: 30,
        },
        picText:{
          justifyContent:'center',
          fontFamily: 'Roboto-Light',
          color: '#FFFFFF',
          fontSize: 24,
          textAlign: 'center',
          margin:10,
          paddingBottom:10,
        },
        modalView:{
          flex: 1,
          width: '100%',
          marginTop: 10,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
        },
        modalText: {
          paddingTop: 50,
          fontFamily: 'Roboto-Light',
          fontSize: 25,
          paddingBottom: 10,
        },
        picStyle: {
          height: 100,
          width: 350,
          margin: 5,
        },
        closeText: {
          marginBottom: 10,
          marginTop: 10,
          alignItems: 'center',
          fontSize: 15,
          color: 'white',
          justifyContent:'center',
        },
        closeContainer: {
          marginBottom: 30,
          marginTop: 10,
          backgroundColor: '#CBA3D5',
          alignItems: 'center',
          borderRadius: 20,
          width:150,
          height: 50,
          alignItems:'center',
          justifyContent:'center',
        },
        catText: {
          color: "#000",
          fontFamily: 'Roboto-Light',
          fontSize: 25,
          margin: 10,
        },
        createdCat: {
          marginTop: 10,
          height: 100,
          width: '100%',
          backgroundColor: 'transparent',
          justifyContent: 'center',
          borderRadius:6,
          borderColor:'black',
          marginBottom: 50,
        },
        createdCatText: {
          fontSize: 30,
          color: '#FFFFFF',
          marginLeft: 10,
        },
        buttonBottomContainer: {
          flexDirection:'row',
          justifyContent: 'space-between',
          width: 340,
        },
      });
