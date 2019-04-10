import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
          title: 'app.json',
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

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <ExpoConfigView />;
  }
}
