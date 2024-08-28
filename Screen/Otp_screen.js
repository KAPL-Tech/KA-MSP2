import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {validateOTP, resendOTP} from '../api/data/DataService';
import {resetRoute} from '../utils/commonFunction';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const OtpScreen = props => {
  const input_1 = useRef();
  const input_2 = useRef();
  const input_3 = useRef();
  const input_4 = useRef();
  // const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [otp, setOtp] = useState({
    input1: '',
    input2: '',
    input3: '',
    input4: '',
  });

  const {from} = props.route.params;
  // console.log('Route from', {from});

  const handleSubmit = async () => {
    // if (isButtonDisabled) {
    //   console.log('Button disabled', 'You can only click the button once.');
    //   return;
    // }

    // setIsButtonDisabled(true);
    // console.log('Submit button is clicked');
    const otpCode = parseInt(
      otp.input1 + otp.input2 + otp.input3 + otp.input4,
      10,
    );
    // console.log('otpcode', otpCode);
    // console.log(typeof otpCode);
    // console.log(otpCode.toString().length);

    if (otpCode.toString().length === 4) {
      // console.log('Validating OTP...');
      const mobileKey =
        from === 'Login' ? 'userMobileNumberLogin' : 'userMobileNumberSignup';
      try {
        const userData = await AsyncStorage.getItem(mobileKey);
        const mobile = userData ? JSON.parse(userData) : null;
        type = '1';

        const response = await validateOTP(mobile, otpCode, type);

        if (response && response.status === 200) {
          const {userID} = response.data.message;
          await AsyncStorage.setItem('userID', userID.toString());
          // console.log('userID', userID);

          // console.log('otp validations successful');

          if (from === 'Login') {
            resetRoute();
          } else if (from === 'Signup') {
            resetRoute('OnboardScreen');
          } else {
            props.navigation.navigate('Login');
          }
        } else {
          Alert.alert(
            'Invalid OTP',
            'The OTP code you entered is invalid. Please try again.',
          );
        }
      } catch (error) {
        console.error('Error submitting OTP:', error);
      }
    }
  };

  const handleInputChange = (fieldName, txt) => {
    setOtp({...otp, [fieldName]: txt});
  };

  const handleResendOTP = async () => {
    try {
      const mobileKey =
        from === 'Login' ? 'userMobileNumberLogin' : 'userMobileNumberSignup';
      const userData = await AsyncStorage.getItem(mobileKey);
      const mobile = userData ? JSON.parse(userData) : null;

      const response = await resendOTP(mobile);

      if (response) {
        Alert.alert('OTP Resent', 'The OTP has been resent successfully.');
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.otp_main}>
        <Image
          style={styles.otp_img}
          source={require('../assets/otp_screen.png')}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Verify your phone number</Text>
        <Text style={styles.subHeaderText}>
          Enter the 4-digit OTP code number
        </Text>
      </View>
      <View style={styles.otp_textinput_view}>
        <TextInput
          placeholder="-"
          placeholderTextColor="#404040"
          maxLength={1}
          ref={input_1}
          keyboardType="number-pad"
          onChangeText={txt => {
            handleInputChange('input1', txt);
            if (txt.length >= 1) {
              input_2.current.focus();
            } else {
              input_1.current.focus();
            }
          }}
          style={styles.otp_textInput}
        />
        <TextInput
          placeholder="-"
          placeholderTextColor="#404040"
          maxLength={1}
          ref={input_2}
          keyboardType="number-pad"
          onChangeText={txt => {
            handleInputChange('input2', txt);
            if (txt.length >= 1) {
              input_3.current.focus();
            } else {
              input_1.current.focus();
            }
          }}
          style={styles.otp_textInput}
        />
        <TextInput
          placeholder="-"
          placeholderTextColor="#404040"
          maxLength={1}
          ref={input_3}
          keyboardType="number-pad"
          onChangeText={txt => {
            handleInputChange('input3', txt);
            if (txt.length >= 1) {
              input_4.current.focus();
            } else {
              input_2.current.focus();
            }
          }}
          style={styles.otp_textInput}
        />
        <TextInput
          placeholder="-"
          placeholderTextColor="#404040"
          maxLength={1}
          ref={input_4}
          keyboardType="number-pad"
          onChangeText={txt => {
            handleInputChange('input4', txt);
            if (txt.length >= 1) {
            } else {
              input_3.current.focus();
            }
          }}
          style={styles.otp_textInput}
        />
      </View>
      <View style={styles.otp_btn_view}>
        <TouchableOpacity
          style={styles.otp_btn_touchopacity}
          onPress={handleSubmit}
          // disabled={isButtonDisabled}
        >
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#404040', fontSize: 16, fontWeight: '400'}}>
            Didn't receive the code?
          </Text>
          <TouchableOpacity
            style={{width: '50%', justifyContent: 'center'}}
            onPress={handleResendOTP}>
            <Text style={{color: '#D97706', fontSize: 16, fontWeight: '500'}}>
              RESEND OTP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  otp_main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otp_img: {
    width: '100%',
    height: '100%',
  },
  otp_textinput_view: {
    flex: 0.46,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  otp_textInput: {
    height: 50,
    width: 50,
    textAlign: 'center',
    color: '#404040',
    fontSize: 18,
    fontWeight: '400',
    borderRadius: 20 / 2,
    borderWidth: 0.5,
  },
  otp_btn_touchopacity: {
    backgroundColor: '#6B21A8',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    height: '30%',
    borderRadius: 150 / 2,
  },
  otp_btn_view: {
    flex: 0.7,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  header: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#D97706',
    fontSize: 0.05 * width,
    fontWeight: '400',
  },
  subHeaderText: {
    color: '#404040',
    fontSize: 0.035 * width,
    fontWeight: '400',
  },
  btnText: {
    fontSize: 0.04 * width,
    fontWeight: '500',
    color: '#fff',
  },
  otp_btn_touchopacity: {
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.7,
    height: height * 0.07,
    borderRadius: (width * 0.5) / 2,
  },
});
