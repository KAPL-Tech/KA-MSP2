/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {manageMSPSettings} from '../api/data/DataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Modal from 'react-native-modal';

const AccSettings = ({navigation}) => {
  const [mealType, setMealType] = useState(null);
  const [menuType, setMenuType] = useState(null);
  const [invoiceFrequency, setInvoiceFrequency] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [status, setStatus] = useState(null);
  const [lunchStart, setLunchStart] = useState('');
  const [lunchEnd, setLunchEnd] = useState('');
  const [dinnerStart, setDinnerStart] = useState('');
  const [dinnerEnd, setDinnerEnd] = useState('');
  const [messName, setMessName] = useState('');
  const [capacityValue, setCapacityValue] = useState('');
  const [autoconfirmValue, setAutoconfirmValue] = useState('');
  const [delChargesValue, setDelChargesValue] = useState('');
  const [userDataExists, setUserDataExists] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isAlertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    navigation.goBack();
  };

  const showTimePickerForField = field => {
    setSelectedField(field);
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = date => {
    hideTimePicker();
    const formattedTime = `${date.getHours() % 12 || 12}:${String(
      date.getMinutes(),
    ).padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;

    switch (selectedField) {
      case 'lunchStart':
        setLunchStart(formattedTime);
        break;
      case 'lunchEnd':
        setLunchEnd(formattedTime);
        break;
      case 'dinnerStart':
        setDinnerStart(formattedTime);
        break;
      case 'dinnerEnd':
        setDinnerEnd(formattedTime);
        break;
      default:
        break;
    }
  };

  const formatTime = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const mspID = await AsyncStorage.getItem('mspID');

        if (mspID) {
          const startTime = performance.now();
          const response = await manageMSPSettings({mspID, type: 'g'});
          const endTime = performance.now();

          if (
            response.status === 'SUCCESS' &&
            response.message &&
            response.message.status
          ) {
            const userData = response.message.msg[0];

            setUserDataExists(true);

            setMessName(userData.MSP_NAME || '');
            setMealType(userData.MSP_TYPE || null);
            setCapacityValue(
              userData.capacity !== null && userData.MSP_CAPACITY !== undefined
                ? userData.MSP_CAPACITY.toString()
                : '',
            );
            setAutoconfirmValue(
              userData.MSP_AUTO_CNFM !== null &&
                userData.MSP_AUTO_CNFM !== undefined
                ? userData.MSP_AUTO_CNFM.toString()
                : '',
            );
            setDeliveryOption(userData.MSP_DELIVERY === 1 ? 'Yes' : 'No');
            setStatus(userData.MSP_BUS_STATUS || '');
            setLunchStart(userData.MSP_LSTRT_HRS || '');
            setLunchEnd(userData.MSP_LEND_HRS || '');
            setDinnerStart(userData.MSP_DSTRT_HRS || '');
            setDinnerEnd(userData.MSP_DEND_HRS || '');
            setInvoiceFrequency(userData.MSP_INVC_FREQ || '');
            setDelChargesValue(
              userData.DEL_CHG !== null && userData.DEL_CHG !== undefined
                ? userData.DEL_CHG.toString()
                : '',
            );
          } else {
            setUserDataExists(false);
          }
        } else {
          setUserDataExists(false);
        }
      } catch (error) {
        setUserDataExists(false);
      }
    };

    fetchDataFromAPI();
  }, []);

  const handleDeliveryOptionClick = option => {
    setDeliveryOption(option);
  };

  const handleStatusClick = stat => {
    setStatus(stat);
  };

  const handleMealTypeClick = type => {
    setMealType(type);
  };

  const handleMenuTypeClick = type => {
    setMenuType(type);
  };

  const handleInvoiceFrequencyClick = frequency => {
    setInvoiceFrequency(frequency);
  };
  const [scrollViewHeight, setScrollViewHeight] = useState(hp(100));

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setScrollViewHeight(hp(72));
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setScrollViewHeight(hp(100));
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleEditClick = () => {
    setEditMode(prevEditMode => !prevEditMode);
  };

  const renderButton = (label, state, onPress, isEditable = true) => (
    <TouchableOpacity
      style={[
        styles.buttonStyle,
        state === label && styles.selectedButton,
        styles.editableButton,
      ]}
      onPress={() => onPress(label)}
    
    >
      <Text
        style={[
          styles.buttonText,
          state === label && styles.selectedText,
          styles.editableText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  const handleSubmit = async () => {
    const retrievedUserID = await AsyncStorage.getItem('userID');
    const userID = retrievedUserID;

    try {
      const mspSettingsData = {
        userID: userID,
        type: 's',
        messName: messName,
        messType: mealType,
        capacity: parseInt(capacityValue) || 0,
        autoConfirm: parseInt(autoconfirmValue) || 0,
        delivery: deliveryOption === 'Yes' ? 1 : 0,
        status: status === '0' ? '0' : '1',
        l_strtHrs: lunchStart ? lunchStart.toString() : '',
        l_endHrs: lunchEnd ? lunchEnd.toString() : '',
        d_strtHrs: dinnerStart ? dinnerStart.toString() : '',
        d_endHrs: dinnerEnd ? dinnerEnd.toString() : '',
        invoice: invoiceFrequency,
        del_chg: delChargesValue || 0,
      };

      const response = await manageMSPSettings(mspSettingsData);

      if (
        response &&
        response.status === 'SUCCESS' &&
        response.statusCode === 200 &&
        response.message &&
        response.message.mspID !== null &&
        response.message.mspID !== undefined
      ) {
        const {mspID} = response.message;
        await AsyncStorage.setItem('mspID', mspID.toString());
      } else {
        console.error('Invalid response structure or missing mspID.');
      }
      navigation.navigate('BottomNavigate');
    } catch (error) {
      console.error('Error while submitting:', error);
    }
  };

  const CustomAlert = ({isVisible, message, onPress}) => {
    return (
      <Modal isVisible={isVisible}>
        <View style={styles.customAlertContainer}>
          <View style={styles.customAlertContent}>
            <Text style={styles.customAlertMessage}>{message}</Text>
            <TouchableOpacity
              style={styles.customAlertButton}
              onPress={onPress}>
              <Text style={styles.customAlertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const handleUpdate = async () => {
    try {
      const mspID = await AsyncStorage.getItem('mspID');

      const mspSettingsData = {
        mspID: mspID,
        type: 'u',
        messName: messName,
        messType: mealType,
        capacity: parseInt(capacityValue) || 0,
        autoConfirm: parseInt(autoconfirmValue) || 0,
        delivery: deliveryOption === 'Yes' ? 1 : 0,
        status: status === '0' ? '0' : '1',
        l_strtHrs: lunchStart,
        l_endHrs: lunchEnd,
        d_strtHrs: dinnerStart,
        d_endHrs: dinnerEnd,
        invoice: invoiceFrequency,
        del_chg: delChargesValue || 0,
      };

      const response = await manageMSPSettings(mspSettingsData);

      if (
        response &&
        response.status === 'SUCCESS' &&
        response.statusCode === 200 &&
        response.message &&
        response.message.status
      ) {
        showAlert();
      } else {
        console.log('Update failed or no mspID found');
      }
    } catch (error) {
      console.error('Error while updating:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-left"
            size={hp(5)}
            color="#D97706"
            onPress={() => navigation.goBack()}
          />
          <View style={{flex: 1}}></View>
        </View>
      </View>

      <Text style={styles.heading}>Account Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Mess Name</Text>
        <TextInput
          style={styles.textinput1}
          placeholder="Enter the Mess"
          placeholderTextColor={'#A3A3A3'}
          value={messName}
          onChangeText={text => setMessName(text)}
        />
      </View>

      {selectedTime && <Text>Selected Time: {formatTime(selectedTime)}</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Meal Type</Text>
        <View style={styles.buttonContainer}>
          {renderButton('Veg', mealType, handleMealTypeClick)}
          {renderButton('Non-veg', mealType, handleMealTypeClick)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Menu Hours</Text>
        <View style={styles.twoView}>
          <View style={styles.view}>
            <Icon name="white-balance-sunny" size={hp(2)} color="#7E22CE" />
            <TouchableOpacity
              onPress={() => showTimePickerForField('lunchStart')}>
              <TextInput
                placeholder="HH:MM"
                placeholderTextColor={'#A3A3A3'}
                style={styles.textinput}
                keyboardType="numeric"
                value={lunchStart}
                onFocus={() => showTimePickerForField('lunchStart')}
              />
            </TouchableOpacity>

            <Icon name="minus" size={hp(2.5)} color="#7E22CE" />
            <TouchableOpacity
              onPress={() => showTimePickerForField('lunchEnd')}>
              <TextInput
                placeholder="HH:MM"
                style={styles.textinput}
                placeholderTextColor={'#A3A3A3'}
                keyboardType="numeric"
                value={lunchEnd}
                onFocus={() => showTimePickerForField('lunchEnd')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.view}>
            <Icon name="moon-waning-crescent" size={hp(2)} color="#7E22CE" />
            <TouchableOpacity
              onPress={() => showTimePickerForField('dinnerStart')}>
              <TextInput
                placeholder="HH:MM"
                style={styles.textinput}
                placeholderTextColor={'#A3A3A3'}
                keyboardType="numeric"
                value={dinnerStart}
                onFocus={() => showTimePickerForField('dinnerStart')}
              />
            </TouchableOpacity>

            <Icon name="minus" size={hp(2.5)} color="#7E22CE" />
            <TouchableOpacity
              onPress={() => showTimePickerForField('dinnerEnd')}>
              <TextInput
                placeholder="HH:MM"
                placeholderTextColor={'#A3A3A3'}
                style={styles.textinput}
                keyboardType="numeric"
                value={dinnerEnd}
                onFocus={() => showTimePickerForField('dinnerEnd')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Invoice Frequency</Text>
        <View style={styles.buttonContainer}>
          {renderButton(
            '7 Days',
            invoiceFrequency,
            handleInvoiceFrequencyClick,
          )}
          {renderButton(
            '15 days',
            invoiceFrequency,
            handleInvoiceFrequencyClick,
          )}
          {renderButton(
            '30 days',
            invoiceFrequency,
            handleInvoiceFrequencyClick,
          )}
        </View>
      </View>

      <View style={{flexDirection: 'row'}}>
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Avg Meal Capacity</Text>
          <TextInput
            style={styles.textinput2}
            placeholder="Count in plates"
            placeholderTextColor={'#A3A3A3'}
            keyboardType="numeric"
            value={capacityValue}
            onChangeText={text => setCapacityValue(text)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Autoconfirm</Text>
          <TextInput
            style={styles.textinput2}
            placeholder="Enter the Autoconfirm Number"
            placeholderTextColor={'#A3A3A3'}
            keyboardType="numeric"
            value={autoconfirmValue}
            onChangeText={text => setAutoconfirmValue(text)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Delivery Option</Text>
        <View style={styles.buttonContainer}>
          {renderButton('Yes', deliveryOption, handleDeliveryOptionClick)}
          {renderButton('No', deliveryOption, handleDeliveryOptionClick)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Delivery Charges</Text>
        <TextInput
          style={styles.textinput1}
          placeholder="Enter the Delivery Charges"
          placeholderTextColor={'#A3A3A3'}
          keyboardType="numeric"
          value={delChargesValue}
          onChangeText={text => setDelChargesValue(text)}
        />
      </View>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />

      <CustomAlert
        isVisible={isAlertVisible}
        message="Successfully updated the data"
        onPress={hideAlert}
      />

      {!userDataExists ? (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonTexts}>Submit</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.buttonTexts}>Update</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default AccSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: 'grey',
    marginLeft: wp(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'red'
  },
  heading: {
    color: '#D97706',
    fontSize: hp(3),
    fontWeight: '400',
    marginLeft: wp(2),
    alignSelf: 'center',
  },
  section: {
    // marginVertical: hp(1),
    marginHorizontal: hp(1),
    marginTop: 15,
  },
  sectionHeading: {
    color: '#404040',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 5,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    marginVertical: hp(1),
    paddingHorizontal: 10,
    gap: 10,
  },

  buttonStyle: {
    backgroundColor: '#FFF',
    width: wp(20),
    height: hp(4),
    borderRadius: wp(1),
    borderColor: '#F59E0B',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 6,
    // paddingHorizontal: 10,
    // margin: 2,
    flexDirection: 'row',
    // gap: 10,
  },

  selectedButton: {
    backgroundColor: '#D97706',
  },
  buttonText: {
    textAlign: 'center',
    color: '#D97706',
    fontSize: hp(2),
    fontWeight: '400',
  },
  selectedText: {
    color: 'white',
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: wp(2),
    marginTop: 20,
  },
  textinput: {
    backgroundColor: '#fff',
    width: wp(30),
    borderRadius: 5,
    paddingHorizontal: wp(2),
    color: '#404040',
    height: hp(5.3),
  },
  textinput1: {
    backgroundColor: '#fff',
    width: wp(90),
    height: hp(5.3),
    borderRadius: 6,
    borderColor: '#A3A3A3',
    borderWidth: 0,
    paddingLeft: wp(2),
    // marginLeft: wp(2),
    margin: wp(2),
    color: '#404040',
  },
  textinput2: {
    backgroundColor: '#fff',
    width: wp(30),
    height: hp(5.3),
    borderRadius: 6,
    borderColor: '#A3A3A3',
    borderWidth: 0,
    paddingLeft: wp(2),
    // marginLeft: wp(2),
    margin: wp(2),
    color: '#404040',
  },

  twoView: {
    justifyContent: 'space-evenly',
    height: hp(12),
  },
  submitButton: {
    height: hp(5),
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonTexts: {
    color: '#fff',
    fontSize: hp(2.5),
    fontWeight: 'bold',
  },
  otp_img: {
    width: '80%',
    height: '20%',
    marginHorizontal: 25,
  },
  customAlertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customAlertContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    borderColor: '#F59E0B',
    borderWidth: 1,
  },
  customAlertMessage: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#404040',
  },
  customAlertButton: {
    backgroundColor: '#F59E0B',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  customAlertButtonText: {
    color: '#FFF',
    fontSize: hp(2),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});