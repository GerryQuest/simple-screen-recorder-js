/*
   This component handles the Record functionality of the app. 
 */


"use strict";

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  TouchableOpacity,
  Alert,
  Animated,
  Easing
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
var AnimateIcon = Animated.createAnimatedComponent(Icon);

var Record = React.createClass ({
  startRecord: function () {
    
  },

  getInitialState: function () {
   return {
     recordButtonFade: new Animated.Value(0),
     recordButtonShadow: new Animated.Value(0)
   
   };
  },
  runAnimation: function () {
    // var timing = Animated.timing;
    // Animated.sequence ([
    //   timing (
    // 	this.state.recordButtonFade,
    // 	{duaration: 9000,
    // 	 delay: 100,
    // 	 easing: Easing.in(Easing.ease),
    // 	 toValue: 800}),
    //   Animated.delay(400),
      
    // ])
    
    Animated.timing(
      this.state.recordButtonFade,
      {duaration: 9000,
       delay: 100,
       easing: Easing.in(Easing.ease),
       toValue: 1800}
    ).start();  
  },
  componentDidMount: function () {
    this.runAnimation();
    
    Animated.timing (
      this.state.recordButtonShadow,
      {duaration: 6000,
      delay:100,
      easing: Easing.in(Easing.ease),
      toValue: 1}
    ).start();
  },
  
  render: function () {

    var color = this.state.recordButtonFade.interpolate({
      inputRange: [0,1000, 1800],
      outputRange: ["rgb(156,41,41)", "rgb(255,28,28)", "rgb(156,41,41)"]
      
    });
    
    return (
      <View style={styles.view}>
	<TouchableOpacity onPress={this.startRecord}>
	   <AnimateIcon name="dot-circle-o" size={120} 
            style={{alignItems: "center",
		    alignSelf: "center",
		    justifyContent: "center",
		    elevation:15,
		    opacity: this.state.recordButtonFade,
		    color:color,
		    borderRadius: 5,
		    borderColor: "#000",
		    borderWidth: 5
		   }} />
	   <Text style={styles.textRecord}>
	     Press to Record
	   </Text>
	</TouchableOpacity>
	<Text style={styles.recordTime}>
	  
        </Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  view: {
    // backgroundColor: "#FFF"
    flex:1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  recordButton: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center"
  },
  textRecord: {
   fontSize: 20
  }
});


module.exports = Record;
