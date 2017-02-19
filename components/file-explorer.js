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
import Icon from "react-native-vector-icons/FontAwesome";

export default class FileExplorerComp extends Component {
  constructor (props) {
    super();
    this.state = {directoryList: null,
		  path: "/sdcard/"};
    this.getDirectories = this.getDirectories.bind(this);
    this.genRows = this.genRows.bind(this);
    this.fileOrFolderIcon = this.fileOrFolderIcon.bind(this)
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

  fileOrFolderIcon (file) {
    const icon = file ? "folder-o" : "file";
    return (<Icon name={icon} size={27} color="#000000"/>);
  }
  genRows () {
    let dir = this.state.directoryList;
    if (dir instanceof Array) {
      return (dir.map((file, index) => 
  	  <View key={index} style={styles.row} >
	  {this.fileOrFolderIcon(file.directory)}
	  <View style={styles.rowDetails}>
	  
  	  <View style={styles.rowDetailsTop}><Text>{file.name}</Text></View>
  	  <View style={styles.rowDetailsBottom}>
	    <Text>{file.modified}</Text>
  	    <Text>{file.path}</Text>
	  </View>
	  </View>
  	  </View>
      ));
      //return rows;
    } else return (<Text>Nope</Text>);
    
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
    (list) =>  files = list;
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


const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  rowDetails: {
    flex:1,
    flexDirection: 'column'
  },
  rowDetailsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowDetailsBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
  
});
