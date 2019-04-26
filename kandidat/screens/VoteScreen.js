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
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import data from '../data/engWord.json';
import { LinearGradient } from 'expo';

export default class NewCategory extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/swipesolver.appspot.com/o/100whitte.png?alt=media&token=46064aae-8998-4a9e-81fe-0af7174862fa'}} style={{width: 200, height: 50}}/>),
        headerStyle: {
          backgroundColor: '#008080',
          height: 70,
          marginLeft: 10,
        },
      };
    };

    constructor(props) {
    super(props);
    this.state = {
      myText: 'I\'m ready to get swiped!',
      gestureName: 'none',
      backgroundColor: '#fff'
    };
  }

  onSwipeUp(gestureState) {
    this.setState({myText: 'You swiped up!'});
  }

  onSwipeDown(gestureState) {
    this.setState({myText: 'You swiped down!'});
  }

  onSwipeLeft(gestureState) {
    this.setState({myText: 'You swiped left!'});
  }

  onSwipeRight(gestureState) {
    this.setState({myText: 'You swiped right!'});
  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        this.setState({backgroundColor: 'red'});
        break;
      case SWIPE_DOWN:
        this.setState({backgroundColor: 'green'});
        break;
      case SWIPE_LEFT:
        this.setState({backgroundColor: 'blue'});
        break;
      case SWIPE_RIGHT:
        this.setState({backgroundColor: 'yellow'});
        break;
    }
  }

    render() {

      const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
          };

      return (
        <View style={styles.container}>

        <View style={styles.swipecontain}>

        <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
        >
        <Text>{this.state.myText}</Text>
        <Text>onSwipe callback received gesture: {this.state.gestureName}</Text>
      </GestureRecognizer>

        </View>


        <View style={styles.thumbsContain}>
        <TouchableOpacity>
        <Icon name={Platform.OS === "ios" ? "ios-thumbs-down" : "md-thumbs-down"}
        color="#008080"
        size={80}/>
        </TouchableOpacity>
        <TouchableOpacity>
        <Icon name={Platform.OS === "ios" ? "ios-thumbs-up" : "md-thumbs-up"}
        color="#008080"
        size={80}/>
        </TouchableOpacity>
        </View>

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
      flex: 1,
    },
    swipecontain: {
      height: 230,
      width: 200,
    },
    thumbsContain: {
      flexDirection:'row',
      justifyContent: 'space-between',

    },
  });
