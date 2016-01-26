/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid
} from 'react-native';

var SimpleScreenRecorder = React.createClass ({
  render: function () {
    var navigationView = (
      <View style={{flex:1, backgroundColor: "#FFF"}}>
        <Text style={{fontSize: 15, margin: 10, textAlign: "left"}}>
        "I'm In the Drawer YAY!"
        </Text>
      </View>
    );
    
    return (
      <DrawerLayoutAndroid
          drawerWidth={300}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}>
        <View style={{flex:1, backgroundColor: "#F0FF00", alignItems: "center"}}>
        <Text style={{margin: 5, fontSize: 15, textAlign: "right"}}>
        HELP!
      </Text>
       </View>
        </DrawerLayoutAndroid>
    );
  }
});

// class SimpleScreenRecorder extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit index.android.js
//         </Text>
//         <Text style={styles.instructions}>
//           Shake or press menu button for dev menu
//         </Text>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('SimpleScreenRecorder', () => SimpleScreenRecorder);
