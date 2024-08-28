import React, { useEffect } from 'react';
import AppNavigation from './navigation/appNavigation';
import SplashScreen from 'react-native-splash-screen';
import { PermissionsAndroid, Platform,Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { requestUserPermission, notificationListener } from './utils/notificationServices';

export default function App() {
  useEffect(() => {
    // SplashScreen.hide();

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Notification Permission',
              message: 'This app requires access to notifications.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
            requestUserPermission();
            notificationListener();
          } else {
            console.log('Notification permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        requestUserPermission();
        notificationListener();
      }
    };
    
    

    requestPermissions();
  }, []);

 

  return <AppNavigation />;
}
