
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
// import android.view.View;
// import android.view.Menu;
// import android.view.MenuItem;
// import android.widget.Button;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class RecordScreenModule extends ReactContextBaseJavaModule
implements ActivityEventListener {
    private static final String VIDEO_MIME_TYPE = "video/avc";
    private static final int VIDEO_WIDTH = 640;
    private static final int VIDEO_HEIGHT = 480;

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



    public RecordScreenModule (ReactApplicationContext reactContext) {
	     super(reactContext);
       // Add the listener for `onActivityResult`
       reactContext.addActivityEventListener(this);
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

      mMediaProjectionManager = (MediaProjectionManager) getSystemService(
      Context.MEDIA_PROJECTION_SERVICE);

      intent permissionIntent = mMediaProjectionManager.createScreenCaptureIntent();
      startActivityForResult(permissionIntent, REQUEST_CODE_CAPTURE_PERM);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
      if (REQUEST_CODE_CAPTURE_PERM == requestCode) {
        if (resultCode == RESULT_OK) {
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
      MediaFormat format = MediaFormat.createVideoFormat(VIDEO_MIME_TYPE,VIDEO_WIDTH, VIDEO_HEIGHT);
      int frameRate = 30;

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
        File dir = new File("/sdcard");
        // Maybe better to use date and time instead of videoCount
        String fileName = "RecordedVideo_" + videoCount + ".mp4";
        DisplayManager displayManeger = (DisplayManager) getSystemService(Context.DISPLAY_SERVICE);
        Display defaultDisplay = displayManager.getDisplay(Display.DEFAULT_DISPLAY);
        if (defaultDisplay == null) {
          throw new RuntimeException("No display found.");
        }
        prepareVideoEncoder(); // Initializes and setups video recorder

        /* Muxer converts input to output - so video input is outputted and
         stored as file on sd card */
         try {
           mMuxer = new MediaMuxer(dir + "/" + fileName, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4);
         } catch (IOException e) {
           e.printStackTrace();
         }

         // Get the display size and density.
        DisplayMetrics metrics = getResources().getDisplayMetrics();
        int screenWidth = metrics.widthPixels;
        int screenHeight = metrics.heightPixels;
        int screenDensity = metrics.densityDpi;

        /* Virtual display is created with specified HEIGHT and WIDTH dimensions
          it then outputs screen to the MUXER created before.
          This virtualScreen is outputted to the surface of the Encoder, which in return
          becomes the input for the Muxer which outputs the file in the specified format.
         */
        mMediaProjection.createVirtualDisplay("Recorded Display", screenWidth, screenHeight, screenDensity,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR, mInputSurface,
                null /*Callbacks*/, null /*Handler*/);

        videoCount = videoCount + 1; // Number of recorder videos
        drainEncoders();
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
        mDrainEncoderRunnable = null;
        mTrackIndex = -1;
    }
}
