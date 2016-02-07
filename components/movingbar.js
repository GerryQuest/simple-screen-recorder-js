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

import TimerMixin from "react-timer-mixin";

var MovingBar = React.createClass({
  mixins: [TimerMixin],

  getInitialState: function () {
    return {
      progress: 0,
      showProgress: false
    };
  },

  startProgress: function () {
    var progress = (this.state.progress + 0.02) % 1;
    this.setState({progress: progress});
  },
  componentDidMount: function () {
    this.setInterval(this.startprogress, 1000);
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
