package com.simplescreenrecorder;
/*
  React Native Module that allows Native functionality in Java to be,
  applied using JavaScript.
*/

import android.content.Context;
import android.content.Intent;
import android.hardware.display.DisplayManager;
import android.media.MediaCodec;
import android.media.MediaCodecInfo;
import android.media.MediaFormat;
import android.media.MediaMuxer;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
// import android.support.design.widget.FloatingActionButton;
// import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.Surface;
import android.view.View;
import android.view.Menu;
// import android.view.MenuItem;
// import android.widget.Button;
import android.app.Activity;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.ArrayList;
// import java.nio.file.Files;
// import java.nio.file.FileAlreadyExistsException;
// import java.nio.file.Path;
import java.nio.channels.FileChannel;
import java.io.FileNotFoundException;
import java.io.FileInputStream;
import java.io.FileOutputStream;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;


public class RecordScreenModule extends ReactContextBaseJavaModule
implements ActivityEventListener {
    private DisplayMetrics metrics;
    private static final String VIDEO_MIME_TYPE = "video/mp4v-es";
    private static final int VIDEO_WIDTH = 720; // maybe try get screen hight and width
    private static final int VIDEO_HEIGHT = 1280;
    private static final int VIRTUAL_WIDTH = 720;
    private static final int VIRTUAL_HEIGHT = 1280;


    // Manages Retrieval of mediaProject Token and Applies the permission intent
    private MediaProjectionManager mMediaProjectionManager;
    private static final int REQUEST_CODE_CAPTURE_PERM = 1234;
    private MediaProjection mMediaProjection;
    private Surface mInputSurface;
    private MediaMuxer mMuxer;
    private boolean mMuxerStarted = false;
    private MediaCodec mVideoEncoder;
    private MediaCodec.BufferInfo mVideoBufferInfo;
    private int mTrackIndex = -1;

    private final Handler mDrainHandler = new Handler(Looper.getMainLooper());

    private Runnable mDrainEncoderRunnable = new Runnable() {
        @Override
        public void run() {
            drainEncoders();
        }
    };

    private int videoCount = 0;
    private File tempVideoFile = null;
    private File defaultDir = new File("/sdcard/SimpleScreenVideos/");

    public RecordScreenModule (ReactApplicationContext reactContext) {
	     super(reactContext); // Passess reactContext to the constructor of the super class

       // Add the listener for `onActivityResult`
       reactContext.addActivityEventListener(this);
       metrics = super.getReactApplicationContext().getResources().getDisplayMetrics();
    }

    @Override
    public String getName() {
	     return "RecordScreenModule";
    }

    // This Method is exposed to JavaScript and React
    /*@ReactMethod
    public void startRecording() {

    } */

    @ReactMethod
    public void stopRecording() {
      releaseEncoders();
    }

    @ReactMethod
    public void initRecording() {
      // Maybe a good Idea to check if Intent has already been created to avoid slow downs
      // Could use if statement to check

      Activity currentActivity = getCurrentActivity();

      mMediaProjectionManager = (MediaProjectionManager) super.getReactApplicationContext().
      getSystemService(Context.MEDIA_PROJECTION_SERVICE);

      Intent permissionIntent = mMediaProjectionManager.createScreenCaptureIntent();
      currentActivity.startActivityForResult(permissionIntent, REQUEST_CODE_CAPTURE_PERM);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
      if (REQUEST_CODE_CAPTURE_PERM == requestCode) {
        if (resultCode == Activity.RESULT_OK) {
          mMediaProjection = mMediaProjectionManager.getMediaProjection(resultCode, data);
          startRecording();
        } else {
          System.out.println("PERMISSION NOT GRANTED");
        }
      }
    }

    private void prepareVideoEncoder() {
      System.out.println("Preparing Video Encoder");
      mVideoBufferInfo = new MediaCodec.BufferInfo();
      // MediaFormat format = MediaFormat.createVideoFormat(VIDEO_MIME_TYPE,VIDEO_WIDTH, VIDEO_HEIGHT);

      // AVC works best with pixel lengths rounded to nearest 10 other it cause formating problems
      /*int width = (int) Math.floor(metrics.widthPixels/10) * 10; // Returns width to nearest 10
      int height = (int) Math.floor(metrics.heightPixels/10) * 10; */
      MediaFormat format = MediaFormat.createVideoFormat(VIDEO_MIME_TYPE, VIDEO_WIDTH, VIDEO_HEIGHT);
      int frameRate = 30;

      // format.setInteger("rotation-degrees", 0);
      // The following Properties are needed, the MediaCodec could failt without them
      format.setInteger(MediaFormat.KEY_COLOR_FORMAT,
        MediaCodecInfo.CodecCapabilities.COLOR_FormatSurface);
      format.setInteger(MediaFormat.KEY_BIT_RATE, 6000000); // 6MPS
      format.setInteger(MediaFormat.KEY_FRAME_RATE, frameRate);
      format.setInteger(MediaFormat.KEY_CAPTURE_RATE, frameRate);
      format.setInteger(MediaFormat.KEY_REPEAT_PREVIOUS_FRAME_AFTER, 1000000 / frameRate);
      format.setInteger(MediaFormat.KEY_CHANNEL_COUNT, 1);
      format.setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 1); // 1 sec between I-Frames

      // Creates and Configures Media Codec. gets a surface that can be used to record
      try {
        System.out.println("IN TRYING CODE");
        mVideoEncoder = MediaCodec.createEncoderByType(VIDEO_MIME_TYPE);
        mVideoEncoder.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE);
        mInputSurface = mVideoEncoder.createInputSurface();
        mVideoEncoder.start();
      } catch (IOException e) {
        releaseEncoders();
      }
    }

    private void startRecording() {
        /*File dir = new File("/mnt/shell/emulated/0");*/
        // File dir = new File("/sdcard");
        // Maybe better to use date and time instead of videoCount
        String fileName = "RecordedVideo_" + videoCount + ".mp4";
        // File tempVideoFile = null;

        tempVideoFile = null;

        // Create Temporary file
        try {
          File dir = new File("/sdcard/SimpleScreenVideos/");
          dir.mkdirs();

          tempVideoFile = File.createTempFile("video", ".mp4", dir);
        } catch (IOException e) {
          e.printStackTrace();
        }

        DisplayManager displayManager = (DisplayManager) super.getReactApplicationContext().
        getSystemService(Context.DISPLAY_SERVICE);

        Display defaultDisplay = displayManager.getDisplay(Display.DEFAULT_DISPLAY);
        if (defaultDisplay == null) {
          throw new RuntimeException("No display found.");
        }
        prepareVideoEncoder(); // Initializes and setups video recorder

        /* Muxer converts input to output - so video input is outputted and
         stored as file on sd card */
         try {
          //  mMuxer = new MediaMuxer(dir + "/" + fileName, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4);
          mMuxer = null;
          mMuxer = new MediaMuxer(tempVideoFile.getAbsolutePath(), MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4);
         } catch (IOException e) {
           e.printStackTrace();
         }

         // Get the display size and density.
        // DisplayMetrics metrics = super.getReactApplicationContext().getResources().getDisplayMetrics();
        int screenWidth = metrics.widthPixels;
        int screenHeight = metrics.heightPixels;
        int screenDensity = metrics.densityDpi;

        /* Virtual display is created with specified HEIGHT and WIDTH dimensions
          it then outputs screen to the MUXER created before.
          This virtualScreen is outputted to the surface of the Encoder, which in return
          becomes the input for the Muxer which outputs the file in the specified format.
         */
        mMediaProjection.createVirtualDisplay("Recorded Display", VIRTUAL_WIDTH, VIRTUAL_HEIGHT, screenDensity,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR, mInputSurface,
                null /*Callbacks*/, null /*Handler*/);

        videoCount = videoCount + 1; // Number of recorder videos
        drainEncoders();
    }

    /*public void checkFileAlredyExists (String filename) {
      defaultDir + filename
      return

    }*/

    /*
      Saves video regardless of filename conflict
      Save is done by renaming temporary video
    */
    public boolean save (File filename) throws Exception {
      boolean successful = false;
      // return tempVideoFile.renameTo(filename);

      // Path copied = Files.copy(tempVideoFile.getPath(), filename.getPath());
      // if (copied instanceof Path) {
      //   successful = true;
      // }
      FileInputStream inputStream = new FileInputStream(tempVideoFile);
      FileOutputStream outputStream = new FileOutputStream(filename);
      FileChannel inputChannel = inputStream.getChannel();
      FileChannel outputChannel = outputStream.getChannel();

      long fileSize = inputChannel.size();
      long transferSize = inputChannel.transferTo(0, fileSize, outputChannel);
      inputStream.close();
      outputStream.close();

      if (transferSize == fileSize) {
        successful = true;
      }

      return successful;
    }

    public String addMP4Extension(String name) {
      String filename;
      if (!name.endsWith(".mp4")) {
        filename = name.concat(".mp4");
      } else { filename = name;}
      return filename;
    }

    /*
      Saves the video even if a file with the same name exits
    */
    @ReactMethod
    public void replaceExistingFile (String filename, Callback errorCallback) {
      // fileExistsSaveAs
      filename = addMP4Extension(filename);

      // File file = new File("Video_NAME.mp4");

      try {
        File oldFile = new File (defaultDir, filename);
        // if (oldFile.delete()) {
        //   errorCallback.invoke("File was deleted " + filename + " " + tempVideoFile);
        // } else {
        //   errorCallback.invoke("Could not delete " + filename + " " + tempVideoFile);
        //   // errorCallback.invoke("Could not delete " + filename + " " + tempVideoFile.getName());
        // }

        if (!oldFile.delete()) {
          errorCallback.invoke("File was deleted " + filename + " " + tempVideoFile);
        } else {
          File file = new File(defaultDir, filename);

          if (!save(file)) {
            // save returns false
            errorCallback.invoke("Could not Save " + filename);
          } else {
            errorCallback.invoke("Saved file " + filename);
            // need to update filename in javascript react to use this new name
            // need update tempVideoFile to use this as new name
          }
        }

        // File file = new File(filename);
        //
        // if (!save(file)) {
        //   // save returns false
        //   errorCallback.invoke("Could not Save " + filename);
        // } else {
        //   errorCallback.invoke("Saved file " + filename);
        // }
      } catch (FileNotFoundException e) {
        errorCallback.invoke("File Not found");
      } catch (Exception e) {
        errorCallback.invoke(e.getMessage());
        e.printStackTrace();
      }

    }



    @ReactMethod
    public void saveAs(String filename, Callback errorCallback, Callback fileExistsCallback
     /*, Callback successCallback */) {

      /*if (!filename.endsWith(".mp4")) {
        filename = filename.concat(".mp4");
      } */

      filename = addMP4Extension(filename);

      // rename the temporary file
      try {
        File dir = new File("/sdcard/SimpleScreenVideos/" + filename);
        // tempVideoFile.renameTo(dir + filename);
        if (dir.exists()) {
          fileExistsCallback.invoke("Filename already exists");
        } else if (!save(dir)) {
          errorCallback.invoke("Error, Video could not be saved.");
          // if (!tempVideoFile.renameTo(dir)) {
          //   // Error renameTo did not work
          //   // return saving error to user
          //   errorCallback.invoke("Error, Video could not be saved.");
          // }
        }


      } catch (Exception e) {
        errorCallback.invoke(e.getMessage());
        e.printStackTrace();
      }
    }

    /*
      Maybe call this from javascript to see whether a file is reanmed
    */
    @ReactMethod
    public void checkFileHasBeenRenamed(String f) {

    }
    /*
        Sends/Drains bytes from the Encoder to the Muxer.
        It gets output buffer from the encoder and writes the bytes to the muxer,
        which will then write said bytes to the file
     */
    private boolean drainEncoders() {
        mDrainHandler.removeCallbacks(mDrainEncoderRunnable);
        while (true) {
            int bufferIndex = mVideoEncoder.dequeueOutputBuffer(mVideoBufferInfo, 0);

            if (bufferIndex == MediaCodec.INFO_TRY_AGAIN_LATER) {
                // No data is available yet, so theres nothing in the buffer to receive
                break;
            } else if (bufferIndex == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
                // Happens only once before receiving buffers
                if (mTrackIndex >= 0) {
                    throw new RuntimeException("Format changed more than once");
                }
                mTrackIndex = mMuxer.addTrack(mVideoEncoder.getOutputFormat());
                if (!mMuxerStarted && mTrackIndex >= 0) {
                    mMuxer.start();
                    mMuxerStarted = true;
                }
            } else if (bufferIndex < 0) {
                System.out.println("Something unusual is happening so ignore it");
            } else {
                ByteBuffer encodedData = mVideoEncoder.getOutputBuffer(bufferIndex);
                if (encodedData == null) {
                    throw new RuntimeException("couldn't fetch buffer at index " + bufferIndex);
                }
                if ((mVideoBufferInfo.flags & MediaCodec.BUFFER_FLAG_CODEC_CONFIG) != 0) {
                    mVideoBufferInfo.size = 0;
                }

                if (mVideoBufferInfo.size != 0) {
                    if (mMuxerStarted) {
                        encodedData.position(mVideoBufferInfo.offset);
                        encodedData.limit(mVideoBufferInfo.offset + mVideoBufferInfo.size);
                        mMuxer.writeSampleData(mTrackIndex, encodedData, mVideoBufferInfo);
                    } else {
                        System.out.println("MUXER not started");
                    }
                }

                mVideoEncoder.releaseOutputBuffer(bufferIndex, false);
                if ((mVideoBufferInfo.flags & MediaCodec.BUFFER_FLAG_END_OF_STREAM) != 0) {
                    break;
                }
            }
        }
        mDrainHandler.postDelayed(mDrainEncoderRunnable, 10);
        return false;

    }

    private void releaseEncoders() {
        mDrainHandler.removeCallbacks(mDrainEncoderRunnable);
        if (mMuxer != null) {
            if (mMuxerStarted) {
                mMuxer.stop();
            }
            mMuxer.release();
            mMuxer = null;
            mMuxerStarted = false;
        }
        if (mVideoEncoder != null) {
            mVideoEncoder.stop();
            mVideoEncoder.release();
            mVideoEncoder = null;
        }
        if (mInputSurface != null) {
            mInputSurface.release();
            mInputSurface = null;
        }
        if (mMediaProjection != null) {
            mMediaProjection.stop();
            mMediaProjection = null;
        }
        mVideoBufferInfo = null;
        // mDrainEncoderRunnable = null;
        mTrackIndex = -1;
    }
}
