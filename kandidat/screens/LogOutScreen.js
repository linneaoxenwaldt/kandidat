import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Button,
  View
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import { ExpoLinksView } from '@expo/samples';
import * as firebase from 'firebase';



export default class LogOutScreen extends React.Component {

  onSignoutPress = () => {
    firebase.auth().signOut();
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

  render() {
    return (

      <View style={styles.container}>
      <Button title = 'Logout' onPress = {this.onSignoutPress} />
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
});
