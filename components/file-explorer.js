'use strict';

import React, {Component} from 'react';
import {Text,
	View,
	StyleSheet,
	Alert,
	TouchableOpacity,
	ScrollView,
	Button,
	Image, DeviceEventEmitter} from 'react-native';

import FileExplorer from './modules/fexplorer-module';

export default class FileExplorerComp extends Component {
  constructor (props) {
    super();
    this.state = {directoryList: null,
		  path: "C:\\Code\\"};
    this.createRows = this.createRows.bind(this);
    this.getDirectories = this.getDirectories.bind(this);
  }

  componentWillMount () {
    // DeviceEventEmitter.addListener('fetchDirectory', (e) => {
    //   if (e)
    //   this.setState({directoryList: });
    // });
    
  }

  async createRows () {
    // Map through array
    let dir = await this.getDirectories();
    if (dir instanceof Array){
      
    }
  }
  
  async getDirectories () {

    try {
      // Below shoudl return array
      let dir = await FileExplorer.getDirectory("C:\\Code\\"); 
      this.setState ({directoryList: dir });

//      this.createRows.bind(this);

      // setState may not be needed,
      // because you can just return the array
      return dir;
    } catch (e) {
      //Alert.alert("Error", "Could not load path");
      Alert.alert("Error", e.message);
    }
  }
  
  generateFileRow () {
    let files = null;
    FileExplorer.getDirectoryArray("C:\\Code\\"),
    (msg) => {
      Alert.alert("Error", "Could not load path");
    },
    (list) => { files = list;};
    // Could be a problem with assiging files variable
    // because async means it does not wait to files var
    // may end up being null

    // Maybe dont need to decare files variable outside callback
    // declare it in callback if its sucessfull
  }
  
  render () {
    return (
      
    );
  }
}
