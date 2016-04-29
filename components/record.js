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
  Easing,
  ProgressBarAndroid,
  NativeModules
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import MovingBar from "./movingbar";
import Stopwatch from "./stopwatch";
import RecordScreen from "./recordscreen";
// var TimerMixin = require('react-timer-mixin'); // Import wont allow for interval unmount

var AnimateIcon = Animated.createAnimatedComponent(Icon);

var Record = React.createClass ({
  
  startRecord: function () {
    
  },

  getInitialState: function () {
   return {
     recordButtonFade: new Animated.Value(0),
     recordButtonShadow: new Animated.Value(0),
     countdown: "Status: idle",
     instruction: "Press to Record",
     progress: 0
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
  setProgress: function () {
    var progress = (this.state.progress + 0.02) % 1;
    this.setState({progress: progress});
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

    // setInterval(this.setProgress, 1000);
  },

  componentWillUnmount: function () {
    clearInterval(this.interval);
  },
  componentDidUpdate: function () {
    // if (this.refs["PROGRESS"].isRecordingTimeUp()){
    //   this.setState({countdown: "Status: Recording Completed"});
    // }
  },
  minusOne: function () {
    // this.setState({countdown: this.state.countdown - 1});
    if (this.state.countdown == 1) {

      clearInterval(this.interval); // Stop timer
      this.setState({countdown: "Status: Recording"});
      this.setState({instruction: "Press to Stop"});
      this.refs["PROGRESS"].showProgress();
      this.refs["PROGRESS"].activateProgress(); // could being called every second
      // change state
      // Start stopwatch here // Maybe pass stopwatch start func as prop
      this.refs["STOPWATCH"].start(); // this already has an interval
      // this.refs["STOPWATCH"].run();

      // MAYBE start recording here -- Actually dont put it here as this called repeatidly

      // Maybe above is wrong and its okay to start recording here
      // Because the countdown state is checked
      // Will need to make sure nothing is recording before though

      // Mayve change countdown to 0 instead of 1

      RecordScreen.initRecording(); // Exposed React Native Method
    } else {
      this.setState({countdown: this.state.countdown - 1});
      // this.refs["STOPWATCH"].run();
    }

  },

  stopCountdown: function () {
    clearInterval(this.interval);
    this.setState({countdown: "Status: Idle"});
    this.setState({instruction: "Press to Record"});
    this.refs["PROGRESS"].stopProgress();
    this.refs["PROGRESS"].resetProgress();
    this.refs["STOPWATCH"].reset();
  },
  
  startCountdown: function () {
    // var countdown = this.state.countdown;
    this.setState({countdown: 3});
    if (this.state.countdown === 3) {
      // this.minusOne();
      this.interval = setInterval(this.minusOne, 1000);
      
    } else {
      // Maybe stop here
    }

  },
  
  toggleButtonColour: function () {
    if (this.state.color !== "rgb(255, 28, 28)") {
      this.setState({color: "rgb(255, 28, 28)"},  this.startCountdown());
    } else {
      RecordScreen.stopRecording();
      this.setState({color: "rgb(156,41,41)"}, this.stopCountdown());
      this.refs["PROGRESS"].hideProgress(); // hides but does not stop
      
    }
    
  },
  componentWillMount: function () {
    clearInterval(this.interval);
  },
  render: function () {
    	// <View style={styles.countdown}>
	//   <Text>
	  
        //   </Text>
	// </View>
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
	     {this.state.instruction}
	   </Text>
	</TouchableOpacity>

	<MovingBar ref={'PROGRESS'}
                   status={this.state.countdown}
                   toggleButtonColour={this.toggleButtonColour}/>
	<Text style={styles.recordTime}>

        </Text>
	<Stopwatch ref={"STOPWATCH"}/>
	
	
        
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
  progress: {
    width: 150,
    height: 20
  },
  recordButton: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center"
  },
  countdown: {
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  textRecord: {
   fontSize: 20
  }
});


module.exports = Record;
