import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  FlatList,
  Text
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import { ListItem } from 'react-native-elements';
import data from '../data/engWord.json';

export default class OngoingVoteScreen extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    const rows = [
    {id: '0', text: 'Test0', expdate: '12h', turn: true},
    {id: '1', text: 'Test1', expdate: '4h 2m', turn: false},
    {id: '2', text: 'Test2', expdate: '56m', turn: true},
    {id: '3', text: 'Test3', expdate: '33s', turn: true},
    {id: '4', text: 'Test4', expdate: '4m', turn: false},
    {id: '5', text: 'Test5', expdate: '14h 57m', turn: true},
    {id: '6', text: 'Test6', expdate: '3v', turn: false},
    {id: '7', text: 'Test7', expdate: '57m', turn: true},
    {id: '8', text: 'Test8', expdate: '33v', turn: true},
  ]
  this.extractKey = ({id}) => id
  this.state = {
    rows: rows,
  }
  }

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

    renderItem1 = ({item, index}) => {
      if(item.turn == true ) {
      return (
        <ListItem
        containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 20}}
        title={item.text}
        rightSubtitle={item.expdate}/>
      )}
    }

    renderItem2 = ({item, index}) => {
      if(item.turn == false ) {
      return (
        <ListItem
        containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 20}}
        title={item.text}
        rightSubtitle={item.expdate}/>
      )}
    }

  render() {
    return (
      <View style={styles.container}>
      <View style={styles.voteActContainer}>
      <Text style={styles.voteLabel}>
      {data.yourTurn}
      </Text>
      <FlatList
 data={this.state.rows}
 renderItem={this.renderItem1}
 keyExtractor={this.extractKey}
 />
      </View>
      <View style={styles.votePenContainer}>
      <Text style={styles.voteLabel}>
      {data.yourFriensTurn}
      </Text>
      <FlatList
 data={this.state.rows}
 renderItem={this.renderItem2}
 keyExtractor={this.extractKey}
 />
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
  voteActContainer: {
marginTop: 5,
  },
  votePenContainer: {
marginTop: 10,
  },
  voteLabel: {
    fontSize: 30,
    color: '#000000',
    textAlign: 'center',
    fontFamily: "Roboto-Light",
  }
});
