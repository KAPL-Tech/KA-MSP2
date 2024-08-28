/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation, useRoute} from '@react-navigation/native';
import {responsiveHeight as hp} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile_Scrren from '../Screen/Profile_Scrren';
import Dashboard from '../Screen/Dashboard';
import Order from '../Screen/Order';

const Bottom = createBottomTabNavigator();

const BottomNavigator = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const [focusedTab, setFocusedTab] = useState(null);

  useEffect(() => {
    setFocusedTab(route.name);
  }, [route.name]);

  const colors = {
    focused: 'white',
    unfocused: 'black',
  };

  const getTabIcon = (routeName, isFocused) => {
    const iconColor = isFocused ? colors.focused : colors.unfocused;
    const iconName =
      routeName === 'Home'
        ? 'home'
        : routeName === 'Order'
        ? 'cart'
        : routeName === 'Profile'
        ? 'account'
        : null;

    return (
      <MaterialCommunityIcons
        name={iconName ? `${iconName}${isFocused ? '' : '-outline'}` : null}
        size={hp(4)}
        color={iconColor}
      />
    );
  };

  return (
    <Bottom.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {backgroundColor: '#D97706'},
        tabBarItemStyle: {justifyContent: 'center', alignItems: 'center'},
        tabBarIcon: ({color, focused}) => {
          return getTabIcon(route.name, focused);
        },
        tabBarLabelStyle: {
          color: colors.unfocused,
        },
      })}>
      <Bottom.Screen
        name="Home"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Bottom.Screen
        name="Order"
        component={Order}
        options={{headerShown: false}}
      />
      <Bottom.Screen
        name="Profile"
        component={Profile_Scrren}
        options={{headerShown: false}}
      />
    </Bottom.Navigator>
  );
};

export default BottomNavigator;
