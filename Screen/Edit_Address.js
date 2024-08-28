import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Button,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {manageMSPAddress} from '../api/data/DataService';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';

const Edit_Address = props => {
  const {addressDetails} = props.route.params || {};
  const [isDefault, setIsDefault] = useState(false);
  const [pincode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [fetchCount, setFetchCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const navigation = useNavigation();

  const validatePincode = input => {
    return /^\d{6}$/.test(input);
  };

  const validateLetters = input => {
    return /^[A-Za-z ]+$/.test(input);
  };

  useEffect(() => {
    if (addressDetails) {
      setPinCode(addressDetails.AD_PIN || '');
      setState(addressDetails.AD_STATE || '');
      setCity(addressDetails.AD_CITY || '');
      setLine1(addressDetails.AD_LINE1 || '');
      setLine2(addressDetails.AD_LINE2 || '');
      setIsDefault(!!addressDetails.AD_DEFAULT);
    }
  }, [addressDetails]);

  // console.log('addressDetatils', addressDetails);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        const isLocationEnabledResult = await isLocationEnabled();
        if (!isLocationEnabledResult) {
          Alert.alert(
            'Prominent Disclosure',
            'Digi-Mess app collects location data to enable "Efficient Mess Search" even when the app is closed or not in use and it is also used to support advertising.',
            [
              {
                text: 'OK',
                onPress: async () => {
                  await promptForEnableLocationIfNeeded();
                  fetchCurrentLocation();
                },
              },
            ],
            {cancelable: false},
          );
          return;
        }

        const position = await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 1000,
          });
        });

        const {longitude, latitude} = position.coords;
        setLongitude(longitude.toFixed(6));
        setLatitude(latitude.toFixed(6));

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        );
        const data = await response.json();

        if (data && data.address) {
          const {postcode, state, city} = data.address;

          setPinCode(postcode || '');
          setState(state || '');
          setCity(city || '');

          setFetchCount(prevCount => prevCount + 1);
        }

        setLastFetchTime(new Date());
      } catch (error) {
        console.error('Error fetching location or address:', error);
      }
    };

    fetchCurrentLocation();
  }, [lastFetchTime]);

  const saveAddress = async () => {
    const retrievedUserID = await AsyncStorage.getItem('userID');
    const userID = retrievedUserID;
    const reqtype = 's';

    if (!validatePincode(pincode)) {
      Alert.alert('Invalid Pincode', 'Please enter a 6-digit numeric pincode.');
      return;
    }

    if (!validateLetters(state) || !validateLetters(city)) {
      Alert.alert(
        'Invalid State/City',
        'Please enter letters only for state and city.',
      );
      return;
    }

    try {
      const response = await manageMSPAddress({
        userID,
        reqtype,
        line1,
        line2,
        city,
        state,
        pincode,
        latitude,
        longitude,
      });

      // console.log('Response:', response);

      if (response) {
        if (
          response.status === 'SUCCESS' &&
          response.message &&
          response.message.result === true
        ) {
          // console.log('Address saved successfully');
          Alert.alert('Address Saved Successfully');
          props.navigation.navigate('Bank_details', {isDefault});
        } else {
          console.error('Failed to save address:', response.message.msg);
        }
      } else {
        console.error('Failed to save address: Empty response');
      }
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const updateAddressHandler = async () => {
    try {
      if (!validatePincode(pincode)) {
        Alert.alert(
          'Invalid Pincode',
          'Please enter a 6-digit numeric pincode.',
        );
        return;
      }

      if (!validateLetters(state) || !validateLetters(city)) {
        Alert.alert(
          'Invalid State/City',
          'Please enter letters only for state and city.',
        );
        return;
      }

      if (!addressDetails) {
        console.error('Address details are missing.');
        return;
      }

      const addressID = addressDetails.AD_ID;

      const retrievedUserID = await AsyncStorage.getItem('userID');
      const userID = retrievedUserID;

      const reqtype = 'u';

      const apiParams = {
        userID,
        reqtype,
        addID: addressID,
        line1,
        line2,
        city,
        state,
        pincode,
        longitude,
        latitude,
      };

      const response = await manageMSPAddress(apiParams);

      if (response && response.status === 'SUCCESS') {
        Alert.alert('Success', 'Address updated successfully', [
          {
            text: 'OK',
            onPress: () => {
              props.navigation.navigate('Adress_screen');
            },
          },
        ]);
      } else {
        throw new Error('Failed to update the address');
      }
    } catch (err) {
      console.error('Error updating address:', err);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.edit_parent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              size={30}
              color="#F59E0B"
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
          <Text style={styles.text_Edit_profile_name}>Add new Address</Text>
          <Image
            style={styles.mapImage}
            source={require('../assets/Map.jpg')}
          />
        </View>

        <View style={styles.textContent}>
          <Text style={styles.text_Edit_profile}>Pincode</Text>
          <TextInput
            style={styles.textinput1}
            placeholder="Pincode"
            value={pincode}
            onChangeText={txt => {
              if (/^\d{0,6}$/.test(txt)) {
                setPinCode(txt);
              }
            }}
            keyboardType="phone-pad"
            placeholderTextColor="#A3A3A3"
          />
          <Text style={styles.text_Edit_profile}>State</Text>
          <TextInput
            style={styles.textinput1}
            placeholder="State"
            keyboardType="default"
            value={state}
            onChangeText={txt => {
              if (/^[A-Za-z\s'-]*$/.test(txt)) {
                setState(txt);
              }
            }}
            maxLength={20}
            placeholderTextColor="#A3A3A3"
          />
          <Text style={styles.text_Edit_profile}>City</Text>
          <TextInput
            style={styles.textinput1}
            placeholder="City"
            keyboardType="default"
            value={city}
            onChangeText={txt => {
              if (/^[A-Za-z\s'-]*$/.test(txt)) {
                setCity(txt);
              }
            }}
            placeholderTextColor="#A3A3A3"
          />
          <Text style={styles.text_Edit_profile}>Street address</Text>
          <TextInput
            style={styles.textinput1}
            placeholder="Street Address"
            keyboardType="default"
            value={line1}
            onChangeText={txt => setLine1(txt)}
            placeholderTextColor="#A3A3A3"
          />
          <Text style={styles.text_Edit_profile}>Building name/House no.</Text>
          <TextInput
            style={styles.textinput1}
            placeholder="Building Name/House No.."
            keyboardType="default"
            value={line2}
            onChangeText={txt => setLine2(txt)}
            placeholderTextColor="#A3A3A3"
          />
          <Text style={styles.text_Edit_profile}>Longitude</Text>
          <Text style={styles.textinput2}>{longitude}</Text>

          <Text style={styles.text_Edit_profile}>Latitude</Text>
          <Text style={styles.textinput2}>{latitude}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={addressDetails ? updateAddressHandler : saveAddress}>
          <Text style={styles.buttonText}>
            {addressDetails ? 'UPDATE' : 'SAVE'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  mapImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 10,
  },
  input: {
    margin: 20,
    height: 50,
    borderColor: '#F59E0B',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingLeft: 10,
  },
  text_Edit_profile: {
    paddingLeft: 10,
    fontSize: 15,
    fontWeight: '400',
    color: '#404040',
    marginTop: 10,
  },
  textContent: {
    marginTop: 20,
  },
  edit_screen_main: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  header: {
    borderBottomWidth: 1,
    borderColor: '#F59E0B',
  },
  text_Edit_profile_name: {
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 1.5,
    fontStyle: 'normal',
    paddingLeft: 15,
    color: '#404040',
    alignSelf: 'center',
    marginTop: 10,
  },
  mapImage: {
    width: responsiveWidth(100),
    height: responsiveWidth(50),
  },
  input: {
    margin: responsiveWidth(2),
    height: responsiveHeight(5),
    borderColor: '#F59E0B',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    backgroundColor: '#fff',
    borderRadius: 10 / 1,
    color: 'black',
  },
  text_Edit_profile: {
    paddingLeft: 15,
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: '#404040',
    letterSpacing: 0.25,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#171717',
  },
  saveButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(44),
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
  },
  textinput1: {
    backgroundColor: '#fff',
    width: wp(95),
    height: hp(6),
    borderRadius: 6,
    borderColor: '#A3A3A3',
    borderWidth: 1,
    paddingLeft: wp(2),
    // marginLeft: wp(2),
    margin: wp(2),
    color: '#404040',
    marginTop: hp('1%'),
  },
  textinput2: {
    backgroundColor: '#fff',
    width: wp(95),
    height: hp(6),
    borderRadius: 6,
    borderColor: '#A3A3A3',
    borderWidth: 1,
    paddingLeft: wp(3),
    marginLeft: wp(2),
    margin: wp(2),
    color: '#404040',
    marginTop: hp('1%'),
    textAlignVertical: 'center',
  },
  button: {
    backgroundColor: '#F59E0B',
    width: wp('60%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    // alignContent:'center',
    alignSelf: 'center',
    borderRadius: wp('10%'),
    marginBottom: hp('1%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: hp('2.5%'),
    fontWeight: '500',
  },
});

export default Edit_Address;
