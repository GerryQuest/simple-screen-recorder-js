
public class RecordScreenPackage implements ReactPackage {

  @Override
  public List<NativeModule> createNativeModuless(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new RecordScreenModule(reactContext));
  }

  @Override
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    Collections.emptyList();
  }
}
