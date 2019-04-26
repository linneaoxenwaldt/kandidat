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
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import { ListItem } from 'react-native-elements';
import data from '../data/engWord.json';

export default class OngoingVoteScreen extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    const rows = [
      {id: '0', text: 'Request 0', voteReq: true},
      {id: '1', text: 'Request1',  voteReq: true},
      {id: '2', text: 'Request2',  voteReq: true},
      {id: '3', text: 'Request3',  voteReq: true},
      {id: '4', text: 'FriendRequest4',  friendReq: true},
      {id: '5', text: 'FriendRequest5',  friendReq: true},
      {id: '6', text: 'FriendRequest6',  friendReq: true},
      {id: '7', text: 'FriendRequest7',  friendReq: true},
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

    voteRequests = ({item, index}) => {
      if(item.voteReq == true ) {
        return (
          <ListItem
          containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
          titleStyle={{color: '#FFFFFF', textAlign:'center', fontSize: 20,}}
          title={item.text}/>
        )}
      }

      friendRequests = ({item, index}) => {
        if(item.friendReq == true ) {
          return (
            <ListItem
            containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
            titleStyle={{color: '#FFFFFF', textAlign:'center', fontSize: 20,}}
            title={item.text}/>
          )}
        }

        render() {
          return (
            <View style={styles.container}>
            <Text style={styles.requestLabel}> {data.requests} </Text>

            <View style={styles.voteReq}>
            <Text style={styles.textLabel}> Votes </Text>
            <View style={styles.miniTextview}>
            <Text> <Icon2
              name={'gesture-swipe-left'}
              size={30}/>  Decline  </Text>
            <Text> Accept <Icon2
              name={'gesture-swipe-right'}
              size={30}/></Text>
            </View>
            <FlatList
            data={this.state.rows}
            renderItem={this.voteRequests}
            keyExtractor={this.extractKey}
            />
            </View>


            <View style={styles.friendReq}>
            <Text style={styles.textLabel}> Friends </Text>
            <View style={styles.miniTextview}>
            <Text> <Icon2
              name={'gesture-swipe-left'}
              size={30}/>  Decline  </Text>
            <Text> Accept <Icon2
              name={'gesture-swipe-right'}
              size={30}/></Text>
            </View>
            <FlatList
            data={this.state.rows}
            renderItem={this.friendRequests}
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
          backgroundColor: '#FFFFFF',
        },
        requestLabel: {
          fontSize: 40,
          color: '#000000',
          textAlign: 'center',
          fontFamily: "Roboto-Light",
          marginTop: 15,
        },
        textLabel: {
          marginTop: 10,
          fontSize: 30,
          color: '#000000',
          textAlign: 'center',
          fontFamily: "Roboto-Light",
        },
        miniTextview: {
          marginLeft: 10,
          width: 340,
          flexDirection:'row',
          justifyContent: 'space-between',
          color: '#000000',
          fontFamily: "Roboto-Light",
        },
        voteReq: {
          height: 260,
        },
        friendReq: {
          height: 260,
        },
        arrowBack: {
          marginLeft: 10,
          flexDirection:'row',
          justifyContent: 'space-between',
        }
      });
