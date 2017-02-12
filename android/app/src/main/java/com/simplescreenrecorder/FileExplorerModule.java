package com.simplescreenrecorder;

import android.app.Activity;

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

import java.io.File;
import java.text.DateFormat;
import java.util.Date;

public class FileExplorerModule extends ReactContextBaseJavaModule {

    public FileExplorerModule(ReactApplicationContext reactContext) {
	super(reactContext);
    }

    @Override
    public String getName() {
	return "FileExplorer";
    }

    public WritableArray getListDirectories() {
	
    }

    public File[] listAllFiles(String path) {
	// List<FileItem> directories = new ArrayList<FileItem>();
	// List<FileItem> files = new ArrayList<FileItem>(); 

	// List<WritableMap> directories = new ArrayList<WritableMap>();
	// List<WritableMap> files = new ArrayList<WritableMap>();

	WritableArray directories = Arguments.createArray();
	WritableArray files = Arguments.createArray();
	
	File dir = new File(path);
//	File dir = new File("C:\\Code\\");
	File[] list = dir.listFiles();

	try {
	    for (File f : list) {
		String modified = DateFormat.getDateTimeInstance().format(f.lastModified());
		if (f.isDirectory()) {
		    WritableMap map = Arguments.createMap();
		    map.putString("name", f.getName());
		    map.putString("modified", modified);
		    map.putString("path", f.getAbsolutePath());
		    map.putBoolean("directory", true);

		    // Maybe add number of items in folder
		    directories.pushMap(map);
		    
		} else {
		    WritableMap map = Arguments.createMap();
		    map.putString("name", f.getName());
		    map.putString("modified", modified);
		    map.putString("path", f.getAbsolutePath());
		    map.putBoolean("directory", false);
		    files.pushMap(map);
		}
	    }
	} catch (Exception e) {
	    e.printStacktrace();
	}

	return list;
    }
}
