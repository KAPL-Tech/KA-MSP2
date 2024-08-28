/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {manageBankDetails} from '../api/data/DataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BankDetails = ({navigation}) => {
  const [userID, setUserID] = useState(null);
  const [existingData, setExistingData] = useState(false);
  const [bID, setBID] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showSuccessModal = message => {
    setSuccessModalVisible(true);
    setModalMessage(message);
  };

  const showErrorModal = message => {
    setErrorModalVisible(true);
    setModalMessage(message);
  };

  const closeModal = () => {
    setSuccessModalVisible(false);
    setErrorModalVisible(false);
    setModalMessage('');

    if (modalMessage === 'Successfully added the Bank Details') {
      navigation.navigate('AccSettings');
    } else if (modalMessage === 'Bank details updated successfully') {
      navigation.navigate('BottomNavigate');
    }
  };

  const [bankDetails, setBankDetails] = useState({
    userID: userID || '',
    type: existingData ? 'edit' : 'save',
    bankName: '',
    accountNo: '',
    accntName: '',
    ifsc: '',
    bID: bID.toString(),
  });

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem('userID');
        // console.log('stroeduserID', storedUserID);
        if (storedUserID !== null) {
          setUserID(storedUserID);
        }
      } catch (error) {
        console.error('Error fetching userID from AsyncStorage:', error);
      }
    };

    fetchUserID();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await manageBankDetails({userID, type: 'get'});
        // console.log('API Response:', response);

        if (response.status === 'SUCCESS' && response.message) {
          const fetchedData = response.message[0];
          setBankDetails({
            ...bankDetails,
            bankName: fetchedData.B_BANKNAME || '',
            accountNo: fetchedData.B_ACCOUNTNUMBER || '',
            accntName: fetchedData.B_ACCOUNTHOLDERNAME || '',
            ifsc: fetchedData.B_IFSCCODE || '',
            bID: fetchedData.B_ID.toString() || '',
          });
          setExistingData(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userID) {
      fetchData();
    }
  }, [userID]);

  const handleSave = async () => {
    try {
      const updatedBankDetails = {
        ...bankDetails,
        userID: userID,
        type: 'save',
      };

      const response = await manageBankDetails(updatedBankDetails);

      // console.log('Manage bank details response:', response);
      showSuccessModal('Successfully added the Bank Details');
      // navigation.navigate('AccSettings');
    } catch (error) {
      console.error('Error saving bank details:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!userID) {
        console.error('UserID is empty. Please log in.');
        return;
      }

      const updatedBankDetails = {
        ...bankDetails,
        userID: userID,
        type: existingData ? 'edit' : 'save',
      };

      const response = await manageBankDetails(updatedBankDetails);
      // console.log('Manage bank details response:', response);
      showSuccessModal('Bank details updated successfully');
    } catch (error) {
      console.error('Error while updating:', error);
    }
  };

  const handleChange = (key, value) => {
    setBankDetails(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSaveOrUpdate = async () => {
    if (existingData) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{flex: 1, backgroundColor: '#fff'}}
      enableOnAndroid={true}
      extraHeight={Platform.OS === 'android' ? hp(30) : 0}
      behavior={Platform.OS === 'android' ? 'padding' : null}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* <View>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={30}
            color="#F59E0B"
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Addresses</Text>
      </View> */}
        <Text style={styles.headerText}>Bank Details</Text>
        <Image
          source={require('../assets/bank_img.jpg')}
          resizeMode="contain"
          style={styles.headerImage}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={{color: '#404040'}}>Bank Name</Text>
        <TextInput
          placeholder={bankDetails.bankName || 'Enter the Bank name'}
          placeholderTextColor={'grey'}
          value={bankDetails.bankName}
          onChangeText={value => handleChange('bankName', value)}
          style={styles.input}
        />
        <Text style={{color: '#404040'}}>Account Number</Text>
        <TextInput
          placeholder={bankDetails.accountNo || 'Enter the Account Number'}
          placeholderTextColor={'grey'}
          value={bankDetails.accountNo}
          onChangeText={value => handleChange('accountNo', value)}
          style={styles.input}
        />

        <Text style={{color: '#404040'}}>Account Holder Name</Text>
        <TextInput
          placeholder={bankDetails.accntName || 'Enter the ACC holder name'}
          placeholderTextColor={'grey'}
          value={bankDetails.accntName}
          onChangeText={value => handleChange('accntName', value)}
          style={styles.input}
        />
        <Text style={{color: '#404040'}}>IFSC Code</Text>
        <TextInput
          placeholder={bankDetails.ifsc || 'Enter the ifsc code'}
          placeholderTextColor={'grey'}
          value={bankDetails.ifsc}
          onChangeText={value => handleChange('ifsc', value)}
          style={styles.input}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
              <Text style={styles.cancelText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
              <Text style={styles.cancelText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {existingData ? (
        <TouchableOpacity onPress={handleSaveOrUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleSaveOrUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    height: hp(40),
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  headerText: {
    color: '#D97706',
    fontSize: hp('4%'),
    fontWeight: '400',
    marginTop: hp(1),
  },
  headerImage: {
    width: wp('50%'),
    height: hp('25%'),
  },
  formContainer: {
    justifyContent: 'space-evenly',
    height: hp('50%'),
    padding: hp('1'),
    marginBottom: 10,
  },
  label: {
    color: '#404040',
    fontSize: hp('2.1%'),
    fontWeight: '400',
    paddingLeft: wp('1'),
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#fff',
    width: wp('90%'),
    borderColor: '#D4D4D4',
    borderRadius: wp('2%'),
    color: '#404040',
  },
  button: {
    backgroundColor: '#F59E0B',
    width: wp('60%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('10%'),
    marginTop: hp('0.2%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: hp('3%'),
    fontWeight: '500',
  },
  inputContainer: {
    justifyContent: 'space-evenly',
    height: hp('53%'),
    padding: hp('2'),
    // marginBottom:2
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    color: '#404040',
    marginBottom: 15,
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F59E0B',
    marginTop: 15,
    alignSelf: 'center',
  },
  cancelText: {
    fontSize: 18,
    color: '#FFF',
  },
};

export default BankDetails;
