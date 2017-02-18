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
		  path: "/sdcard/"};
    this.createRows = this.createRows.bind(this);
    this.getDirectories = this.getDirectories.bind(this);
    this.genRows = this.genRows.bind(this);
  }

  componentWillMount () {
    // DeviceEventEmitter.addListener('fetchDirectory', (e) => {
    //   if (e)
    //   this.setState({directoryList: });
    // });
    
  }
  componentDidMount () {
    this.getDirectories().done();
  }

  
  genRows () {
    let dir = this.state.directoryList;
    if (dir instanceof Array) {
      return (dir.map((file, index) => 
  	  <View key={index}>
  	  <Text>{file.name}</Text>
  	  <Text>{file.modified}</Text>
  	  <Text>{file.path}</Text>
  	  <Text>{file.directory ? "Directory" : "File" }</Text>
  	  </View>
      ));
      //return rows;
    } else return (<Text>Nope</Text>);
    
  }
  
  async createRows () {
    // Map through array
    let dir = await this.getDirectories();
    if (dir instanceof Array) {
      return dir.map((file) => {
  	  <View>
  	  <Text>{file.name}</Text>
  	  <Text>{file.modified}</Text>
  	  <Text>{file.path}</Text>
  	  <Text>{file.directory ? "Directory" : "File" }</Text>
  	  </View>
      });
      /*const listFiles = dir.map((file) => {
  	<View>
  	  <Text>{file.name}</Text>
  	  <Text>{file.modified}</Text>
  	  <Text>{file.path}</Text>
  	  <Text>{file.directory ? "Directory" : "File" }</Text>
  	</View>
      });
      return (<View>{listFiles}</View>); */
    } else return [];
  }

  
  async getDirectories () {

    try {
      // Below shoudl return array
      let dir = await FileExplorer.getDirectory(this.state.path); 
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
    FileExplorer.getDirectoryArray(this.state.path),
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
    //const directoryRows = this.createRows(); // Returns promise object
    const directoryRows = this.genRows();
    
    return (
      <View>
	<Text>C LANG GOLANG</Text>
	{directoryRows }
      </View>
    );
  }
}
