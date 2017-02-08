/**
   Brings up save as dialog and file directory for saving recorded video
**/

'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  TouchableOpacity,
  Alert
} from 'react-native';



export default class SaveAs extends Component {
  constructor () {
    super();
    this.popSaveAs = this.popSaveAs.bind(this);
  }

  popSaveAs () {
    this.props.navigator.pop();
  }
  
  render () {
    return (
	<View>
	<TouchableOpacity onPress={this.popSaveAs}>
	<Text style={{fontSize: 25}}>HEYE</Text>
	</TouchableOpacity>
      </View>
    );
  }
}
