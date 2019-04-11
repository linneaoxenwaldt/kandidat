import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  TextInput,
  Alert
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

    render() {
      return (
        <View style={styles.container}>
        <View style={styles.picContain}>
        <Text style={styles.picText}>Upload a photo...</Text>
        <TouchableOpacity
        style={styles.picContain}
        onPress={() => this.props.navigation.navigate('HomeScreen')}>
        </TouchableOpacity>
        </View>


        <View style={styles.nameCategoryCon}>
        <TextInput
        style={styles.nameText}
        placeholder="Enter category name..."/>
        </View>

        <View style={styles.backArrowCon}>
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('AlternativeScreen')}>
        <Icon
        name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
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
      justifyContent: 'center',
    },
    picContain: {
      height:150,
      width:150,
      backgroundColor: '#CBA3D5',
      margin: 10,
      marginBottom: 30,
      alignItems: 'center',
    },
    nameCategoryCon: {
      flexDirection:'row',
      width: 300,
      height: 70,
      backgroundColor: '#CBA3D5',
      marginTop: 150,
      marginLeft: 30,
    },
    nameText: {
      fontFamily: 'Roboto-Light',
      color: '#FFFFFF',
      fontSize: 20,
      alignSelf: 'center',
    },
    backArrowCon: {
      justifyContent: 'center',
      marginBottom: 10,
      marginLeft:5,
    },

  });
