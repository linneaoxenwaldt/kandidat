import React from 'react';
import { ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  Alert,
  PanResponder,
  Animated,
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from 'expo';
import data from '../data/engWord.json';

const Alternatives = [
  { id: "1", text: 'hej1'},
  { id: "2", text: 'hej2'},
  { id: "3", text: 'hej3'},
  { id: "4", text: 'hej4'},
  { id: "5", text: 'hej5'},
]

export default class VoteScreen extends React.Component {

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

    constructor() {
      super()
      this.position = new Animated.ValueXY()
      this.state = {
        currentIndex: 0
      }

      this.colors = ['#6ACCCB', '#94B4C1', '#8FBC8F', '#CBA3D5', '#689999']

      this.rotate = this.position.x.interpolate({
        inputRange: [-150, 0, 150],
        outputRange: ['-15deg', '0deg', '15deg'],
        extrapolate: 'clamp'
      })

      this.rotateAndTranslate = {
        transform: [{
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })
    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [1, 0.6, 1],
      extrapolate: 'clamp'
    })


  }
  componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: 400, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -400, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 10
          }).start()
        }
      }
    })
  }

  renderAlternatives = () => {

    return Alternatives.map((item, i) => {

      if (i < this.state.currentIndex) {
        return null
      }
      else if (i == this.state.currentIndex) {

        return (
          <Animated.View
          {...this.PanResponder.panHandlers}
          key={item.id} style={[this.rotateAndTranslate, { backgroundColor: this.colors[i % this.colors.length], height: 350, width: 280, borderRadius: 20, position: 'absolute'}]}>

          <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
          <Text style={styles.likeText}>YES</Text>
          </Animated.View>
          <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
          <Text style={styles.dislikeText}>NO</Text>
          </Animated.View>

          <Text style={styles.alternativeText}> Detta är: {item.text} </Text>
          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View key={item.id} style={[{
            opacity: this.nextCardOpacity,
            transform: [{ scale: this.nextCardScale }], backgroundColor: this.colors[i % this.colors.length],
            height: 350, width: 280, borderRadius: 20, position: 'absolute'}]}>

          <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
          <Text style={styles.likeText}>YES</Text>
          </Animated.View>
          <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
          <Text style={styles.dislikeText}>NO</Text>
          </Animated.View>

          <Text style={styles.alternativeText}> Detta är: {item.text} </Text>
          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    return (
      <View style={styles.container}>
      <View style={styles.card}>
      {this.renderAlternatives()}
      </View>


      <View style={styles.thumbsContain}>
      <TouchableOpacity onPress={() => alert('You dislike it!')}>
      <Icon name={Platform.OS === "ios" ? "ios-thumbs-down" : "md-thumbs-down"}
      color="#008080"
      size={80}/>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert('You like it!')}>
      <Icon name={Platform.OS === "ios" ? "ios-thumbs-up" : "md-thumbs-up"}
      color="#008080"
      size={80}/>
      </TouchableOpacity>

      </View>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    alignItems: 'center',
    margin: 40,
  },
  alternativeText: {
    marginTop: 150,
    textAlign: "center",
    color: "#000",
    fontFamily: "Roboto-Light",
    fontSize: 30,
  },
  likeText: {
    borderWidth: 1,
    borderColor: 'green',
    color: 'green',
    fontSize: 28,
    fontWeight: '800',
    padding: 10
  },
  dislikeText: {
    borderWidth: 1,
    borderColor: 'red',
    color: 'red',
    fontSize: 28,
    fontWeight: '800',
    padding: 10
  },
  thumbsContain: {
    flexDirection:'row',
    justifyContent: 'space-between',
    marginTop: 400,
    padding: 15,
  }
});
