/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  PermissionsAndroid,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignupScreen from './SignUp';
import {signIn} from '../api/data/DataService';
import {useNavigation} from '@react-navigation/native';

const Login = props => {
  const navigation = useNavigation();
  const [isSignupModalVisible, setSignupModalVisible] = useState(false);
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const ValidateMobile = () => {
    if (!mobile) {
      setModalMessage('Mobile Number is Required');
      setModalVisible(true);
      setIsButtonDisabled(false);
      return false;
    } else if (!/^[0-9]{10}$/.test(mobile)) {
      setModalMessage('Invalid Mobile Number');
      setModalVisible(true);
      setIsButtonDisabled(false);
      return false;
    }
    return true;
  };

  const handleSignupLinkPress = () => {
    setSignupModalVisible(true);
  };
  const closeSignupModal = () => {
    setSignupModalVisible(false);
  };
  const handleSignIn = async () => {
    if (isButtonDisabled) {
      // console.log('Button disabled', 'You can only click the button once.');
      return;
    }

    if (!ValidateMobile()) {
      return;
    }

    try {
      const mobileNumber = mobile;
      const type = '1';

      setIsButtonDisabled(true);

      const response = await signIn(Number(mobileNumber), type);

      if (response.statusCode === 200) {
        await AsyncStorage.setItem('userMobileNumberLogin', mobileNumber);
        props.navigation.navigate('Otp_screen', {from: 'Login'});
      } else {
        setIsButtonDisabled(false);
        if (response.message === 'Customer does not exist') {
          setModalMessage('Customer does not exist. Please Sign-up');
          setModalVisible(true);
        } else {
          console.error('Unexpected response:', response);
        }
      }
    } catch (error) {
      setIsButtonDisabled(false);
      console.error('Error during sign-in:', error);
      setModalMessage('Customer does not exist. Please Sign-up');
      setModalVisible(true);
    }
  };

  async function requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to provide better services.',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }

    return true;
  }

  return (
    <ImageBackground
      source={require('../assets/m-bg.jpg')}
      style={styles.Main_Image}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        extraHeight={Platform.OS === 'ios' ? hp(8) : 0}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.jpg')}
            resizeMode="contain"
            style={[styles.logoImage, {height: hp(18)}]}
          />
          <Text style={[styles.logoText, {fontSize: hp(7.5)}]}>Hello!</Text>
          <Text style={[styles.subtitle, {fontSize: hp(2.2)}]}>
            Sign in to your business account
          </Text>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <ScrollView
              contentContainerStyle={styles.modalContentContainer}
              showsVerticalScrollIndicator={false}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{modalMessage}</Text>
                <TouchableOpacity
                  style={styles.modalButtonOK}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon
              name="tablet-android"
              size={hp(3.5)}
              color="#7E22CE"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Mobile number"
              placeholderTextColor="#262626"
              keyboardType="number-pad"
              maxLength={10}
              style={[styles.input, {fontSize: hp(2.2)}]}
              value={mobile}
              onChangeText={text => {
                if (text.length <= 10) {
                  setMobile(text);
                  setMobileError('');
                }
              }}
            />
            {mobileError ? (
              <Text style={styles.errorText}>{mobileError}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={handleSignIn}
            style={[styles.loginButton, {height: hp(7)}]}
            disabled={isButtonDisabled}>
            <Text style={[styles.loginButtonText, {fontSize: hp(2)}]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, {fontSize: hp(2.1)}]}>
            Not registered with us?
          </Text>
          <TouchableOpacity onPress={handleSignupLinkPress}>
            <Text style={[styles.signUpText, {fontSize: hp(2)}]}>Sign up</Text>
          </TouchableOpacity>
          <SignupScreen
            isVisible={isSignupModalVisible}
            onClose={closeSignupModal}
            navigation={navigation}
          />
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  Main_Image: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logoImage: {
    height: hp(18),
  },
  logoText: {
    color: '#7E22CE',
    fontWeight: '400',
  },
  subtitle: {
    color: '#404040',
    fontSize: hp(1.8),
    fontWeight: '500',
  },
  formContainer: {
    flex: 0.5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  inputIcon: {
    paddingTop: hp(1.5),
    paddingRight: hp(1),
  },
  input: {
    width: wp(85),
    borderBottomWidth: 1,
    fontSize: hp(2.2),
    fontWeight: '500',
  },
  loginButton: {
    width: wp(70),
    backgroundColor: '#7E22CE',
    height: hp(7),
    borderRadius: hp(7) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: '500',
  },
  registerContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10,
  },
  registerText: {
    color: '#262626',
    fontSize: hp(1.6),
    fontWeight: '500',
  },
  signUpText: {
    color: '#6B21A8',
    fontSize: hp(1.6),
    fontWeight: '500',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    justifyContent: 'center',
    alignContent: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#404040',
  },
  modalButtonOK: {
    backgroundColor: '#7E22CE',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Login;
