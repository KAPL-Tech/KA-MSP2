import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

//getFAQs APi

export const getFAQs = async () => {
  try {
    const response = await api.post('/getFAQs');

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Unexpected status code:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    return null;
  }
};

//SignIN APi

export const signIn = async (mobile, type) => {
  const requestBody = {mobile, type};

  try {
    const response = await api.post('/signIn', requestBody);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw error;
  }
};

//Validate otp api

export const validateOTP = async (mobile, otp, type) => {
  try {
    const response = await api.post('/validateOTP', {mobile, otp, type});

    if (response.status === 200) {
      // console.log('OTP validation succeeded', response.status);
      return response;
    } else {
      // console.log('OTP validation failed');
      if (
        response.status === 520 &&
        response.data &&
        response.data.message === 'Incorrect OTP'
      ) {
        Alert.alert('Incorrect OTP', 'Please enter the correct OTP.');
      } else {
        console.log('Server error:', response.data.message);
        Alert.alert('Incorrect OTP', 'Please enter the correct OTP.');
      }
      throw new Error('OTP validation failed');
    }
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      Alert.alert('Incorrect OTP', 'Please enter the correct OTP.');
      throw new Error('Server Error. Please try again later.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      Alert.alert('No Response', 'Please check your internet connection.');
      throw new Error(
        'No response from the server. Please check your internet connection.',
      );
    } else {
      console.error('Error in request setup:', error.message);
      Alert.alert('Request Error', 'Please try again.');
      throw new Error('Error in API request. Please try again.');
    }
  }
};

//resendOTP API
export const resendOTP = async mobile => {
  try {
    const response = await api.post('/resendOTP', {mobile});
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to resend OTP');
    }
  } catch (error) {
    throw new Error('Error while resending OTP');
  }
};

//manageBankDetails API

export const manageBankDetails = async bankDetails => {
  try {
    const response = await api.post('/manageBankDetails', bankDetails);

    // console.log('API Response:', response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to manage bank details');
    }
  } catch (error) {
    console.error('Error while managing bank details:', error);
    console.error('Error details:', error.response?.data?.message?.details);

    throw new Error('Error while managing bank details');
  }
};

// Signup Screen Api

export const handleApi = async data => {
  try {
    const response = await api.post('/createCustomer', data);
    console.log('data', response);

    if (response.status === 200) {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      // console.log(data, 'signup');
    }

    return response;
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      Alert.alert(
        'Customer Already Exists.',
        'Please use different number to Signup or Login with same number  ',
      );
      throw new Error('Server Error. Please try again later.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      Alert.alert('No Response', 'Please check your internet connection.');
      throw new Error(
        'No response from the server. Please check your internet connection.',
      );
    } else {
      console.error('Error in request setup:', error.message);
      Alert.alert('Request Error', 'Please try again.');
      throw new Error('Error in API request. Please try again.');
    }
  }
};

// MSPAddress API

export const manageMSPAddress = async ({
  userID,
  reqtype,
  line1,
  line2,
  city,
  state,
  pincode,
  latitude,
  longitude,
  addID,
}) => {
  try {
    // console.log('API Request Data:', {
    //   userID,
    //   reqtype,
    //   line1,
    //   line2,
    //   city,
    //   state,
    //   pincode,
    //   latitude,
    //   longitude,
    //   addID,
    // });

    const response = await api.post('/manageMSPAddress', {
      userID,
      reqtype,
      line1,
      line2,
      city,
      state,
      pincode,
      latitude,
      longitude,
      addID,
    });

    // console.log('API Response:', response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch consumer addresses');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

//AccSetting api

export const manageMSPSettings = async mspSettingsData => {
  try {
    console.log('mspSettingsData', mspSettingsData);
    const response = await api.post('/manageMSPSettings', mspSettingsData);

    console.log('API Response:', response);

    if (response.status === 200) {
      console.log('API Response Data:', response.data);
      return response.data;
    } else {
      throw new Error('Failed to manage MSP settings');
    }
  } catch (error) {
    console.error('Error while managing MSP settings:', error);
    throw new Error('Error while managing MSP settings');
  }
};

//EditProfile API
export const editConsumerProfile = async profileData => {
  try {
    const response = await api.post('/editConsumerProfile', profileData);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to edit consumer profile');
    }
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      Alert.alert('Server Error', 'Please try again later.');
      throw new Error('Server Error. Please try again later.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      Alert.alert('No Response', 'Please check your internet connection.');
      throw new Error(
        'No response from the server. Please check your internet connection.',
      );
    } else {
      console.error('Error in request setup:', error.message);
      Alert.alert('Request Error', 'Please try again.');
      throw new Error('Error in API request. Please try again.');
    }
  }
};

//getEnrolledPackages
export const getEnrolledPackages = async userID => {
  try {
    const requestBody = {userID};

    const response = await api.post('/getEnrolledPackages', requestBody);

    if (response.status === 200) {
      const packages = response.data.message;
      return packages;
    } else {
      console.error(`Unexpected status code: ${response.status}`);
      return [];
    }
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      Alert.alert('Server Error', 'Please try again later.');
      throw new Error('Server Error. Please try again later.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      Alert.alert('No Response', 'Please check your internet connection.');
      throw new Error(
        'No response from the server. Please check your internet connection.',
      );
    } else {
      console.error('Error in request setup:', error.message);
      Alert.alert('Request Error', 'Please try again.');
      throw new Error('Error in API request. Please try again.');
    }
  }
};

//getOrderHistory
export const getOrderHistory = async (mspID, date, type) => {
  // const request = { userID, date };
  try {
    const response = await api.post('/getOrderHistory', {mspID, date, type});

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch order history');
    }
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      // Alert.alert('Server Error', 'Please try again later.');
      throw new Error('Server Error. Please try again later.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      // Alert.alert('No Response', 'Please check your internet connection.');
      throw new Error(
        'No response from the server. Please check your internet connection.',
      );
    } else {
      console.error('Error in request setup:', error.message);
      // Alert.alert('Request Error', 'Please try again.');
      throw new Error('Error in API request. Please try again.');
    }
  }
};

// getInvoiceList API

export const getInvoiceItems = async mspID => {
  try {
    // console.log('Request parameters:', { mspID});
    const response = await api.post('/getInvoiceItems', {mspID});
    // console.log(response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch invoice list');
    }
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('Server Error. Please try again later.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error(
        'No response from the server. Please check your internet connection.',
      );
    } else {
      console.error('Error in request setup:', error.message);
      throw new Error('Error in API request. Please try again.');
    }
  }
};

//getMenuITemList

export const getMenuItemList = async mspID => {
  try {
    const response = await api.post('/getMenuItemList', {mspID});
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch menu items');
    }
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw new Error('Error fetching menu items');
  }
};

// addMenuItem  APi call

export const addMenuDetails = async menuDetails => {
  try {
    console.log('Menu Details:', menuDetails);
    const response = await api.post('/addMenuDetails', menuDetails);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to add menu details');
    }
  } catch (error) {
    console.error('Error adding menu details:', error);
    throw new Error('Error adding menu details');
  }
};

//MSP approved

export const getMspStatus = async (userID, type, mspID, status) => {
  try {
    // console.log('API Request Parameters:', { userID, type, mspID, status });

    const response = await api.post('/getMspStatus', {
      userID,
      type,
      mspID,
      status,
    });
    // console.log('API Response:', response.data);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`API request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(
      'Error fetching MSP status:',
      error.response?.data || error.message,
    );
    throw new Error('Error fetching MSP status');
  }
};

//getMSPMenuDetails

export const getMSPMenuDetails = async MSP_ID => {
  try {
    const requestBody = {mspID: MSP_ID};

    const response = await api.post('/getMSPMenuDetails', requestBody);

    if (response.status === 200) {
      return response.data.message;
    } else {
      console.error(`Unexpected status code: ${response.status}`);
      console.error('Unexpected status code received from the server.');
      throw new Error('Unexpected status code received from the server.');
    }
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      console.error('Server Error. Please try again later.');
      throw new Error('Server Error. Please try again later.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      console.error(
        'No response from the server. Please check your internet connection.',
      );
      throw new Error(
        'No response from the server. Please check your internet connection.',
      );
    } else {
      console.error('Error in request setup:', error.message);
      console.error('Error in API request. Please try again.');
      throw new Error('Error in API request. Please try again.');
    }
  }
};

//addFCMToken  Api

export const addFCMToken = async (userID, token, deviceID) => {
  try {
    if (!userID || !token || !deviceID) {
      console.error('User ID or FCM Token not available.');
      return null;
    }

    // console.log('Adding FCM Token for User ID:', userID, 'Token:', token, 'Device ID:', deviceID);

    const response = await api.post('/addFCMToken', {userID, token, deviceID});
    // console.log('Response from addFCMTOKEN API:', response);

    if (response.status === 200) {
      console.log('FCM Token added successfully');
      return response.data;
    } else {
      console.error('Failed to add FCM Token:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error adding FCM Token:', error);
    return null;
  }
};

//manageOrderStatus api

export const manageOrderStatus = async (orderID, status) => {
  try {
    // console.log('API Request Parameters:', { orderID, status });

    const response = await api.post('/manageOrderStatus', {orderID, status});
    // console.log('API Response:', response.data);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`API request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(
      'Error fetching MSP status:',
      error.response?.data || error.message,
    );
    throw new Error('Error fetching MSP status');
  }
};

export const deleteAccount = async (userid, status) => {
  try {
    // Log the parameters before making the API call
    console.log('Deleting account with userID:', userid);
    console.log('Status:', status);

    const response = await api.post('/deleteAccount', { userid, status });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`API request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(
      'Error deleting account:',
      error.response?.data || error.message
    );
    throw new Error('Error deleting account');
  }
};
