import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import data from '../data/engWord.json';



export default class SavedResultScreen extends React.Component {
  constructor(props){
    super(props);
    this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']
    const rows = [
      {id: '0', text: 'Vote A'},
      {id: '1', text: 'Vote B'},
      {id: '2', text: 'Vote C'},
      {id: '3', text: 'Vote D'},
      {id: '4', text: 'Vote E'},
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

    deleteResult(delItem) {
      this.setState(prevState => ({rows: prevState.rows.filter(item => item !== delItem) }));
    }

    renderItem = ({item, index}) => {
      var msg = `${data.sureMsg} ${item.text}?`
      return (
        <ListItem
        containerStyle={{ backgroundColor: this.colors[index % this.colors.length]}}
        titleStyle={{color: '#FFFFFF', fontSize: 30}}
        roundAvatar
        title={item.text}
        rightIcon = {<Icon
          name={Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-forward"}
          size={25}
          color='#FFFFFF'
          onPress={() => Alert.alert(
            data.deleteResult,
            msg,
            [
              {text: 'Cancel', onPress: () => this.props.navigation.navigate('SavedResults')},
              {text: 'OK', onPress: () => this.deleteResult(item)},
            ],
            { cancelable: false })}/>}
            />)
          }

          render() {
            return (
              <View style={styles.container}>
              <View style={styles.resultContainer}>
              <Text style={styles.savedResultLabel}>Results
              <Text> </Text>
              <Icon
                name={Platform.OS === "ios" ? "ios-stats" : "md-stats"}
                size={30}/></Text>

              <FlatList
              data={this.state.rows}
              renderItem={this.renderItem}
              keyExtractor={this.extractKey}
              />
              </View>

              <View style={styles.savedesultContainer}>
              <Text style={styles.savedResultLabel}>Saved Results
              <Text> </Text>
              <Icon
                name={Platform.OS === "ios" ? "ios-save" : "md-save"}
                size={30}/>
                </Text>

              <FlatList
              data={this.state.rows}
              renderItem={this.renderItem}
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
          resultContainer:{
            height: '50%'
          },

          savedResultLabelresultContainer:{
            height: '50%'
          },

          savedResultLabel: {
            fontSize: 25,
            color: '#000000',
            textAlign: 'center',
            fontFamily: "Roboto-Light",
            padding: 20,
          },

          row: {
            fontFamily: "Roboto-Light",
            color: '#FFFFFF',
            padding: 15,
            marginBottom: 5,
            fontSize: 20,
            justifyContent: 'center',
          },
        });
