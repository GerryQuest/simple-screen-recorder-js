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
  start: function () {

    // SO every second do the following. Maybe put in function

    if (typeof this.state.seconds === "string") {
      this.setState({seconds: parseInt(this.state.seconds)});
      // if (this.state.seconds < 10) {
      // 	this.incrementSeconds(); 
      // 	// Add 0 to it	
      // }
      this.setState({seconds: this.addZero(this.state.seconds)});
    }
    
    if (this.state.seconds < 9) {
      // increase second
      this.incrementSeconds();
    } else if (this.state.seconds == 9) {
      // increase minute
      this.incrementMinutes();
      // If it as 9 then 
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
