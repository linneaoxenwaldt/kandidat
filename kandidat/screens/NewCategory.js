import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";

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
        headerLeft: (
          <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
          <Icon
          name={Platform.OS === "ios" ? "ios-menu" : "md-menu"}
          size={40}/>
          </TouchableOpacity>
        ),
      };
    };

    renderItem = ({item}) => {
      return (
        <Text style={styles.row}>
        {item.text}
        </Text>
      )
    }

    render() {
      return (
        <View style={styles.container}>
        <TouchableOpacity
        style={styles.createOwnCategory}
        onPress={() => this.props.navigation.navigate('NewCategory')}
        underlayColor='#fff'>
        <Text style={styles.ownCategoryText}>Enter Category name...</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.createOwnCategory}
        onPress={() => this.props.navigation.navigate('NewCategory')}
        underlayColor='#fff'>
        <Text style={styles.ownCategoryText}>Upload a picture... <Icon
        name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
        size={25}
        /></Text>
        </TouchableOpacity>
        <View style={styles.readyMadeCategoryContainer}>
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
    contentContainer: {
      paddingTop: 0,
    },
    createOwnCategory: {
      width: 350,
      height: 70,
      margin: 10,
      padding: 10,
      backgroundColor:'#BA55B3',
      borderRadius:30,
      borderWidth: 1,
      borderColor: '#fff'
    },
    ownCategoryText: {
      fontFamily: "Roboto-Light",
      color:'#fff',
      fontSize: 25,
      textAlign:'center',
      paddingLeft : 1,
      paddingRight : 1,
    },
  });
