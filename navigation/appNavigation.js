/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import {View, ActivityIndicator, Image} from 'react-native';

import Login from '../Screen/Login';
import SignUp from '../Screen/SignUp';
import Bank_details from '../Screen/Bank_details';
import AccSettings from '../Screen/AccSettings';
import OnboardScreen from '../Screen/OnboardScreen';
import Otp_screen from '../Screen/Otp_screen';
import Profile_Scrren from '../Screen/Profile_Scrren';
import BottomNavigate from '../Screen/BottomNavigate';

import Order from '../Screen/Order';
import Payment_history from '../Screen/Payment_history';
import Dashboard from '../Screen/Dashboard';
import FAQs from '../Screen/FAQs';
import AboutUs from '../Screen/AboutUs';
import CusSup from '../Screen/CusSup';
import Edit_Address from '../Screen/Edit_Address';
import {resetRoute} from '../utils/commonFunction';
import Edit_profile from '../Screen/Edit_profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Adress_screen from '../Screen/Adress_screen';
import Notification from '../Screen/Notification';
import AddMenu from '../Screen/AddMenu';
import Menu from '../Screen/Menu';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const Stack = createNativeStackNavigator();
export const navigationRef = React.createRef();

export default function AppNavigation() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoginStatus = async () => {
      try {
        const retrievedUserID = await AsyncStorage.getItem('userID');
        console.log('userID', retrievedUserID);
        const minimumTimeout = 1000;

        const startTime = new Date().getTime();

        const delay = 1000;
        const timerId = setTimeout(() => {
          setLoading(false);

          setIsUserLoggedIn(!!retrievedUserID);
          if (retrievedUserID) {
            resetRoute();
          }

          const endTime = new Date().getTime();
          const elapsedTime = endTime - startTime;

          console.log(`Loading time: ${elapsedTime} milliseconds`);
        }, Math.max(delay, minimumTimeout));

        return () => clearTimeout(timerId);
      } catch (error) {
        console.log('Error checking user login status:', error);

        setIsUserLoggedIn(false);
      }
    };

    checkUserLoginStatus();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}>
        <LinearGradient
          colors={['#F59E0B', '#FF6347']}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <ActivityIndicator
            size="large"
            color="#F59E0B"
            style={{color: 'transparent', top: 900}}
          />
          <Animatable.View animation="fadeIn" duration={2000} useNativeDriver>
            <Animatable.View
              // animation="zoomIn"
              iterationCount={1}
              style={{position: 'relative'}}>
              <Image
                style={{
                  width: 200,
                  height: 200,
                  resizeMode: 'contain',
                  marginBottom: 20,
                }}
                source={require('../assets/logo.jpg')}
                onError={error =>
                  console.log('Image Error:', error.nativeEvent.error)
                }
              />
              {/* <Animatable.View
                animation="rotate"
                iterationCount="infinite"
                duration={5000}
                style={{ position: 'absolute', top: 10, right: 25 }}>
                <Icon name="star" size={25} color="yellow" />
              </Animatable.View> */}
            </Animatable.View>
          </Animatable.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Edit_Address" component={Edit_Address} />
        <Stack.Screen name="Bank_details" component={Bank_details} />
        <Stack.Screen name="AccSettings" component={AccSettings} />
        <Stack.Screen name="OnboardScreen" component={OnboardScreen} />
        <Stack.Screen name="Otp_screen" component={Otp_screen} />
        <Stack.Screen name="Profile_Scrren" component={Profile_Scrren} />
        <Stack.Screen name="BottomNavigate" component={BottomNavigate} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Payment_history" component={Payment_history} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Adress_screen" component={Adress_screen} />
        <Stack.Screen name="FAQs" component={FAQs} />
        <Stack.Screen name="CusSup" component={CusSup} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="Edit_profile" component={Edit_profile} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="AddMenu" component={AddMenu} />
        <Stack.Screen name="Menu" component={Menu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
