import * as React from 'react';
import {AppRegistry, Alert} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import Order from './Screen/Order';
import Sound from 'react-native-sound';

const notificationSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.error('Failed to load the sound', error);
  } else {
    console.log('Sound loaded successfully');
  }
});

const playContinuousSound = () => {
  notificationSound.play(success => {
    if (!success) {
      console.log('Error playing sound');
    }
  });
};

const stopContinuousSound = () => {
  notificationSound.stop();
};

const navigateToScreen = screen => {
  console.log('Navigating to screen:', screen);
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

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (remoteMessage) {
    console.log('playing sound for background app notification');
    playContinuousSound();
  }
  stopContinuousSound();
  handleNotification(remoteMessage);
});

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
