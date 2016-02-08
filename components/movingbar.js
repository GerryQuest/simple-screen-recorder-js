'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ProgressBarAndroid
} from "react-native";

// import TimerMixin from "react-timer-mixin";
// var TimerMixin = require('react-timer-mixin'); // Import wont allow for interval unmount

var MovingBar = React.createClass({


  getInitialState: function () {
    return {
      progress: 0,
      showProgress: false
    };
  },
  showProgress: function () {
    // Set showProgress to false, which should remove it by making it null
    this.setState({showProgress: true});
  },
  hideProgress: function () {
    this.setState({showProgress: false});
  },
  toggleProgress: function (arg) {
    // arg should either be true or false
    this.setState({showProgress: arg});
  },
  stopProgress: function () {
    clearInterval(this.interval);
  },
  resetProgress: function () {
    // this.interval();
    this.setState({progress: 0});
  },
  startProgress: function () {
    // 0.0167 should provide full progress bar after 1minute
    var progress = (this.state.progress + 0.0168) % 1;
    this.setState({progress: progress});
  },
  activateProgress: function () {
    this.interval = setInterval(this.startProgress, 1000);
  },
  componentDidMount: function () {
    // this.activateProgress();
    // this.isRecordingTimeUp();
  },
  isRecordingTimeUp: function () {
    var timeUp = false;
    if (this.state.progress >= 0.99) {
      // and maybe return true boolean if it has stopped
      this.stopProgress();
      // change status to end of recording time
      timeUp = true;
    }
    return timeUp;
  },
  componentWillUpdate: function () {
    this.isRecordingTimeUp();
  },
  
  // shouldComponentUpdate: function () {
  //   var update = true;
  //   if (this.isRecordingTimeUp()) {
  //     update = false;
  //   }
  //   return update;
  // },
  
  componentWillUnmount: function () {
    clearInterval(this.interval);
  },
  render: function () {

    var progressBar = this.state.showProgress ? <ProgressBarAndroid styleAttr="Horizontal"
                                     color="#9C2929"
                                     progress={this.state.progress}
                                     style={styles.progress}
    	                             indeterminate={false}/> : null;
    
    return (
      <View>
	{progressBar}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  progress: {
    width: 150,
    height: 20
  }
});

module.exports = MovingBar;
