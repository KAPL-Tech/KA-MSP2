import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import Calendar from '../Screen/Order';
import {navigateToScreen} from './commonFunction';
import Sound from 'react-native-sound';
import Order from '../Screen/Order';


export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();

    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      getFcmToken();
    } else if (authStatus === messaging.AuthorizationStatus.DENIED) {
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    Alert.alert('Error requesting notification permission');
  }
}

const getFcmToken = async () => {
  try {
    let storedToken = await AsyncStorage.getItem('fcmToken');

    if (!storedToken) {
      try {
        const newToken = await messaging().getToken();

        if (newToken) {
          await AsyncStorage.setItem('fcmToken', newToken);
        } else {
          console.error('Failed to generate a new FCM token');
          Alert.alert('Error generating new token');
        }
      } catch (tokenError) {
        console.error(tokenError, 'Error generating new token');
        Alert.alert('Error generating new token');
      }
    } else {
      console.log('FCM Token already present in AsyncStorage:', storedToken);
    }
  } catch (error) {
    console.error(error, 'Error retrieving/storing FCM token');
  }
};

export async function notificationListener() {
  const notificationSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.error('Failed to load the sound', error);
    } else {
      console.log('Sound loaded successfully');
    }
  });

  const playContinuousSound = () => {
    console.log('Attempting to play sound...');
    notificationSound.play(
      success => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.log('Error playing sound');
        }
      },
      error => {
        console.error('Error during sound playback:', error);
      },
    );
  };

  const stopContinuousSound = () => {
    notificationSound.stop();
  };

  const handleNotification = remoteMessage => {
    const {title, body} = remoteMessage.notification || {};

    Alert.alert(title || 'New FCM Message', body || 'No message body', [
      {
        text: 'OK',
        onPress: () => {
          navigateToScreen(Order);
          stopContinuousSound();
        },
      },
    ]);
    playContinuousSound();
  };

  const handleNotificationOpenedApp = remoteMessage => {
    if (remoteMessage.notification) {
      console.log('Playing sound for opened app notification');
    }

    if (remoteMessage?.data?.screen) {
      console.log('Navigating to screen:', remoteMessage.data.screen);
      setTimeout(() => {
        navigateToScreen(Order);
      }, 1);
    }
  };

  const handleInitialNotification = remoteMessage => {
    if (remoteMessage) {
      console.log('Playing sound for initial notification:', remoteMessage);

      playContinuousSound();
    }
    if (remoteMessage?.data?.screen) {
      console.log(
        'Notification caused app to open from quit state',
        remoteMessage.notification,
        playContinuousSound(),
      );
    }

    if (remoteMessage?.data?.screen) {
      console.log('Navigating to screen:', remoteMessage.data.screen);
      setTimeout(() => {
        navigateToScreen(Order);
        stopContinuousSound();
      }, 100);
    }
  };

  const handlePushNotification = notification => {
    if (notification) {
      playContinuousSound();
    }

    if (notification) {
      setTimeout(() => {
        navigateToScreen(Order);
      });
    }
  };

  const unsubscribe = messaging().onMessage(handleNotification);

  messaging().onNotificationOpenedApp(handleNotificationOpenedApp);

  messaging().getInitialNotification().then(handleInitialNotification);

  PushNotification.configure({
    soundName: 'alarm.mp3',
    onNotification: handlePushNotification,
  });

  return unsubscribe;
}
