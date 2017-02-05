'use strict';

/*
  This exposes the Java Native AppModule as a JS Module file
*/
import React, {NativeModules} from 'react-native';
module.exports = NativeModules.AppModule;
