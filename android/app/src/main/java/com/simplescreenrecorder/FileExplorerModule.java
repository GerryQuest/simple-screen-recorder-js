package com.simplescreenrecorder;

import android.app.Activity;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.NativeModule; 
import com.facebook.react.bridge.ReactApplicationContext; 
import com.facebook.react.bridge.ReactContext; 
import com.facebook.react.bridge.ReactContextBaseJavaModule; 
import com.facebook.react.bridge.ReactMethod; 
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;

import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.util.Arrays;
import java.text.DateFormat;
import java.util.Date;


public class FileExplorerModule extends ReactContextBaseJavaModule {

    private ReactContext mReactContext;
    
    public FileExplorerModule(ReactApplicationContext reactContext) {
	super(reactContext);
	mReactContext = reactContext;
    }

    @Override
    public String getName() {
	return "FileExplorer";
    }

    private void sendEvent (ReactContext reactContext, String eventName, @Nullable WritableArray paramsArray) {
	reactContext
	    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
	    .emit(eventName, paramsArray);
    }
    // private void sendEvent (ReactContext reactContext, String eventName, )
    
   /* public WritableArray getListDirectories() {
	
    } */

    
    public WritableArray listAllFiles(String path) {
	// List<FileItem> directories = new ArrayList<FileItem>();
	// List<FileItem> files = new ArrayList<FileItem>(); 

	// List<WritableMap> directories = new ArrayList<WritableMap>();
	// List<WritableMap> files = new ArrayList<WritableMap>();

	WritableArray directories = Arguments.createArray();
	WritableArray files = Arguments.createArray();
	
	File dir = new File(path);
//	File dir = new File("C:\\Code\\");
	
	try {
	    File[] list = dir.listFiles();
	    Arrays.sort(list);
	    for (File f : list) {
		String modified = DateFormat.getDateTimeInstance().format(f.lastModified());
		WritableMap map = Arguments.createMap();
		map.putString("name", f.getName());
		map.putString("modified", modified);
		map.putString("path", f.getAbsolutePath());
		
		if (f.isDirectory()) {
		    map.putBoolean("directory", true);

		    // Maybe add number of items in folder
		    directories.pushMap(map);
		} else {
		    map.putBoolean("directory", false);
		    files.pushMap(map);
		}
	    }
	} catch (Exception e) {
	    
	    e.printStackTrace();
	    return null;
	    
	}
	
	// Need to sort the array
	directories.pushArray(files);
	
	return directories;
    }

    /*
       Old method that uses callbacks to return array of directories
       and files. Probably should be removed or at leasted commented out.
    */
    @ReactMethod
    public void getDirectoryArray (String path, Callback errorCallback, Callback successCallback) {

	WritableArray files = listAllFiles(path);
	if (files != null) {
	    successCallback.invoke(files);
	} else {
	    errorCallback.invoke("Error with directories");
	}
    }

/*    @ReactMethod
    public void getDirectoryArray(String path) {
	WritableArray files = listAllFiles(path);
	if (files != null) {
	    sendEvent(mReactContext, "fetchDirectory", files);
	} else {
	    sendEvent(mReactContext, "fetchDirectory", false)
	    //sendEvent(mReactContext, )
	}
    }
*/
    @ReactMethod
    public void getDirectory (String path, Promise promise) {
	WritableArray files = listAllFiles(path);

	if (files != null) {
	    
	    promise.resolve(files);
	} else {
	    promise.reject("getDirectory Error", "Files returned Null");
	}

	
	/*try {
	    
	} catch (Exception e) {
	    promise.reject("getDirectory Error", e);
	}*/
    }
    
}
