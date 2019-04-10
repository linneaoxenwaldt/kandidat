import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  FlatList,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import { ExpoLinksView } from '@expo/samples';

const rows = [
  {id: '0', text: 'Test0'},
  {id: '1', text: 'Test1'},
  {id: '2', text: 'Test2'},
  {id: '3', text: 'Test3'},
  {id: '4', text: 'Test4'},
  {id: '5', text: 'Test5'},
  {id: '6', text: 'Test6'},
  {id: '7', text: 'Test7'},
  {id: '8', text: 'Test8'},
]

const extractKey = ({id}) => id

export default class NewVoteScreen extends React.Component {
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
  size={40}
  color='#FFFFFF'/>
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
            <Text style={styles.categoryLabel}>CATEGORIES</Text>
            <TouchableOpacity
                      style={styles.createOwnCategoryContainer}
                      onPress={() => this.props.navigation.navigate('NewCategory')}
                      underlayColor='#fff'>
                      <Text style={styles.ownCategoryText}>Create your own category! <Icon
                        name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
                        size={25}
                      /></Text>
             </TouchableOpacity>
          <View style={styles.readyMadeCategoryContainer}>
        <Text style={styles.readyMadeCategoryLabel}>Ready made categories</Text>
        </View>
        <FlatList
  style={styles.container}
  data={rows}
  renderItem={this.renderItem}
  keyExtractor={extractKey}
/>
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
  categoryLabel: {
    fontSize: 50,
    color: '#000000',
    textAlign: 'center',
    fontFamily: "Roboto-Light",
  },
  createOwnCategoryContainer: {
    justifyContent: 'center',
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
  readyMadeCategoryContainer: {
    alignItems: 'center',
  },
  readyMadeCategoryLabel: {
    fontFamily: "Roboto-Light",
    color: '#000000',
    fontSize: 25,
  },
  row: {
  fontFamily: "Roboto-Light",
  padding: 15,
  marginBottom: 5,
  backgroundColor: 'skyblue',
},
});
