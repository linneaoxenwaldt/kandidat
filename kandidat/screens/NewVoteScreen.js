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
import { ExpoLinksView } from '@expo/samples';

export default class NewVoteScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: (
      <Image source={require('../assets/images/100whitte.png')}/>),
      headerStyle: {
        backgroundColor: 'red',
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

    render() {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>CATEGORIES</Text>
            <TouchableOpacity
                      style={styles.createOwnCategory}
                      onPress={() => this.props.navigation.navigate('Home')}
                      underlayColor='#fff'>
                      <Text style={styles.ownCategoryText}>Create your own category!</Text>
             </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 0,
  },
  categoryContainer: {
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 50,
    color: '#000000',
    textAlign: 'center',
  },
  createOwnCategory: {
    width: 350,
    height: 70,
    margin: 10,
    padding: 10,
    backgroundColor:'#1E6738',
    borderRadius:30,
    borderWidth: 1,
    borderColor: '#fff'
  },
  ownCategoryText: {
    color:'#fff',
    fontSize: 25,
    textAlign:'center',
    paddingLeft : 1,
    paddingRight : 1
  },
});
