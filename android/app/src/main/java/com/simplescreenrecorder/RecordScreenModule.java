
/*
  React Native Module that allows Native functionality in Java to be,
  applied using JavaScript.
*/
public class ScreenRecordModule extends ReactContextBaseJavaModule {

    public ScreenRecordModule (ReactApplicationContext reactContext) {
	super(reactContext);
    }
    
    @Override
    public String getName() {
	return "ScreenRecordModule";
    }

    // This Method is exposed to JavaScript and React
    @ReactMethod
    public void startRecording() {
	
    }

    @ReactMethod
    public void stopRecording() {
	
    }

    
    public void initRecording() {
	
    }
}
