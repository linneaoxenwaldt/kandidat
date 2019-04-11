import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  FlatList,
  TextInput,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import { ExpoLinksView } from '@expo/samples';
import AntIcon from "react-native-vector-icons/AntDesign";


export default class AlternativeScreen extends React.Component {

  constructor(props){
    super(props);
    this.rows = [
      {id: '0', text: 'Alternativ 1'},
      {id: '1', text: 'Alternativ 2'},
      {id: '2', text: 'Alternativ 3'},

    ]
    this.extractKey = ({id}) => id

    this.state = {
      arrayHolder: [],
      textInput_Holder: ''
    }
  }

  componentDidMount() {
    this.setState({ arrayHolder: [...this.rows] })
  }

  joinData = () => {
    this.rows.push({title : this.state.textInput_Holder});
    this.setState({ arrayHolder: [...this.rows] })
  }

  FlatListItemSeparator = () => {
    return (
      <View
      style={{
        height: 2,
        width: "100%",
        backgroundColor: "white",
      }}
      />
    );
  }

  GetItem(item) {
    Alert.alert(item);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Image source={require('../assets/images/100whitte.png')}/>),
        headerStyle: {
          backgroundColor: '#008080',
          height: 70,
          marginLeft: 10,
        },
        headerRight: (
          <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
          <AntIcon name="delete" color="white" size={30} style={styles.trashIcon} />
          </TouchableOpacity>
        ),
      };
    };


    renderItem = ({item}) => {
      return (
        <TouchableOpacity onPress={() => alert('Remove')}
        style={styles.fab}
        style={styles.row}
        underlayColor='#fff'>
        <Text style={styles.readyMadeAlternativLabel}
        style={styles.readyMadeAlternativLabel}>
        {item.text}
        </Text>
        <Icon name={Platform.OS === "ios" ? "ios-remove-circle-outline" : "md-add-circle-outline"}
        size={40}
        style={styles.RemoveIcon}
        />
        </TouchableOpacity>
      )
    }


    render() {
      return (
        <View style={styles.container}>
        <Text style={styles.AlternativLabel}>Alternatives</Text>
        <TouchableOpacity onPress={() => alert('Name of alternative')} style={styles.fab}
        style={styles.createOwnAlternativ}
        underlayColor='#fff'>

        <TextInput
        placeholder="Add new "
        onChangeText={data => this.setState({ textInput_Holder: data })}
        style={styles.ownAlternativText}
        underlineColorAndroid='white'
        />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.joinData} activeOpacity={0.7}
        style={styles.AddButton}>
        <Text style={styles.ownAlternativText}>
        <Icon name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
        size={40}
        style={styles.RemoveIcon}
        /></Text>
        </TouchableOpacity>

        <FlatList
        data={this.state.arrayHolder}
        width='100%'
        extraData={this.state.arrayHolder}
        keyExtractor={(index) => index.toString()}
        ItemSeparatorComponent={this.FlatListItemSeparator}
        renderItem={({ item }) => <Text style={styles.row} onPress={this.GetItem.bind(this, item.title)} > {item.title} </Text>}
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
    contentContainer: {
      paddingTop: 0,
    },
    AlternativContainer: {
      alignItems: 'center',
    },
    AlternativLabel: {
      fontSize: 30,
      color: '#000000',
      textAlign: 'center',
      fontFamily: "Roboto-Light",
    },
    createOwnAlternativ: {
      width: 300,
      height: 70,
      margin: 30,
      paddingBottom: 20,
      backgroundColor:'#BA55B3',
      borderRadius:30,
      borderWidth: 1,
      borderColor: '#fff',
      justifyContent: 'center'
    },
    ownAlternativText: {
      fontFamily: "Roboto-Light",
      color:'#fff',
      fontSize: 25,
      textAlign:'center',
      paddingLeft : 1,
      paddingRight : 1,
    },
    readyMadeAlternativContainer: {
      alignItems: 'center',
    },
    readyMadeAlternativLabel: {
      fontFamily: "Roboto-Light",
      color: '#000000',
      fontSize: 25,
      color: 'white'
    },
    row: {
      fontFamily: "Roboto-Light",
      padding: 10,
      marginBottom: 5,
      backgroundColor: '#6ACCCB',
      fontSize: 20,
      color: 'white'
    },
    fab: {
      position: 'absolute',
      width: 76,
      height: 76,
      alignItems: 'center',
      justifyContent: 'center',
      right: 20,
      bottom: 20,
      backgroundColor: '#03A9F4',
      borderRadius: 30,
      elevation: 8
    },
    AddButton: {
      width: 70,
      height: 70,
      margin: 10,
      paddingBottom: 20,
      backgroundColor:'#BA55B3',
      borderRadius:50,
      borderWidth: 1,
      borderColor: '#fff',
      justifyContent: 'center',


    },
    AddIcon: {
      justifyContent: 'flex-end',
      color: 'white',
    },
    RemoveIcon: {
      justifyContent: 'flex-end',
      color: 'white',
    },

    trashIcon: {
      //flexBasis: 50,
      justifyContent: 'flex-end',
      color: '#FFFFFF',
      marginLeft: 30,
    },
  });
