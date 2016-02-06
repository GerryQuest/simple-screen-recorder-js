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
     recordButtonShadow: new Animated.Value(0),
     countdown: 3
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
      {duration: 1000,
       delay: 100,
       easing: Easing.in(Easing.ease),
       toValue: 1}
    ).start();  
  },
  componentDidMount: function () {
    this.runAnimation();
    
    // Animated.timing (
    //   this.state.recordButtonShadow,
    //   {duration: 6000,
    //   delay:3000,
    //   easing: Easing.in(Easing.ease),
    //   toValue: 1}
    // ).start();
    this.setState({color: this.state.recordButtonFade.interpolate({
      inputRange: [0,0.3, 1],
      outputRange: ["rgb(156,41,41)", "rgb(255,28,28)", "rgb(156,41,41)"]
    })});
    // this.setState({countdown: 3});
    // use interpolate to change text to recording and press to stop
    // this.setState({count: this.state.countdown.interpolate({
    //   inputRange: [1, 2, 3],
    //   outputRange: [3, 2, 1]
    // })});
  },
  minusOne: function () {
    // this.setState({countdown: this.state.countdown - 1});
    if (this.state.countdown <= 1) {
      clearInterval();
    } else {
      this.setState({countdown: this.state.countdown - 1});
    }

  },
  startCountdown: function () {
    // var timing = Animated.timing;
    // Animated.sequence([
    //   timing (this.state.countdown,
    // 	     {duration: 1000,
    // 	      toValue: 2
    // 	     }),
    //   Animated.delay(400),
    //   timing (this.state.countdown,
    // 	     {duaration: 1000,
    // 	     toValue: 3}),
    //   Animated.delay(400),
    //   timing (this.state.countdown,
    // 	     {duration: 1000,
    // 	     toValue: 4})
      
    // ]).start();

    // Alert.alert("alert", this.state.countdown);
    // this.setState({countdown: this.state.countdown.toString() + 1});


    var countdown = this.state.countdown;
    if (this.state.countdown === 3) {
      this.minusOne();
      setInterval(this.minusOne, 1000);
      
    } else {
      
    }

    // if (this.state.countdown === 2) {
    //   this.minusOne();
    // }

    
    // setInterval(function () {
    //   if ( countdown  === 3 ) {
    // 	this.setState({countdown: countdown - 1});
    //   } else {
    // 	this.setState({countdown: 1192});
    // 	clearInterval();
    //   }
    // }, 1000);
    
      // Animated.delay(10000);
      // this.replaceState({countdown: 2});
      // Animated.delay(10000);
      // this.replaceState({countdown: 1});
      // Animated.delay(10000);

  },
  
  toggleButtonColour: function () {
    if (this.state.color !== "rgb(255, 28, 28)") {
      this.setState({color: "rgb(255, 28, 28)"},  this.startCountdown());
     
    } else {
      this.setState({color: "rgb(156,41,41)"});  
    }
    
  },
  componentWillMount: function () {
    
  },
  render: function () {

    // var color = this.state.recordButtonFade.interpolate({
    //   inputRange: [0,0.3, 1],
    //   outputRange: ["rgb(156,41,41)", "rgb(255,28,28)", "rgb(156,41,41)"]
      
    // });

    
    return (
      
      <View style={styles.view}>
	<TouchableOpacity onPress={this.startRecord}
                          onPressIn={this.toggleButtonColour}
	                  activeOpacity={0.8}>
	   <AnimateIcon name="dot-circle-o" size={120} 
            style={{alignItems: "center",
		    alignSelf: "center",
		    justifyContent: "center",
		    elevation:15,
		    opacity: this.state.recordButtonFade,
		    color:this.state.color
		   }} />
	   <Text style={styles.textRecord}>
	     Press to Record
	   </Text>
	</TouchableOpacity>
	<View>
	<Text>
	{this.state.countdown}
        </Text>
	</View>
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
