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
import { LinearGradient } from 'expo';

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


        <LinearGradient
        colors={['#FFFFFF', '#6ACCCB']}
        style={{ height: '100%', alignItems: 'center', borderRadius: 5 }}>

        </LinearGradient>
        </View>
      );
    }
  }


  const styles = StyleSheet.create({
    container: {

    }
  });
