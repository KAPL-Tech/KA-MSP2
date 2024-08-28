/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SplashScreen from 'react-native-splash-screen';
import {editConsumerProfile} from '../api/data/DataService';
import {getEnrolledPackages} from '../api/data/DataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const Edit_profile = props => {
  const navigation = useNavigation();
  useEffect(() => {
    SplashScreen.hide();
    fetchEnrolledPackages();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [newgender, setNEWGENDER] = useState('');
  const [userName, setUserName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNEWEmail] = useState('');
  const [newDOB, setNEWDOB] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  // const [editMode, setEditMode] = useState(false);

  // const handleEditClick = () => {
  //   setEditMode(!editMode);
  // };

  const validateEmail = input => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const validateMobileNumber = input => {
    return /^\d{10}$/.test(input);
  };

  const formatDate = date => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const confirmDate = () => {
    setSelectedDate(tempDate);
    setShowDatePicker(false);
  };

  const items = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Other', value: 'Other'},
  ];

  const handleUpdateProfile = async () => {
    const retrievedUserID = await AsyncStorage.getItem('userID');

    if (firstName && !/^[A-Za-z\s]+$/.test(firstName.trim())) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid First Name containing only letters.',
        [{text: 'OK'}],
      );
      return;
    }

    if (lastName && !/^[A-Za-z\s]+$/.test(lastName.trim())) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid Last Name containing only letters.',
        [{text: 'OK'}],
      );
      return;
    }

    if (mobile && !validateMobileNumber(mobile)) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid 10-digit mobile number.',
        [{text: 'OK'}],
      );
      return;
    }

    if (email && !validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.', [
        {text: 'OK'},
      ]);
      return;
    }

    try {
      const profileData = {
        userId: retrievedUserID,
        firstName: firstName || userName,
        lastName: lastName || newLastName,
        email: email || newEmail,
        mobile: mobile || newMobile,
        gender: currentValue || newgender,
        dob: dob || newDOB,
      };

      const response = await editConsumerProfile(profileData);

      // console.log('Profile updated:', response);
      setIsProfileUpdated(true);
    } catch (error) {
      console.error('Error updating profile:', error);

      showAlert('Failed to update profile');
    }
  };

  const fetchEnrolledPackages = async () => {
    try {
      const retrievedUserID = await AsyncStorage.getItem('userID');
      const userID = retrievedUserID;

      const packages = await getEnrolledPackages(userID);
      // console.log('Packages from API:', packages);

      if (packages && Object.keys(packages).length > 0) {
        const {FNAME, LNAME, MOBILE, EMAIL, DOB, GENDER} = packages;

        setUserName(`${FNAME}`);
        setNewMobile(MOBILE);
        setNewLastName(LNAME);
        setNEWEmail(EMAIL);
        setNEWDOB(DOB);
        setNEWGENDER(GENDER);
      }
    } catch (error) {
      console.error('Error fetching enrolled packages:', error);
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      <SafeAreaView style={styles.edit_screen_main}>
        <KeyboardAwareScrollView>
          <View style={styles.edit_parent}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Icon
                name="arrow-left"
                size={30}
                color="#F59E0B"
                style={{width: 32, height: 32, marginTop: 10}}
              />
            </TouchableOpacity>
            <View style={{marginTop: 10}}>
              <Text style={styles.text_Edit_profile_name}>Edit Profile</Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Image
                  style={styles.tinyLogo}
                  source={require('../assets/avtar2.jpg')}
                />
              </View>
            </View>

            <View style={{marginTop: 15}}>
              <Text style={styles.text_Edit_profile}>First Name</Text>
              <TextInput
                placeholder={userName || 'Enter First Name...'}
                value={firstName}
                onChangeText={text => setFirstName(text)}
                keyboardType="name-phone-pad"
                style={styles.input}
                placeholderTextColor="#404040"
                // editable={editMode}
              />
              <Text style={styles.text_Edit_profile}>Last Name</Text>
              <TextInput
                placeholder={newLastName || 'Enter Last Name...'}
                value={lastName}
                onChangeText={text => setLastName(text)}
                keyboardType="name-phone-pad"
                style={styles.input}
                placeholderTextColor="#404040"
                // editable={editMode}
              />

              <Text style={styles.text_Edit_profile}>Mobile</Text>
              <View>
                <TextInput
                  placeholder={newMobile || 'Enter Mobile Number...'}
                  value={mobile}
                  onChangeText={text => setMobile(text)}
                  keyboardType="numeric"
                  maxLength={10}
                  style={styles.input}
                  placeholderTextColor="#404040"
                  // editable={editMode}
                />
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('Otp_screen')
                  }></TouchableOpacity>
              </View>
              <Text style={styles.text_Edit_profile}>Email ID</Text>
              <TextInput
                placeholder={newEmail || 'Enter Email...'}
                value={email}
                onChangeText={text => setEmail(text)}
                keyboardType="email-address"
                style={styles.input}
                placeholderTextColor="#404040"
                // editable={editMode}
              />
              <Text style={styles.text_Edit_profile}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.dateInputContainer}
                onPress={() =>setShowDatePicker(true)}
                // disabled={!editMode}
              >
                <Text style={styles.dateInput}>{formatDate(selectedDate)}</Text>
                <Icon
                  name="calendar"
                  size={20}
                  color="#F59E0B"
                  style={styles.icon}
                />
              </TouchableOpacity>
              <Modal
                isVisible={showDatePicker}
                onBackdropPress={() => setShowDatePicker(false)}
                backdropOpacity={0.5}
                animationIn="slideInUp"
                animationOut="slideOutDown">
                <View style={styles.modalContainer}>
                  <DatePicker
                    date={selectedDate}
                    value={dob}
                    onChangeText={text => setDob(text)}
                    mode="date"
                    textColor="black"
                    onDateChange={date => setTempDate(date)}
                  />
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmDate}>
                    <Text style={styles.confirmText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </Modal>

              <View
                style={{
                  width: responsiveWidth(92),
                  paddingLeft: 10,
                  justifyContent: 'center',
                  flex: 1,
                  justifyContent: 'flex-start',
                  marginTop: 10,
                }}>
                <DropDownPicker
                  items={items}
                  open={isOpen}
                  value={currentValue}
                  setOpen={() => setIsOpen(!isOpen)}
                  setValue={val => setCurrentValue(val)}
                  placeholder={newgender || 'Gender..'}
                  placeholderStyle={{color: 'grey', fontSize: 15}}
                  dropdownPosition="top"
                  theme="LIGHT"
                  autoScroll={true}
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}>
          <Text style={styles.updateButtonText}>UPDATE PROFILE</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isProfileUpdated}
          onRequestClose={() => {
            setIsProfileUpdated(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Profile Updated Successfully!
              </Text>
              <TouchableHighlight
                style={styles.closeButton}
                onPress={() => {
                  setIsProfileUpdated(false);
                  navigation.navigate('BottomNavigate');
                }}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  edit_screen_main: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'space-between',
  },
  editParent: {
    height: responsiveHeight(85),
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2),
  },
  tinyLogo: {
    width: responsiveWidth(20),
    height: responsiveWidth(21),
    borderRadius: responsiveWidth(10),
    borderColor: '#FACC15',
    borderWidth: responsiveWidth(0.8),
    marginLeft: responsiveWidth(5),
    backgroundColor: '#F59E0B',
  },
  input: {
    marginVertical: responsiveHeight(1),
    height: responsiveHeight(6),
    width: responsiveWidth(95),
    borderWidth: responsiveWidth(0.2),
    fontSize: responsiveWidth(3.5),
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#fff',
    color: 'black',
    marginLeft: 10,
  },
  text_Edit_profile_name: {
    fontSize: responsiveWidth(5),
    fontWeight: '400',
    letterSpacing: responsiveWidth(0.2),
    fontStyle: 'normal',
    paddingLeft: responsiveWidth(3),
    color: '#404040',
  },
  text_Edit_profile: {
    paddingLeft: responsiveWidth(3),
    fontSize: responsiveWidth(3.5),
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: '#404040',
    letterSpacing: responsiveWidth(0.1),
  },
  Change: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: responsiveHeight(1),
    height: responsiveHeight(6),
    borderColor: '#F59E0B',
    borderWidth: responsiveWidth(0.2),
    fontSize: responsiveWidth(3.5),
    fontWeight: '400',
    letterSpacing: responsiveWidth(0.1),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(2),
    color: 'black',
    paddingHorizontal: responsiveWidth(2),
  },
  ChangeText: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: responsiveWidth(34),
    color: '#F59E0B',
    fontSize: responsiveWidth(3.5),
    fontWeight: '400',
    letterSpacing: responsiveWidth(0.1),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: responsiveWidth(0.2),
    borderColor: 'grey',
    borderRadius: responsiveWidth(1),
    paddingHorizontal: responsiveWidth(2),
    marginVertical: responsiveHeight(1),
    height: responsiveHeight(6),
    width: responsiveWidth(95),
    backgroundColor: '#fff',
    marginLeft: 10,
  },
  dateInput: {
    flex: 1,
    paddingVertical: responsiveHeight(1.5),
    color: '#404040',
    fontSize: responsiveWidth(3.5),
  },
  icon: {
    marginRight: responsiveWidth(2),
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: responsiveWidth(1),
    padding: responsiveWidth(2),
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(1),
    marginTop: responsiveHeight(2),
  },
  confirmText: {
    color: 'white',
    fontSize: responsiveWidth(4),
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  modalView: {
    margin: responsiveWidth(4),
    backgroundColor: 'white',
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(7),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#F59E0B',
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(2),
    elevation: 2,
    marginTop: responsiveHeight(1.5),
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: responsiveWidth(3),
    textAlign: 'center',
    fontSize: responsiveWidth(4.5),
    fontWeight: 'bold',
    color: 'black',
  },
  updateButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: hp('2%'),
    marginTop: hp('13.5%'),
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
});

export default Edit_profile;
