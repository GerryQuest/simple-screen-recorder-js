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
    return {seconds: 0,
	    minutes: 0};
  },
  incrementSeconds: function () {
    this.setState({seconds: this.state.seconds + 1});
  },
  incrementMinutes: function () {
    this.setState({minutes: this.state.minutes + 1});
  },
  incrementNumber: function (number) {
    return number + 1;
  },
  addZero: function (digit) {
    // var number;
    // if (digit < 10) {
    //   number = "0" + digit;
    // }
    // return number;

      
    
    return digit < 10 ? "0" + digit : digit;
  },
  parseSecondAndMinute: function (number) {
    var parsedNumber;
    if (number < 9) {
      parsedNumber = this.addZero(this.incrementNumber(number));
    } else if (number === 9) {
      parsedNumber = this.incrementNumber(number);
    } else if (number === 59) {
      parsedNumber = "00";
    }
    return parsedNumber;
  } ,
  start: function () {

    // SO every second do the following. Maybe put in function

    if (typeof this.state.seconds === "string") {
      // this.setState({seconds: parseInt(this.state.seconds)});
      // if (this.state.seconds < 10) {
      // 	this.incrementSeconds(); 
      // 	// Add 0 to it	
      // }
      var second = parseInt(this.state.seconds);

      // wont work below because number maybe 59 in which case incrementing is pointless
      // unless I check for 60
      // second = isSingleDigitSecond(second) ? this.addZero(this.incrementNumber(second)) : this.incrementNumber(second);
      
      // could use case instead
      if (second < 9) {
	second = this.addZero(this.incrementNumber(second));
      } else if (second === 9) {
	second = this.incrementNumber(second);
      } else if (second === 59) {
	second = "00";
      }

      this.setState({seconds: second});
 
    } else  {
      if (second < 9) {
	second = this.addZero(this.incrementNumber(second));
      } else if (second === 9) {
	second = this.incrementNumber(second);
      } else if (second === 59) {
	second = "00";
      }
      this.setState({seconds: second});
    }
    
  
    // this.interval = setInterval(, 1000);
  },
  stop: function () {
    
  },
  componentWillUnmount: function () {
    clearInterval(this.interval);
  },
  render: function () {
   return (); 
  }
});

module.exports = Stopwatch;
