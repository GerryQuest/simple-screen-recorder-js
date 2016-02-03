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
  Alert
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

var Record = React.createClass ({
  render: function () {
    return (
      <View style={styles.view}>
	<Icon name="dot-circle-o" size={100} color="#9C2929" />
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
    
  }
});


module.exports = Record;
