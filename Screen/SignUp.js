import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  Linking,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {handleApi} from '../api/data/DataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

const SignupModal = ({isVisible, onClose, navigation}) => {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    type: '1',
  });
  const [toggleCheckBox, settoggleCheckBox] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const privacyPolicyLink =
    'https://khanaanywhere.com/application/modules/web/views/Privacy_policy.html';

  const handlePrivacyPolicyPress = () => {
    Linking.openURL(privacyPolicyLink);
  };

  const handleSignup = async () => {
    setIsButtonDisabled(true);
    if (!data.firstName) {
      setIsButtonDisabled(false);
      Alert.alert('Please enter First Name');
      return;
    }

    if (!data.lastName) {
      setIsButtonDisabled(false);
      Alert.alert('Please enter Last Name');
      return;
    }

    if (!data.email) {
      setIsButtonDisabled(false);
      Alert.alert('Please enter Email');
      return;
    }

    if (!data.mobile) {
      setIsButtonDisabled(false);
      Alert.alert('Please enter Mobile Number');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim() || !emailRegex.test(data.email.trim())) {
      setIsButtonDisabled(false);
      Alert.alert('Please enter a valid Email');
      return;
    }

    if (!data.mobile.trim() || data.mobile.trim().length !== 10) {
      setIsButtonDisabled(false);
      Alert.alert('Please enter a 10-digit Mobile Number');
      return;
    }

    // if (isButtonDisabled) {
    //   // console.log('Button disabled', 'You can only click the button once.');
    //   return;
    // }

    try {
      const response = await handleApi(data);

      if (response.status === 200) {
        await AsyncStorage.setItem('userMobileNumberSignup', data.mobile);

        navigation.navigate('Otp_screen', {from: 'Signup'});

        // console.log('User successfully signed up');
      }
    } catch (error) {
      setIsButtonDisabled(false);
      console.log('Error in catch:', error);
    }

    onClose();
  };

  const isValidEmail = value => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleLogin = () => {
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      avoidKeyboard={true}
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <ScrollView contentContainerStyle={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Signup</Text>

          <View style={styles.inputContainer}>
            <FontAwesome5
              name="user"
              size={heightPercentageToDP(3)}
              color="#F59E0B"
              style={styles.icon}
            />
            <TextInput
              style={{
                ...styles.input,
                color: '#404040',
              }}
              placeholder="First Name"
              placeholderTextColor={'#A3A3A3'}
              value={data.firstName}
              keyboardType="default"
              onChangeText={text => setData({...data, firstName: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5
              name="user"
              size={heightPercentageToDP(3)}
              color="#F59E0B"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor={'#A3A3A3'}
              value={data.lastName}
              keyboardType="default"
              onChangeText={text => setData({...data, lastName: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5
              name="envelope"
              size={heightPercentageToDP(3)}
              color="#F59E0B"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={'#A3A3A3'}
              value={data.email}
              keyboardType="email-address"
              onChangeText={text => setData({...data, email: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5
              name="phone"
              size={heightPercentageToDP(3)}
              color="#F59E0B"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile number"
              placeholderTextColor={'#A3A3A3'}
              value={data.mobile}
              keyboardType="number-pad"
              onChangeText={text => {
                const formattedText = text.replace(/[^0-9]/g, '');
                if (formattedText.length <= 10) {
                  setData({...data, mobile: formattedText});
                }
              }}
            />
          </View>

          <View style={styles.checkbox}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              boxType="square"
              tintColors={{true: '#F59E0B', false: 'black'}}
              style={{borderColor: 'green'}}
              onValueChange={newValue => settoggleCheckBox(newValue)}
            />
            <Text style={{fontSize: 16, fontWeight: '400', color: '#171717'}}>
              Accept the{' '}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  color: '#0077E6',
                  textDecorationLine: 'underline',
                }}
                onPress={() => setShowTermsModal(true)}>
                Terms and Conditions
              </Text>
            </Text>
          </View>

          <Modal
            visible={showTermsModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowTermsModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  <Text style={styles.heading}>Terms and Conditions</Text>
                  <Text style={styles.section}>
                    <Text style={styles.sectionHeader}>1. Introduction</Text>
                    {'\n'}
                    Welcome to Digi Mess Partner These terms and conditions
                    govern your use of the app. By using our services, you agree
                    to abide by these terms.
                  </Text>
                  <Text style={styles.section}>
                    <Text style={styles.sectionHeader}>
                      2. Scope of Service
                    </Text>
                    {'\n'}
                    Digi Mess Partner provides a platform that allows users to
                    order food from various restaurants, track orders, and make
                    payments for delivery services.
                  </Text>
                  <Text style={styles.section}>
                    <Text style={styles.sectionHeader}>3. User Agreement</Text>
                    {'\n'}
                    You agree to use the app in compliance with all applicable
                    laws and regulations and not to engage in any illegal or
                    unauthorized activities.
                  </Text>
                  <Text style={styles.section}>
                    <Text style={styles.sectionHeader}>
                      4. User Responsibilities
                    </Text>
                    {'\n'}
                    You are responsible for maintaining the accuracy of your
                    account information, including contact details and delivery
                    addresses.
                  </Text>
                  <Text style={styles.section}>
                    <Text style={styles.sectionHeader}>5. Privacy Policy</Text>
                    {'\n'}
                    We are committed to protecting your privacy. Our Privacy
                    Policy outlines how we collect, use, and disclose your
                    personal information. Check the link below
                    {'\n'}
                    <Text
                      style={styles.link}
                      onPress={handlePrivacyPolicyPress}>
                      Privacy and Policy
                    </Text>
                  </Text>
                  <Text style={styles.section}>
                    <Text style={styles.sectionHeader}>
                      6. Payments and Billing
                    </Text>
                    {'\n'}
                    By placing an order through Digi Mess Partner, you agree to
                    pay for all charges including food costs, delivery fees, and
                    any applicable taxes.
                  </Text>
                </ScrollView>
                <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                  <Text style={styles.closeButton}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            onPress={handleSignup}
            style={{
              ...styles.Login,
              backgroundColor: toggleCheckBox ? '#F59E0B' : '#C0C0C0',
            }}
            disabled={!toggleCheckBox}>
            <Text
              style={{color: '#fff', fontWeight: 500, fontSize: 16}}
              disabled={isButtonDisabled}>
              SIGN UP
            </Text>
          </TouchableOpacity>

          <View style={styles.Login_Page}>
            <Text
              style={{
                color: '#404040',
                fontWeight: 400,
                fontSize: 16,
                top: 10,
              }}>
              Already Registered With Us?
            </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text
                style={{
                  color: '#F59E0B',
                  fontWeight: 500,
                  fontSize: 16,
                  marginTop: 10,
                  // bottom: 15,
                }}>
                LOGIN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: widthPercentageToDP('5%'),
    borderTopLeftRadius: widthPercentageToDP('5%'),
    borderTopRightRadius: widthPercentageToDP('5%'),
  },
  title: {
    fontSize: heightPercentageToDP('3%'),
    fontWeight: 'bold',
    marginBottom: heightPercentageToDP('2%'),
    color: '#404040',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPercentageToDP('2%'),
    color: '#404040',
  },
  Login_Page: {
    alignItems: 'center',
  },
  icon: {
    marginRight: widthPercentageToDP('2%'),
  },
  input: {
    flex: 1,
    height: heightPercentageToDP('5%'),
    borderColor: 'gray',
    borderBottomWidth: 1,
    padding: widthPercentageToDP('2%'),
    fontSize: heightPercentageToDP('2%'),
    color: '#404040',
  },
  acceptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPercentageToDP('2%'),
    // color:'#404040'
  },
  termsLink: {
    color: '#0077E6',
  },
  errorText: {
    color: 'red',
    fontSize: heightPercentageToDP('2%'),
    marginBottom: heightPercentageToDP('1%'),
  },
  checkbox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'red'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    marginVertical: 30,
  },
  section: {
    marginBottom: 20,
    lineHeight: 22,
    color: '#555',
  },
  sectionHeader: {
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    fontSize: 16,
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  Login: {
    height: 50,
    width: 250,
    borderRadius: 150 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    alignSelf: 'center',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default SignupModal;
