package com.khanaanywhere.khananew_mess;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ContentResolver;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import androidx.core.app.NotificationCompat;
import org.devio.rn.splashscreen.SplashScreen;


public class MainActivity extends ReactActivity {

 

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "KA-MSP";
  }

  // @Override
  //   public void onNewIntent(Intent intent) {
        
  //       super.onNewIntent(intent);
        
  //   }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */

  @Override
  protected void onCreate(Bundle savedInstanceState){
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    NotificationChannel notificationChannel = new NotificationChannel("sound_channel", "AwesomeProject", NotificationManager.IMPORTANCE_HIGH);
    notificationChannel.setShowBadge(true);
    notificationChannel.setDescription("");

    AudioAttributes att = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_NOTIFICATION)
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .build();
  
    notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/custom_sound"), att);
    notificationChannel.enableVibration(true);
    notificationChannel.setVibrationPattern(new long[]{400, 400});
    notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);

    NotificationManager manager = getSystemService(NotificationManager.class);
    manager.createNotificationChannel(notificationChannel);
}

 if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    NotificationChannel notificationChannel = new NotificationChannel("sound_channel1", "AwesomeProject", NotificationManager.IMPORTANCE_HIGH);
    notificationChannel.setShowBadge(true);
    notificationChannel.setDescription("");

    AudioAttributes att = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_NOTIFICATION)
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .build();

    notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/simple"), att);
    notificationChannel.enableVibration(true);
    notificationChannel.setVibrationPattern(new long[]{400, 400});
    notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);

    NotificationManager manager = getSystemService(NotificationManager.class);
    manager.createNotificationChannel(notificationChannel);
}
    super.onCreate(savedInstanceState);
  }


  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
