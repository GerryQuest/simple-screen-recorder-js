package com.simplescreenrecorder;

import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.Surface;
import android.view.View;
import android.view.Menu;
import android.app.Activity;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.NativeModule; 
import com.facebook.react.bridge.ReactApplicationContext; 
import com.facebook.react.bridge.ReactContext; 
import com.facebook.react.bridge.ReactContextBaseJavaModule; 
import com.facebook.react.bridge.ReactMethod; 
import com.facebook.react.bridge.Callback;
import java.util.Map;

public class AppModule extends ReactContextBaseJavaModule {
    private Activity activity;
    
    public AppModule (ReactApplicationContext reactContext) {
        super(reactContext);
        activity = super.getCurrentActivity();
    }

    @Override
    public String getName() {
        return "AppModule";
    }

    /**
        Ends the Main Activity and all other children activities
    **/
    @ReactMethod
    public void exit() {
        // if (activity.getParent() != null) {
        //     activity.getParent().finishAffinity();
        // } else if (activity != null) {
        //     activity.finishAffinity();
        // }
	
	Activity act = super.getCurrentActivity();
	// act.getParent().finishAffinity();
	// act.finishAffinity();
	act.finishAffinity();
        
    }

}
