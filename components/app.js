'use strict';

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  TouchableOpacity,
  Alert
} from 'react-native';

import Icon from "react-native-vector-icons/FontAwesome";
import Dropdown from "react-native-dropdown-android";
import Record from "./record";
import DialogAndroid from "react-native-dialogs";
import RecordScreen from "./recordscreen";
import AppModule from './app-module';

export default class App extends Component {

  // getInitialState notsupported in ES6 classes
/*  getInitialState () {
   return {
      recordingAvailable: false
    }; 
  }
*/
  constructor () {
    super();
    this.state = {
      recordingAvailable: false
    };
  }
  setRecordingAvailable (status) {
    this.setState({recordingAvailable: status});
  }
  
  toggleDrawer () {
    this.refs['DRAWER'].openDrawer();
  }

  showPopupMenu () {
    console.log("test");
  }
  
  showConfirmReplaceDialog (filename) {
    let options = {
      title: "Confirm save as",
      content: filename +
	" Already exits. Do you want to replace this file?",
      positiveText: "Yes",
      negativeText: "No",
      onPositive: () => {RecordScreen.replaceExistingFile(filename,
						      (error) => {Alert.alert(error);});}
    };

    let dialog = new DialogAndroid();
    dialog.set(options);
    dialog.show();
    
  }

  parseFilename (filename) {
    RecordScreen.saveAs(filename,
			(error) => {Alert.alert(error);},
		       () => {this.showConfirmReplaceDialog(filename);});
    
    // if fileRecorded has been set to true then saveAs else alert error
  }
  
  showSaveVideoDialog () {
    if (!this.state.recordingAvailable) {
      // return Alert.alert("Error", "No Recordings to save!",
      // 		 [{text: "OK", onPress: () => {console.log("OK");}}]);
      return Alert.alert("Error", "No Recording to save!");
    }
    
    let options = {
      title: "Save As",
      content: "Location: /sdcard/SimpleScreenVideos/",
      positiveText: 'OK',
      negativeText: 'Cancel',
      input: {allowEmptyInput: false,
	      prefill: "Video_NAME.mp4",
	      callback: (filename) => { this.parseFilename(filename);}}
    };

    let  dialog = new DialogAndroid();
    dialog.set(options);
    dialog.show();
  }

  saveVideoDialog () {
    Alert.alert("Save As", "Input",
	       [{text: "Save",
		 onPress: () => console.log("saved")},
	       {text: "Cancel",
		onPress: () => console.log("Canceled")}]);
  } 
  onActionSelected (position) {
    if (position === 0) {
         console.log("test");
      var so = this.state.source;
      // this.setState({source: "heye"});
      var {uri: x} = this.state.jj;
      // Alert.alert("heu", JSON.stringify(x));
      // this.setState({barsIcon: r(this.state.jj.uri)});
      // Alert.alert("hi", JSON.stringify(so));
      // Alert.alert("hi", so.uri);
      // this.saveVideoDialog();
      this.showSaveVideoDialog();
      
    } else if (position === 1) {
      
    } else if (position === 2) {
      
    }
    
  }
  
  exitApplication  () {
    AppModule.exit();
  }

  componentWillMount () {
    this.setState({barsIcon: require("../Hamburger.png")});
    var thesource = Icon.getImageSource('rocket', 15, "#000000");
    this.setState({jj: thesource});
    // Icon.getImageSource('rocket', 15, "#000000").then((source) => Alert.alert("hi", JSON.stringify(source)));
    // Icon.getImageSource('rocket', 15, "#000000").then((source) => this.setState({ jj: source }));
    this.setState({asource: JSON.stringify(thesource)});
    // Alert.alert("hiss", thesource);
    // this.setState({source: thesource});
    this.setState({source: "heyesssssssss"});
    console.log(thesource);
    // this.setState({barsIcon: source})
  }
  
  componentDidMount () {
     // Icon.getImageSource('rocket', 15, "#000000").then((source) => this.setState({ barsIcon: source }));
    // Alert.alert("message", this.state.source);    
  }

  
  render () {
    const navigationView = (
      <View style={{flex:1, backgroundColor: "#FFF", padding: 14,
		    flexDirection: 'column', justifyContent:'space-between'}}>
        <Text style={{fontSize: 20, /*margin: 17,*/ textAlign: "left"}}>
	"Drawer is open"
        </Text>
	<View>
	<TouchableOpacity onPress={this.exitApplication}>
	<Text style={{fontSize: 20, margin: 5, textAlign: "left"}}>
	<Icon name="power-off" size={27} color="#000000"/>
	{' '} Exit
	</Text>
	</TouchableOpacity>
	</View>
      </View>
    );

    let popupMenu = (
        <Dropdown style={{height: 20, width: 10}}
                values={["choose one", "one", 2, 3, [5,6,7,8]]}
                selected={"1"}
                onChange={(data) => { console.log(data);}} />
     
    );
    
    return (
      <DrawerLayoutAndroid
          drawerWidth={150}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}
          ref={'DRAWER'}
	  style={styles.drawerlayout}>
	
        <View style={{alignItems: "center", alignSelf: "stretch"}}>
        <ToolbarAndroid 
                        actions={[{title: "Save as", show: "never"},
                                 {title: "Delete", show: "never"},
                                 {title: "Share", show: "never"}] }
                        onActionSelected={this.onActionSelected}
                        style={styles.toolbar}>
        
                <View style={styles.toolbarTitle}>
                        <TouchableOpacity onPress={this.toggleDrawer}>
                                <Icon name="bars" size={15} color="#000000"/>
                        </TouchableOpacity>
                        <Text style={styles.toolbarHeading}>
                           Simple Screen Recorder
                        </Text>
                        
                </View>
        </ToolbarAndroid>
        </View>
	<Record availability={this.setRecordingAvailable}/>
	
	
        </DrawerLayoutAndroid>
    );
  }
}


const styles = StyleSheet.create({
  drawerlayout: {
    flex:1
  },
  toolbar: {
    backgroundColor: "#FFB700",
    alignSelf: "stretch",
    height: 46  
  },
  toolbarTitle: {
    flex:1,
    flexDirection: "row",
    alignItems: 'center',
    // justifyContent: 'center',
    marginLeft: 10, backgroundColor: "#FFB700"
    
  },
  toolbarHeading: {
    fontSize: 15, marginLeft: 10, alignItems:"center"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
