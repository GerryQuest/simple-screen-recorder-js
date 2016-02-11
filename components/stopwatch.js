/*
  Created by Eissek87 2016
  React Stopwatch component that continues until 59 minute
  */
"use strict";

import React, {
  Component,
  StyleSheet,
  Text,
  View 
} from "react-native";

var Stopwatch = React.createClass({
  getInitialState: function () {
    return {seconds: "00",
	    minutes: "00"};
  },
  // incrementSeconds: function () {
  //   this.setState({seconds: this.state.seconds + 1});
  // },
  // incrementMinutes: function () {
  //   this.setState({minutes: this.state.minutes + 1});
  // },
  incrementMinute: function () {
    if (typeof this.state.minutes === "string") {
      var min = parseInt(this.state.minutes);
      this.setState({minutes: this.parseSecondsAndMinutes(min)});
    
    } else {
      this.setState({minutes: this.parseSecondsAndMinutes(this.state.minutes)});
    } 
  },
  incrementNumber: function (number) {
    return number + 1;
  },
  addZero: function (digit) {

    return digit < 10 ? "0" + digit : digit;
  },
  parseSecondsAndMinutes: function (number) {
    var parsedNumber;
    if (number < 9) {
      parsedNumber = this.addZero(this.incrementNumber(number));
    } else if (number >= 9 && number < 59) {
      parsedNumber = this.incrementNumber(number);
    } else if (number === 59) {
      parsedNumber = "00";
      // increment minute here
      this.incrementMinute();
    }
    return parsedNumber;
  } ,
  run: function () {
    // SO every second do the following. Maybe put in function

    if (typeof this.state.seconds === "string") {
      var second = parseInt(this.state.seconds);
      // could use case instead
      var parsedSec  = this.parseSecondsAndMinutes(second);
      this.setState({seconds: parsedSec});
 
    } else  {
      this.setState({seconds: this.parseSecondsAndMinutes(this.state.seconds )});
    }



    // this only needs to run when second is 59
    // if (typeof this.state.minutes === "string") {
    //   var min = parseInt(this.state.minutes);
    //   this.setState({minutes: this.parseSecondsAndMinutes(min)});
    
    // } else {
    //   this.setState({minutes: this.parseSecondsAndMinutes(this.state.minutes)});
    // }
  },
  start: function () {

    this.interval = setInterval(this.run, 1000);
  },
  stop: function () {
    clearInterval(this.interval);
  },
  componentWillUnmount: function () {
    clearInterval(this.interval);
  },
  render: function () {
   return (
     <View style={styles.stopWatchView}>
     <Text style={styles.stopwatch}>{this.state.minutes}:{this.state.seconds}</Text>
     </View>
   ); 
  }
});

const styles = StyleSheet.create({
  stopWatchView: {
    alignItems: "center"// ,
    // alignSelf:"center"
    // ,
    // flexDirection: "row",
    // justifyContent: "center"
  },
  stopwatch: {
    fontSize: 70 ,
    textAlign: "center"
    // color:"#000"
  }
  
});

module.exports = Stopwatch;

